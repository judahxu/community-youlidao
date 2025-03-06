'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Filter,
  RefreshCw,
  Check,
  Loader2,
  ArrowUpDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useDebounce } from "@/lib/hooks/use-debounce";

type UserStatusType = 'active' | 'pending' | 'inactive';

// 用户状态组件
const UserStatus = ({ status }: { status: UserStatusType }) => {
  const statusStyles: Record<UserStatusType, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  };

  const statusLabels: Record<UserStatusType, string> = {
    active: '已激活',
    pending: '待验证',
    inactive: '未激活'
  };

  return (
    <Badge className={`${statusStyles[status]} font-medium`}>
      {statusLabels[status]}
    </Badge>
  );
};

type UserRoleType = 'admin' | 'editor' | 'member';
// 用户角色组件
const UserRole = ({ role }: { role: UserRoleType }) => {
  const roleStyles: Record<UserRoleType, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  };

  const roleLabels: Record<UserRoleType, string> = {
    admin: '管理员',
    editor: '编辑',
    member: '会员'
  };

  return (
    <Badge className={`${roleStyles[role]} font-medium`}>
      {roleLabels[role]}
    </Badge>
  );
};

// 用户列表页面组件
const UsersPage = () => {
  // 定义查询参数状态
  const [queryParams, setQueryParams] = useState<{
    page: number;
    perPage: number;
    search: string;
    status: 'all' | UserStatusType;
    role: 'all' | UserRoleType;
    sortBy: 'name' | 'email' | 'status' | 'role' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  }>({
    page: 1,
    perPage: 10,
    search: '',
    status: 'all',
    role: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // 搜索防抖
  const debouncedSearch = useDebounce(queryParams.search, 500);
  
  // 使用tRPC获取用户数据（带分页）
  const { 
    data: usersData, 
    isLoading, 
    isError, 
    refetch 
  } = api.user.getUsers.useQuery({
    ...queryParams,
    search: debouncedSearch,
  });
  
  // 更新用户状态的mutation
  const updateUserStatusMutation = api.user.updateStatus.useMutation({
    onSuccess: () => {
      toast("用户状态已更新");
      void refetch();
    },
    onError: (error) => {
      toast(error.message || "更新状态失败");
    },
  });

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({
      ...queryParams,
      search: e.target.value,
      page: 1, // 重置到第一页
    });
  };

  // 处理状态筛选
  const handleStatusFilter = (value: UserStatusType | 'all') => {
    setQueryParams({
      ...queryParams,
      status: value,
      page: 1, // 重置到第一页
    });
  };

  // 处理角色筛选
  const handleRoleFilter = (value: UserRoleType | 'all') => {
    setQueryParams({
      ...queryParams,
      role: value,
      page: 1, // 重置到第一页
    });
  };
  
  // 处理排序
  const handleSort = (column: 'name' | 'email' | 'status' | 'role' | 'createdAt') => {
    setQueryParams({
      ...queryParams,
      sortBy: column,
      sortOrder: queryParams.sortBy === column && queryParams.sortOrder === 'desc' ? 'asc' : 'desc',
    });
  };

  // 处理翻页
  const handlePageChange = (newPage: number) => {
    setQueryParams({
      ...queryParams,
      page: newPage,
    });
  };
  
  // 处理每页数量变化
  const handlePerPageChange = (value: string) => {
    setQueryParams({
      ...queryParams,
      perPage: parseInt(value),
      page: 1, // 重置到第一页
    });
  };

  // 更新用户状态
  const handleUpdateUserStatus = (userId: string, newStatus: UserStatusType) => {
    updateUserStatusMutation.mutate({ id: userId, status: newStatus });
  };

  // 格式化日期
  const formatDate = (date: Date | null) => {
    if (!date) return '未验证';
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 处理重置筛选器
  const handleResetFilters = () => {
    setQueryParams({
      ...queryParams,
      search: '',
      status: 'all',
      role: 'all',
      page: 1,
    });
  };

  // 获取分页信息
  const pagination = usersData?.pagination ?? { page: 1, totalPages: 1, totalCount: 0 };
  const users = usersData?.data ?? [];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground">
            管理平台用户
          </p>
        </div>
      </div>

      {/* 用户列表卡片 */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            平台注册用户，共 {pagination.totalCount || 0} 位用户
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* 过滤器和搜索 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="搜索用户名或邮箱..." 
                  className="pl-10 border-gray-200 dark:border-gray-800"
                  value={queryParams.search}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={queryParams.status} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-36 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="所有状态" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>状态筛选</SelectLabel>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="active">已激活</SelectItem>
                      <SelectItem value="pending">待验证</SelectItem>
                      <SelectItem value="inactive">未激活</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={queryParams.role} onValueChange={handleRoleFilter}>
                  <SelectTrigger className="w-36 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="所有角色" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>角色筛选</SelectLabel>
                      <SelectItem value="all">所有角色</SelectItem>
                      <SelectItem value="admin">管理员</SelectItem>
                      <SelectItem value="member">会员</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  className="border-gray-200 dark:border-gray-800 text-gray-500 gap-2"
                  onClick={handleResetFilters}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>重置</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">每页显示</span>
                <Select 
                  value={queryParams.perPage.toString()} 
                  onValueChange={handlePerPageChange}
                >
                  <SelectTrigger className="w-16 h-8 text-xs border-gray-200 dark:border-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">条记录</span>
              </div>
            </div>
          </div>

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 text-[#2A5674] animate-spin" />
              <span className="ml-2 text-gray-500">加载用户数据...</span>
            </div>
          )}

          {/* 错误状态 */}
          {isError && (
            <div className="flex justify-center items-center h-32 text-red-500">
              <p>获取用户数据失败，请刷新页面或稍后再试</p>
            </div>
          )}

          {/* 用户表格 */}
          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                      <div className="flex items-center">
                        用户
                        {queryParams.sortBy === 'name' && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${queryParams.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('role')} className="cursor-pointer">
                      <div className="flex items-center">
                        角色
                        {queryParams.sortBy === 'role' && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${queryParams.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                      <div className="flex items-center">
                        状态
                        {queryParams.sortBy === 'status' && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${queryParams.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>邮箱验证</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} />
                              <AvatarFallback className="bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]">
                                {user.name ? user.name.slice(0, 2) : 'UN'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name ?? '未命名用户'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <UserRole role={user.role as UserRoleType} />
                        </TableCell>
                        <TableCell>
                          <UserStatus status={user.status as UserStatusType} />
                        </TableCell>
                        <TableCell>
                          {formatDate(user.emailVerified)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>更改状态</DropdownMenuLabel>
                                {user.status !== 'active' && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer"
                                    onClick={() => handleUpdateUserStatus(user.id, 'active')}
                                  >
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    设为已激活
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'pending' && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer"
                                    onClick={() => handleUpdateUserStatus(user.id, 'pending')}
                                  >
                                    <Check className="h-4 w-4 mr-2 text-amber-500" />
                                    设为待验证
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'inactive' && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer"
                                    onClick={() => handleUpdateUserStatus(user.id, 'inactive')}
                                  >
                                    <Check className="h-4 w-4 mr-2 text-gray-500" />
                                    设为未激活
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        未找到匹配的用户
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* 分页 */}
          {!isLoading && !isError && users.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500">
                显示 {((pagination.page - 1) * queryParams.perPage) + 1} - {Math.min(pagination.page * queryParams.perPage, pagination.totalCount)} 共 {pagination.totalCount} 条
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page > 1) handlePageChange(pagination.page - 1);
                      }}
                      className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems(pagination.page, pagination.totalPages).map((item, index) => (
                    <PaginationItem key={index}>
                      {item === '...' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(item as number);
                          }}
                          isActive={item === pagination.page}
                          className={item === pagination.page ? "bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]" : ""}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page < pagination.totalPages) handlePageChange(pagination.page + 1);
                      }}
                      className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 生成分页项目
function generatePaginationItems(currentPage: number, totalPages: number) {
  // 如果总页数小于7，直接返回所有页码
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 否则，生成带有省略号的分页
  const items = [];
  
  // 始终显示第一页
  items.push(1);
  
  // 如果当前页靠近开始
  if (currentPage <= 3) {
    items.push(2, 3, 4, '...', totalPages - 1, totalPages);
  } 
  // 如果当前页靠近结束
  else if (currentPage >= totalPages - 2) {
    items.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } 
  // 如果当前页在中间
  else {
    items.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }
  
  return items;
}

export default UsersPage;