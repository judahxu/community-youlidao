'use client';

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

/**
 * 会话调试组件
 * 用于在开发环境中显示会话信息，帮助调试
 */
export function SessionInfo() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>会话调试信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">状态:</p>
            <p className={`${status === "authenticated" ? "text-green-500" : status === "loading" ? "text-yellow-500" : "text-red-500"}`}>
              {status === "authenticated" ? "已认证" : status === "loading" ? "加载中" : "未认证"}
            </p>
          </div>

          {status === "authenticated" ? (
            <>
              <div>
                <p className="font-semibold">用户ID:</p>
                <p>{session?.user?.id || "未知"}</p>
              </div>
              <div>
                <p className="font-semibold">用户名:</p>
                <p>{session?.user?.name || "未知"}</p>
              </div>
              <div>
                <p className="font-semibold">邮箱:</p>
                <p>{session?.user?.email || "未知"}</p>
              </div>
              <div>
                <p className="font-semibold">完整会话:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </>
          ) : status === "unauthenticated" ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>未登录或会话已过期</AlertDescription>
            </Alert>
          ) : (
            <p>正在加载会话信息...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}