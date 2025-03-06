import { requireAuth } from "@/lib/auth";
import { SessionInfo } from "@/components/debug/session-info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * 用户资料页面
 * 此页面要求用户已登录
 */
export default async function ProfilePage() {
  // 确保用户已登录
  const user = await requireAuth();

  // 获取用户头像显示文本
  const getAvatarText = () => {
    if (!user.name) return "U";
    
    const nameParts = user.name.split(" ");
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">个人中心</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>用户资料</CardTitle>
          <CardDescription>查看和管理您的个人信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name || "用户头像"} />
              ) : null}
              <AvatarFallback className="text-xl bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]">
                {getAvatarText()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-2xl font-semibold">{user.name || "用户"}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 仅在开发环境显示会话调试信息 */}
      {process.env.NODE_ENV === "development" && <SessionInfo />}
    </div>
  );
}