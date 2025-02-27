'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
  Check
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 模拟用户数据
const mockUsers = [
  { 
    id: '1', 
    name: '张三', 
    email: 'zhangsan@example.com', 
    emailVerified: new Date('2023-10-15'), 
    image: '/images/avatars/01.jpg',
    status: 'active',
    role: 'admin',
    createdAt: new Date('2023-09-01')
  },
  { 
    id: '2', 
    name: '李四', 
    email: 'lisi@example.com', 
    emailVerified: new Date('2023-11-20'), 
    image: '/images/avatars/02.jpg',
    status: 'active',
    role: 'member',
    createdAt: new Date('2023-09-15')
  },
  { 
    id: '3', 
    name: '王五', 
    email: 'wangwu@example.com', 
    emailVerified: null, 
    image: '/images/avatars/03.jpg',
    status: 'pending',
    role: 'member',
    createdAt: new Date('2023-10-05')
  },
  { 
    id: '4', 
    name: '赵六', 
    email: 'zhaoliu@example.com', 
    emailVerified: new Date('2023-12-01'), 
    image: '/images/avatars/04.jpg',
    status: 'active',
    role: 'editor',
    createdAt: new Date('2023-10-20')
  },
  { 
    id: '5', 
    name: '钱七', 
    email: 'qianqi@example.com', 
    emailVerified: new Date('2024-01-10'), 
    image: null,
    status: 'inactive',
    role: 'member',
    createdAt: new Date('2023-11-10')
  },
  { 
    id: '6', 
    name: '孙八', 
    email: 'sunba@example.com', 
    emailVerified: new Date('2024-01-15'), 
    image: '/images/avatars/06.jpg',
    status: 'active',
    role: 'member',
    createdAt: new Date('2023-11-25')
  },
  { 
    id: '7', 
    name: '周九', 
    email: 'zhoujiu@example.com', 
    emailVerified: null, 
    image: '/images/avatars/07.jpg',
    status: 'pending',
    role: 'member',
    createdAt: new Date('2023-12-05')
  },
  { 
    id: '8', 
    name: '吴十', 
    email: 'wushi@example.com', 
    emailVerified: new Date('2024-02-01'), 
    image: '/images/avatars/08.jpg',
    status: 'active',
    role: 'editor',
    createdAt: new Date('2023-12-20')
  },
];

// 用户状态组件
const UserStatus = ({ status }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  };

  return (
    <Badge className={`${statusStyles[status]} font-medium`}>
      {status === 'active' ? '已激活' : status === 'pending' ? '待验证' : '未激活'}
    </Badge>
  );
};

// 用户角色组件
const UserRole = ({ role }) => {
  const roleStyles = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  };

  const roleLabels = {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const itemsPerPage = 5;

  // 处理搜索
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 处理状态筛选
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // 处理角色筛选
  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  // 处理选择用户
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // 打开删除确认框
  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // 关闭删除确认框
  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // 处理删除用户
  const handleDeleteUser = () => {
    // 这里应该是实际的删除操作
    console.log('删除用户', userToDelete);
    closeDeleteDialog();
  };

  // 过滤用户
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // 分页
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 格式化日期
  const formatDate = (date) => {
    if (!date) return '未验证';
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground">
            管理平台用户，查看详情，修改权限
          </p>
        </div>
        <Button className="bg-[#2A5674] hover:bg-[#3B7A9E] text-white space-x-2">
          <Plus className="w-4 h-4" />
          <span>添加用户</span>
        </Button>
      </div>

      {/* 用户列表卡片 */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            平台注册用户，共 {mockUsers.length} 位用户
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
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
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

                <Select value={roleFilter} onValueChange={handleRoleFilter}>
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
                      <SelectItem value="editor">编辑</SelectItem>
                      <SelectItem value="member">会员</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  className="border-gray-200 dark:border-gray-800 text-gray-500 gap-2"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>重置</span>
                </Button>
              </div>
            </div>

            {/* 批量操作 */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center justify-between py-2 px-3 bg-[#E5F0F6] dark:bg-[#2A5674]/10 rounded-md">
                <div className="text-sm">
                  已选择 <span className="font-medium">{selectedUsers.length}</span> 位用户
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-[#2A5674] dark:text-[#4A8CAB] hover:bg-[#E5F0F6]/80 dark:hover:bg-[#2A5674]/20">
                    <Download className="h-4 w-4 mr-1" />
                    导出
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 用户表格 */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-[#2A5674] focus:ring-[#3B7A9E]"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册日期</TableHead>
                  <TableHead>邮箱验证</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#2A5674] focus:ring-[#3B7A9E]"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.image || undefined} alt={user.name} />
                            <AvatarFallback className="bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]">
                              {user.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <UserRole role={user.role} />
                      </TableCell>
                      <TableCell>
                        <UserStatus status={user.status} />
                      </TableCell>
                      <TableCell>
                        {formatDate(user.createdAt)}
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
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-500 cursor-pointer"
                                onClick={() => openDeleteDialog(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                删除
                              </DropdownMenuItem>
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

          {/* 分页 */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500">
                显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} 共 {filteredUsers.length} 条
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                        className={page === currentPage ? "bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]" : ""}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除用户</DialogTitle>
            <DialogDescription>
              您确定要删除用户 "{userToDelete?.name}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;