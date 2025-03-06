'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Rocket, 
  BookOpen, 
  Wrench, 
  Users, 
  Briefcase,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';

// 快速访问卡片组件
const QuickAccessCard = ({ icon, title, description, color, badge }: { icon: React.ReactNode, title: string, description: string, color: string, badge?: string }) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div className={`h-full w-0 ${color} group-hover:w-full transition-all duration-500`}></div>
      </div>
      <CardContent className="p-6 pt-8">
        <div className="text-[#2A5674] dark:text-[#4A8CAB] mb-4">{icon}</div>
        
        {badge && (
          <Badge className="absolute top-4 right-4 bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]">
            {badge}
          </Badge>
        )}
        
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Button variant="ghost" size="sm" className="p-0 flex items-center text-[#2A5674] dark:text-[#4A8CAB] group-hover:translate-x-1 transition-transform">
          开始探索
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

// 统计卡片组件
const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => {
  return (
    <Card>
      <CardContent className="p-6 text-center space-y-2">
        <div className="text-[#2A5674] dark:text-[#4A8CAB] flex justify-center">{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500 dark:text-gray-400">{label}</div>
      </CardContent>
    </Card>
  );
};

// 主页组件
const HomePage = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto text-gray-900 dark:text-white">
      {/* 英雄横幅 */}
      <section className="relative overflow-hidden rounded-2xl -mx-6 sm:mx-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A5674] to-[#3B7A9E] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        
        {/* 英雄内容 */}
        <div className="relative px-6 py-16 md:py-24 md:px-12 max-w-5xl mx-auto">          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            打造你的<span className="relative inline-block">
              <span className="relative z-10">AI学习成长之路</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#3B7A9E] opacity-30 transform -rotate-1 z-0"></span>
            </span>
          </h1>
          
          <p className="text-xl text-blue-50 mb-8 max-w-3xl">
            系统化的学习路径，丰富的实践案例，专业的社区交流，让你在AI时代脱颖而出
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-[#2A5674] hover:bg-[#E5F0F6] transition-all duration-300 group">
              开始学习
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button size="lg" variant="outline" className="bg-transparent text-white border-2 border-white/60 hover:border-white hover:bg-white/10">
              了解更多
            </Button>
          </div>
        </div>
      </section>

      {/* 探索AI领域 */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">探索AI领域</h2>
          <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 group">
            查看全部
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform text-[#2A5674] dark:text-[#4A8CAB]" />
          </Button>
        </div>

        {/* 快速访问网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            icon={<Rocket className="h-6 w-6" />}
            title="新手起步"
            description="从零开始，快速入门AI领域"
            color="bg-[#2A5674]"
            badge="入门指南"
          />
          <QuickAccessCard
            icon={<BookOpen className="h-6 w-6" />}
            title="学习资源"
            description="系统化的学习路径与教程"
            color="bg-[#3B7A9E]"
            badge="热门"
          />
          <QuickAccessCard
            icon={<Wrench className="h-6 w-6" />}
            title="工具资源"
            description="精选AI工具与应用案例"
            color="bg-[#4A8CAB]"
          />
          <QuickAccessCard
            icon={<Users className="h-6 w-6" />}
            title="社区互动"
            description="专业的交流分享平台"
            color="bg-[#2A5674]"
          />
          <QuickAccessCard
            icon={<Briefcase className="h-6 w-6" />}
            title="职业发展"
            description="探索AI领域的职业机会"
            color="bg-[#3B7A9E]"
          />
        </div>
      </section>

      {/* 精选内容 */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">精选内容</h2>
          <Button variant="outline" size="sm" className="group">
            查看全部
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 热门课程 */}
          <Card className="overflow-hidden hover:shadow-md transition-all border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gray-50 dark:bg-gray-800/50">
              <div>
                <CardTitle className="text-xl font-bold">热门课程</CardTitle>
                <CardDescription>精选高质量学习内容</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#E5F0F6] dark:bg-[#2A5674]/20 flex items-center justify-center">
                <Play className="h-4 w-4 text-[#2A5674] dark:text-[#4A8CAB]" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { title: "AI基础入门", level: "初级", duration: "2小时", students: 1243 },
                { title: "提示词工程指南", level: "中级", duration: "3小时", students: 893 },
                { title: "AI应用开发实战", level: "高级", duration: "4小时", students: 567 }
              ].map((course, index) => (
                <div key={index} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b last:border-0 border-gray-200 dark:border-gray-700">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{course.title}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Badge variant="secondary" className="mr-2">
                        {course.level}
                      </Badge>
                      <span>{course.duration}</span>
                      <span className="mx-1.5">•</span>
                      <span>{course.students} 学员</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#2A5674] dark:hover:text-[#4A8CAB]">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-3 flex justify-center">
              <Button variant="link" className="text-[#2A5674] dark:text-[#4A8CAB] gap-1">
                浏览全部课程
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* 推荐工具 */}
          <Card className="overflow-hidden hover:shadow-md transition-all border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gray-50 dark:bg-gray-800/50">
              <div>
                <CardTitle className="text-xl font-bold">推荐工具</CardTitle>
                <CardDescription>精选高效AI工具</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100/80 dark:bg-orange-900/20 flex items-center justify-center">
                <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { title: "ChatGPT", category: "对话助手", rating: "4.9", users: "10M+" },
                { title: "Midjourney", category: "AI绘画", rating: "4.8", users: "5M+" },
                { title: "Claude", category: "AI助手", rating: "4.7", users: "3M+" }
              ].map((tool, index) => (
                <div key={index} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b last:border-0 border-gray-200 dark:border-gray-700">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tool.title}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Badge variant="secondary" className="mr-2">
                        {tool.category}
                      </Badge>
                      <span>{tool.users} 用户</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-amber-500 mr-2">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    <span className="text-sm font-medium">{tool.rating}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#2A5674] dark:hover:text-[#4A8CAB]">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-3 flex justify-center">
              <Button variant="link" className="text-[#2A5674] dark:text-[#4A8CAB] gap-1">
                探索更多工具
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 社区部分 */}
      <section className="bg-[#E5F0F6]/60 dark:bg-[#2A5674]/10 -mx-6 px-6 py-12 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">加入学习社区</h2>
            <p className="text-gray-600">
              和数千名学习者一起交流讨论，分享经验心得
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value="10,000+"
              label="活跃用户"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              value="1,000+"
              label="学习资源"
            />
            <StatCard
              icon={<Wrench className="h-5 w-5" />}
              value="100+"
              label="精选工具"
            />
          </div>
          
          {/* 社区内容预览 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                user: "张三",
                title: "我的AI学习之旅",
                excerpt: "从零开始学习AI，分享我的学习经验和心得...",
                timeAgo: "2小时前"
              },
              {
                user: "李四",
                title: "如何高效使用ChatGPT",
                excerpt: "提高工作效率的10个ChatGPT使用技巧...",
                timeAgo: "5小时前"
              }
            ].map((post, index) => (
              <Card key={index} className="hover:shadow-md transition-all border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-[#E5F0F6] text-[#2A5674] dark:bg-[#2A5674]/20 dark:text-[#4A8CAB]">
                        {post.user.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{post.user}</div>
                      <div className="text-xs text-gray-500">{post.timeAgo}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button size="lg" className="bg-[#2A5674] hover:bg-[#3B7A9E] text-white">
            立即加入社区
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;