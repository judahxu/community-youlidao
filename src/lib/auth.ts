// src/lib/auth.ts
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

/**
 * 获取当前登录用户的会话
 * 在服务器组件中使用
 */
export async function getSession() {
  return await auth();
}

/**
 * 获取当前登录用户
 * 在服务器组件中使用
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * 要求用户已登录，否则重定向到登录页面
 * 在服务器组件中使用，用于保护需要登录的页面
 * @param redirectTo 重定向地址，默认为 /login
 */
export async function requireAuth(redirectTo: string = "/login") {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect(`${redirectTo}?error=SessionRequired`);
  }
  
  return user;
}

/**
 * 要求用户未登录，否则重定向到首页
 * 在服务器组件中使用，用于阻止已登录用户访问登录/注册页
 * @param redirectTo 重定向地址，默认为 /home
 */
export async function requireGuest(redirectTo: string = "/home") {
  const user = await getCurrentUser();
  
  if (user) {
    redirect(redirectTo);
  }
}