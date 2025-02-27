// src/auth/credentials-provider.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/server/db";
import { users, userPasswords } from "@/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * 凭据提供者配置
 * 处理用户名密码登录
 */
export const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    try {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("缺少登录凭据");
      }

      // 从数据库查询用户
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, credentials.email.toLowerCase()))
        .limit(1);

      if (user.length === 0) {
        // 用户不存在
        throw new Error("邮箱或密码错误");
      }

      // 验证密码
      const userPassword = await db
        .select()
        .from(userPasswords)
        .where(eq(userPasswords.userId, user[0].id))
        .limit(1);

      if (!userPassword.length) {
        throw new Error("未找到用户密码");
      }

      const isPasswordValid = await compare(
        credentials.password,
        userPassword[0].hash
      );

      if (!isPasswordValid) {
        throw new Error("邮箱或密码错误");
      }

      // 返回用户信息（不包含敏感数据）
      return {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        image: user[0].image,
      };
    } catch (error) {
      console.error("认证错误:", error);
      return null;
    }
  },
});