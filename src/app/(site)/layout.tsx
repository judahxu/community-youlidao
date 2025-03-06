'use client';
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  LogOut,
  Settings
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Add this type definition at the top of your file
type User = {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
};

const DashboardLayout = ({ children, user = null }:{ children: React.ReactNode; user?: User | null;}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // 检查用户是否已认证
  const isAuthenticated = status === "authenticated";
  
  // 处理滚动效果
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 切换暗黑模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // 处理登出
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // 获取用户头像信息
  const getUserInitials = () => {
    const currentUser = user ?? session?.user;
    if (!currentUser?.name) return "AI";
    
    // 提取用户名的前两个字符作为头像备用显示
    const nameParts = currentUser.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0]![0]}${nameParts[1]![0]}`.toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`min-h-screen bg-gray-50 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* 顶部导航 */}
      <header 
        className={`fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 z-30 transition-all duration-300 ${
          scrolled ? 'shadow-md' : 'border-b border-gray-200 dark:border-gray-800'
        }`}
      >
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            {/* 移动端菜单触发器 */}
            <Sheet>
              <SheetTrigger className="lg:hidden">
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-[#3B7A9E] transition-colors" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-900">
                <Sidebar isAuthenticated={isAuthenticated} />
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/favicon.ico" alt="" className='w-8 h-8 mr-2' />
              <div className="text-xl font-bold text-gray-900 dark:text-white">AI尤里岛</div>
            </Link>
          </div>

          {/* 顶部导航项 */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-[#2A5674] dark:text-[#4A8CAB] font-medium hover:text-[#3B7A9E] transition-colors">Home</Link>
            <Link href="/learn" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#2A5674] transition-colors">学习中心</Link>
            <Link href="/tools" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#2A5674] transition-colors">工具导航</Link>
            <Link href="/membership" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#2A5674] transition-colors">
              会员服务
              <Badge className="ml-1.5 bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB] text-xs">PRO</Badge>
            </Link>
          </nav>

          {/* 右侧功能 */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleDarkMode}
            >
              {darkMode ? 
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : 
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
            
            {isAuthenticated ? (
              // 已登录用户显示通知和头像
              <>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-[#2A5674] rounded-full"></span>
                </Button>
                
                {/* 用户下拉菜单 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800 cursor-pointer">
                      {session?.user?.image ? (
                        <AvatarImage 
                          src={session.user.image} 
                          alt={session.user.name || '用户头像'} 
                        />
                      ) : null}
                      <AvatarFallback className="bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session?.user?.name || '用户'}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email || ''}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>个人中心</span>
                      </Link>
                    </DropdownMenuItem>
                    {session?.user.role === 'admin' && <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>管理后台</span>
                      </Link>
                    </DropdownMenuItem>}
                    {/* <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>设置</span>
                      </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>退出登录</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // 未登录用户显示登录和注册按钮
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-[#2A5674] dark:text-[#4A8CAB] hover:bg-[#E5F0F6] dark:hover:bg-[#2A5674]/20">
                    <LogIn className="h-4 w-4 mr-1" />
                    登录
                  </Button>
                </Link>
                
                <Link href="/register">
                  <Button size="sm" className="bg-[#2A5674] hover:bg-[#3B7A9E] text-white">
                    <UserPlus className="h-4 w-4 mr-1" />
                    注册
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <div className={`pt-16 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* 桌面侧边栏 - 仅在登录状态显示 */}
        {isAuthenticated && (
          <aside 
            className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-64'
            } hidden lg:block`}
          >
            <Sidebar isAuthenticated={isAuthenticated} />
            
            {/* 折叠按钮 */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow group"
            >
              {sidebarOpen ? 
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-[#2A5674] transition-colors" /> : 
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-[#2A5674] transition-colors" />
              }
            </button>
          </aside>
        )}

        {/* 主内容区域 */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
          {/* 未登录用户显示登录提示 */}
          {!isAuthenticated && <AuthBanner />}
          {children}
        </main>
      </div>
    </div>
  );
};

// 侧边栏组件
const Sidebar = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <nav className="h-full py-6 px-2 overflow-y-auto">
      <div className="space-y-1">
        <SidebarSection title="新手起步" items={[
          { name: '平台介绍', badge: null, path: '/intro', requiresAuth: false },
          { name: '快速入门', badge: 'New', path: '/quickstart', requiresAuth: false },
          { name: '使用指南', badge: null, path: '/guide', requiresAuth: false }
        ]} isAuthenticated={isAuthenticated} />
        
        <SidebarSection title="学习资源" items={[
          { name: '直播课程', badge: null, path: '/learn/live', requiresAuth: false },
          { name: 'AI小教程', badge: 'Hot', path: '/learn/tutorials', requiresAuth: false },
          { name: '深度内容', badge: null, path: '/learn/advanced', requiresAuth: true },
          { name: '学习路径', badge: null, path: '/learn/paths', requiresAuth: false }
        ]} isAuthenticated={isAuthenticated} />
        
        <SidebarSection title="工具资源" items={[
          { name: 'AI工具箱', badge: null, path: '/tools/directory', requiresAuth: false },
          { name: '提示词库', badge: null, path: '/tools/prompts', requiresAuth: true },
          { name: '资源下载', badge: null, path: '/tools/downloads', requiresAuth: true }
        ]} isAuthenticated={isAuthenticated} />
        
        <SidebarSection title="社区互动" items={[
          { name: '在线交流', badge: null, path: '/community/chat', requiresAuth: true },
          { name: '共创共学', badge: null, path: '/community/collaborate', requiresAuth: true },
          { name: '彩虹屁墙', badge: null, path: '/community/praise', requiresAuth: false },
          { name: '我要提问', badge: null, path: '/community/questions', requiresAuth: true },
          { name: '前沿动态', badge: 'New', path: '/community/news', requiresAuth: false }
        ]} isAuthenticated={isAuthenticated} />
        
        <SidebarSection title="职业发展" items={[
          { name: '搞钱灵感', badge: null, path: '/career/ideas', requiresAuth: false },
          { name: '开源项目', badge: null, path: '/career/projects', requiresAuth: false },
          { name: '工作机会', badge: null, path: '/career/jobs', requiresAuth: false },
          { name: '专家服务', badge: 'Pro', path: '/career/experts', requiresAuth: true }
        ]} isAuthenticated={isAuthenticated} />
      </div>
      
      <div className="mt-8 mx-3 p-4 bg-[#E5F0F6] dark:bg-[#2A5674]/20 rounded-xl">
        <p className="text-sm text-[#2A5674] dark:text-[#4A8CAB] font-medium mb-2">升级到专业版</p>
        <p className="text-xs text-[#3B7A9E] dark:text-[#4A8CAB]/80 mb-3">解锁所有高级功能与内容</p>
        <Button size="sm" className="w-full bg-[#2A5674] hover:bg-[#3B7A9E] text-white">了解详情</Button>
      </div>
    </nav>
  );
};

// 侧边栏部分组件
const SidebarSection = ({ title, items, isAuthenticated }: { title: string, items: { name: string, badge: string | null, path: string, requiresAuth: boolean }[], isAuthenticated: boolean }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // 过滤出可见项目
  const visibleItems = items.filter(item => !item.requiresAuth || isAuthenticated);
  
  // 如果没有可见项目，则不显示此部分
  if (visibleItems.length === 0) return null;
  
  return (
    <div className="px-1 py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {title}
        <ChevronRight className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-90' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-1 space-y-1">
          {visibleItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="flex items-center px-8 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#3B7A9E] transition-colors group"
            >
              <span className="relative">
                {item.name}
                <span className="absolute bottom-0 left-0 h-0.5 bg-[#2A5674] dark:bg-[#4A8CAB] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
              
              {item.badge && (
                <Badge 
                  className={`ml-2 text-xs ${
                    item.badge === 'New' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                    item.badge === 'Hot' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300' :
                    'bg-[#2A5674] dark:bg-[#4A8CAB] dark:text-blue-300'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// 未登录用户的顶部提示横幅
const AuthBanner = () => {
  return (
    <div className="mb-6 p-4 rounded-lg bg-[#E5F0F6] dark:bg-[#2A5674]/20 border border-[#2A5674]/20 dark:border-[#4A8CAB]/20">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="flex-shrink-0 bg-[#2A5674]/10 dark:bg-[#4A8CAB]/10 rounded-full p-2 mr-3">
            <User className="h-5 w-5 text-[#2A5674] dark:text-[#4A8CAB]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">登录以获取完整体验</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">注册账号后可以解锁更多学习资源和社区互动</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href="/login">
            <Button variant="outline" size="sm" className="text-[#2A5674] dark:text-[#4A8CAB] border-[#2A5674]/30 dark:border-[#4A8CAB]/30">
              登录
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-[#2A5674] hover:bg-[#3B7A9E] text-white">
              注册
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;