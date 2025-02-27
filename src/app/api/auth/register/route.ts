// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcrypt';
import { db } from '@/server/db';
import { users, userPasswords } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

// 注册请求验证
const registerSchema = z.object({
  email: z.string()
    .email({ message: '请输入有效的邮箱地址' })
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, { message: '密码至少需要8个字符' })
    .max(100, { message: '密码长度不能超过100个字符' }),
});

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证请求数据
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: '请求数据无效', 
          errors: result.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // 检查邮箱是否已被注册
    const existingUser = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: '该邮箱已被注册' }, 
        { status: 400 }
      );
    }

    let userId: string;

    // 使用事务确保用户和密码同时创建
    await db.transaction(async (tx) => {
      // 创建用户
      await tx.insert(users)
        .values({
          email,
          name: email.split('@')[0], // 默认使用邮箱前缀作为用户名
          emailVerified: new Date(), // 由于已经通过验证码验证过邮箱，所以直接设置为已验证
          role: "user", // 默认为普通用户
          status: "active", // 账号状态为激活
        });
      
      // 查询刚刚创建的用户以获取ID
      const newUser = await tx.select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (newUser.length === 0) {
        throw new Error('创建用户失败');
      }
      userId = newUser[0]!.id;
      // 对密码进行哈希
      const hashedPassword = await hash(password, 10);
      
      // 存储哈希后的密码
      await tx.insert(userPasswords)
        .values({
          userId: userId,
          hash: hashedPassword,
        });
    });
    
    // 查询创建的用户以返回ID
    const newUser = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '注册成功',
      userId: newUser[0]!.id
    });
    
  } catch (error) {
    console.error('注册API错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' }, 
      { status: 500 }
    );
  }
}