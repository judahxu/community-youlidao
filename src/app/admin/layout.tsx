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
  Settings,
  Users,
  BookOpen,
  FileText,
  Wrench,
  MessageSquare,
  BarChart2,
  Shield,
  LogOut,
  Home
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, usePathname } from 'next/navigation';

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
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

  return (
    <div className={`min-h-screen bg-gray-100 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
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
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <div className="flex items-center">
              <img src="/favicon.ico" alt="" className='w-8 h-8 mr-2' />
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                <span>AI尤里岛</span>
                <span className="ml-2 text-sm font-normal bg-[#2A5674] text-white dark:bg-[#4A8CAB] px-2 py-0.5 rounded">管理后台</span>
              </div>
            </div>
          </div>

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
            
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 font-medium ml-2">
              <Shield className="h-4 w-4 mr-2 text-[#2A5674] dark:text-[#4A8CAB]" />
              管理员
            </Button>
            
            <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
              <AvatarFallback className="bg-[#2A5674] text-white dark:bg-[#4A8CAB]">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        {/* 桌面侧边栏 */}
        <aside 
          className={`fixed left-0 top-16 bottom-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:block`}
        >
          <AdminSidebar collapsed={!sidebarOpen} />
          
          {/* 折叠按钮 */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-24 transform bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow group"
          >
            {sidebarOpen ? 
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-[#2A5674] transition-colors" /> : 
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-[#2A5674] transition-colors" />
            }
          </button>
        </aside>

        {/* 主内容区域 */}
        <main className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300">
          {/* 面包屑 */}
          <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Home className="h-4 w-4 mr-2" />
            <span>管理后台</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 dark:text-white font-medium">控制台</span>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
};

// 管理后台侧边栏组件
const AdminSidebar = ({ collapsed = false }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const navItems = [
    { 
      icon: <BarChart2 className="h-5 w-5" />, 
      label: '控制台', 
      href: '/admin',
      active: true, 
      notification: null 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: '用户管理', 
      href: '/admin/users',
      active: false, 
      notification: '12' 
    },
    { 
      icon: <BookOpen className="h-5 w-5" />, 
      label: '内容管理',
      href: '/admin/content', 
      active: false, 
      notification: null,
      children: [
        { label: '课程管理', href: '/admin/content/courses', active: false },
        { label: '教程管理', href: '/admin/content/tutorials', active: false },
        { label: '学习路径', href: '/admin/content/paths', active: false },
      ]
    },
    { 
      icon: <Wrench className="h-5 w-5" />, 
      label: '工具管理',
      href: '/admin/tools',
      active: false, 
      notification: null 
    },
    { 
      icon: <MessageSquare className="h-5 w-5" />, 
      label: '社区管理',
      href: '/admin/community',
      active: false, 
      notification: '5',
      children: [
        { label: '文章审核', href: '/admin/community/posts', active: false },
        { label: '评论管理', href: '/admin/community/comments', active: false },
        { label: '用户反馈', href: '/admin/community/feedback', active: false },
      ]
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: '订单管理',
      href: '/admin/orders',
      active: false, 
      notification: null 
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: '系统设置',
      href: '/admin/settings',
      active: false, 
      notification: null,
      children: [
        { label: '基础设置', href: '/admin/settings/basic', active: false },
        { label: '权限设置', href: '/admin/settings/permissions', active: false },
        { label: '日志记录', href: '/admin/settings/logs', active: false },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/admin';
  };

  // Determine if a sub-item is active
  const isSubItemActive = (href: string) => pathname === href;

  return (
    <nav className="h-full py-6 overflow-y-auto">
      <div className="space-y-2 px-3">
        {navItems.map((item, index) => (
          <SidebarItem 
            key={index} 
            icon={item.icon} 
            label={item.label}
            href={item.href} 
            active={isActive(item.href)} 
            notification={item.notification}
            collapsed={collapsed}
            subItems={item.children?.map(subItem => ({
              ...subItem,
              active: isSubItemActive(subItem.href)
            }))}
            onNavigate={(path) => router.push(path)}
          />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Button 
          variant="ghost" 
          className={`w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          onClick={() => router.push('/')}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!collapsed && <span>退出系统</span>}
        </Button>
      </div>
    </nav>
  );
};

// 侧边栏项目组件
const SidebarItem = ({ 
  icon, 
  label, 
  href, 
  active, 
  notification, 
  collapsed, 
  subItems, 
  onNavigate 
}: { 
  icon: React.ReactNode, 
  label: string, 
  href: string, 
  active: boolean, 
  notification: string | null, 
  collapsed: boolean, 
  subItems?: { label: string, href: string, active: boolean }[],
  onNavigate: (path: string) => void 
}) => {  
  
  const [expanded, setExpanded] = useState(false);
  const handleClick = () => {
    if (subItems && !collapsed) {
      // If item has children and not collapsed, toggle expansion
      setExpanded(!expanded);
    } else if (href) {
      // Otherwise navigate to the href
      onNavigate(href);
    }
  };
  return (
    <div>
      <button 
        className={`flex items-center w-full rounded-lg transition-colors ${
          active 
            ? 'bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB] font-medium' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        } ${
          collapsed ? 'justify-center p-3' : 'px-3 py-3'
        }`}
        onClick={handleClick}
      >
        <div className={`${collapsed ? '' : 'mr-3'} ${active ? 'text-[#2A5674] dark:text-[#4A8CAB]' : ''}`}>
          {icon}
        </div>
        
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            
            {notification && (
              <Badge className="ml-auto bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {notification}
              </Badge>
            )}
            
            {subItems && (
              <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            )}
          </>
        )}
        
        {collapsed && notification && (
          <Badge className="absolute top-0 right-0 -mr-1 -mt-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
            {notification}
          </Badge>
        )}
      </button>
      
      {!collapsed && expanded && subItems && (
        <div className="mt-1 ml-10 space-y-1">
          {subItems.map((subItem, index) => (
            <button 
              key={index}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                subItem.active 
                  ? 'bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB] font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onNavigate(subItem.href)}
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLayout;