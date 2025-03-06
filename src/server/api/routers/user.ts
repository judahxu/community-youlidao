import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { eq, inArray, like, or, and, desc, asc, sql, count } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  // 获取分页用户列表 (仅管理员可访问)
  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        perPage: z.number().int().positive().default(10),
        search: z.string().optional(),
        status: z.enum(['all', 'active', 'pending', 'inactive']).default('all'),
        role: z.enum(['all', 'admin', 'editor', 'member']).default('all'),
        sortBy: z.enum(['name', 'email', 'status', 'role', 'createdAt']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, perPage, search, status, role, sortBy, sortOrder } = input;
        
        // 构建查询条件
        const whereConditions = [];
        
        // 搜索条件
        if (search && search.trim() !== '') {
          whereConditions.push(
            or(
              like(users.name || '', `%${search}%`),
              like(users.email, `%${search}%`)
            )
          );
        }
        
        // 状态筛选
        if (status !== 'all') {
          whereConditions.push(eq(users.status, status));
        }
        
        // 角色筛选
        if (role !== 'all') {
          whereConditions.push(eq(users.role, role));
        }
        
        // 构建最终查询条件
        const finalWhere = whereConditions.length > 0 
          ? and(...whereConditions)
          : undefined;
        
        // 计算总记录数
        const totalCountResult = await ctx.db
          .select({ count: count() })
          .from(users)
          .where(finalWhere);
        
        const totalCount = totalCountResult[0]?.count ?? 0;
        const totalPages = Math.ceil(totalCount / perPage);
        
        // 获取当前页数据
        const query = ctx.db.select().from(users).where(finalWhere);
        
        // 排序
        // if (sortOrder === 'asc') {
        //   query = query.orderBy(asc(users[sortBy]));
        // } else {
        //   query = query.orderBy(desc(users[sortBy]));
        // }
        
        // 分页
        const offset = (page - 1) * perPage;
        const query1 = query.limit(perPage).offset(offset); 
        
        const data = await query1;
        
        return {
          data,
          pagination: {
            page,
            perPage,
            totalCount,
            totalPages,
          },
        };
      } catch (error) {
        console.error("获取用户列表失败:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取用户列表失败，请稍后再试",
        });
      }
    }),

  // 更新用户状态 (仅管理员可访问)
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["active", "pending", "inactive"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // 检查用户是否存在
        const existingUser = await ctx.db.query.users.findFirst({
          where: eq(users.id, input.id),
        });

        if (!existingUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "未找到该用户",
          });
        }

        // 更新用户状态
        await ctx.db
          .update(users)
          .set({ status: input.status })
          .where(eq(users.id, input.id))

        const updatedUser = await ctx.db.query.users.findFirst({
          where: eq(users.id, input.id),
        });

        return updatedUser;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("更新用户状态失败:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "更新用户状态失败，请稍后再试",
        });
      }
    }),
});