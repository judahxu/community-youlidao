'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 处理URL参数，如注册成功后的消息
  useEffect(() => {
    // 检查是否有成功消息参数
    const successMessage = searchParams.get('success');
    if (successMessage) {
      setSuccess(decodeURIComponent(successMessage));
    }
    
    // 检查是否有错误参数
    const errorMessage = searchParams.get('error');
    if (errorMessage) {
      // 处理NextAuth的错误代码
      switch (errorMessage) {
        case 'CredentialsSignin':
          setError('邮箱或密码错误，请重试');
          break;
        case 'SessionRequired':
          setError('请先登录后再访问');
          break;
        default:
          setError(decodeURIComponent(errorMessage));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 使用NextAuth登录
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // 登录成功，跳转到回调URL或首页
      setSuccess('登录成功，正在跳转...');
      
      // 如果有回调URL则跳转到回调URL，否则跳转到首页
      router.push(result?.url || '/home');
    } catch (err) {
      setError('邮箱或密码错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo和标题 */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img src="/favicon.ico" alt="" className='w-8 h-8 mr-2' />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">登录到AI尤里岛</h1>
          <p className="text-gray-500 dark:text-gray-400">系统化的AI学习之旅从这里开始</p>
        </div>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">账号登录</CardTitle>
            <CardDescription>请输入您的邮箱和密码</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="pl-10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密码</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"
                  >
                    忘记密码?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(!!checked)} 
                />
                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  记住我
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#2A5674] hover:bg-[#3B7A9E] text-white flex items-center justify-center gap-2 group transition-all"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              还没有账号?{' '}
              <Link 
                href="/register" 
                className="font-medium text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"
              >
                注册
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          登录即表示您同意我们的
          <a href="#" className="text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"> 服务条款 </a>
          和
          <a href="#" className="text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"> 隐私政策</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;