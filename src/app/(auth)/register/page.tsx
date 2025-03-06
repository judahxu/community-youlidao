'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Mail, Lock, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { useVerification } from '@/lib/hooks/useVerification';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const { sendCode, verifyCode } = useVerification();

  // 处理密码强度逻辑
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    // 密码强度评估
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    if (strength <= 25) {
      feedback = '弱: 请使用更强的密码';
    } else if (strength <= 50) {
      feedback = '中等: 尝试添加数字和符号';
    } else if (strength <= 75) {
      feedback = '良好: 尝试添加大小写字母和符号';
    } else {
      feedback = '强: 完美的密码!';
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  // 处理倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  // 发送验证码逻辑
  const handleSendCode = async () => {
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const result = await sendCode({
        email,
        type: 'registration',
      });
    
      if (result.success) {
        setCountdown(60);
        setCodeSent(true);
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('验证码发送失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 注册提交逻辑
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !verificationCode || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (passwordStrength < 50) {
      setError('请设置更强的密码');
      return;
    }
    
    if (!agreeTerms) {
      setError('请同意服务条款和隐私政策');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 验证验证码
      const verifyResult = await verifyCode({
        email,
        code: verificationCode,
        type: 'registration'
      });
      
      if (!verifyResult.success) {
        setError(verifyResult.message);
        return;
      }
      
      // 注册用户
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json() as {
        message: string;
      };
      
      if (!response.ok) {
        throw new Error(data.message || '注册失败');
      }
      
      setSuccess('注册成功！正在跳转到登录页面...');
      
      // 延迟后跳转到登录页
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError((err as Error).message || '注册失败，请检查信息后重试');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">加入AI尤里岛</h1>
          <p className="text-gray-500 dark:text-gray-400">创建账号，开始您的AI学习之旅</p>
        </div>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">创建新账号</CardTitle>
            <CardDescription>请填写以下信息完成注册</CardDescription>
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
              {/* 邮箱 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    className={`text-sm min-w-[100px] ${codeSent && countdown > 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'text-[#2A5674] dark:text-[#4A8CAB]'}`}
                    onClick={handleSendCode}
                    disabled={isLoading || (codeSent && countdown > 0)}
                  >
                    {codeSent && countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                  </Button>
                </div>
              </div>

              {/* 验证码 */}
              <div className="space-y-2">
                <Label htmlFor="verificationCode">验证码</Label>
                <Input 
                  id="verificationCode" 
                  type="text" 
                  placeholder="请输入邮箱验证码" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <Label htmlFor="password">设置密码</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="至少8个字符"
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {password && (
                  <div className="space-y-1">
                    <Progress value={passwordStrength} className="h-1.5" />
                    <p className={`text-xs ${
                      passwordStrength <= 25 ? 'text-red-500' : 
                      passwordStrength <= 50 ? 'text-yellow-500' : 
                      passwordStrength <= 75 ? 'text-green-500' : 
                      'text-green-600'
                    }`}>
                      {passwordFeedback}
                    </p>
                  </div>
                )}
              </div>

              {/* 确认密码 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="再次输入密码" 
                    className="pl-10" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {password && confirmPassword && (
                  password === confirmPassword ? (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> 密码匹配
                    </p>
                  ) : (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> 密码不匹配
                    </p>
                  )
                )}
              </div>

              {/* 同意条款 */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(!!checked)} 
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  我已阅读并同意
                  <a href="#" className="text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"> 服务条款 </a>
                  和
                  <a href="#" className="text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"> 隐私政策</a>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6 bg-[#2A5674] hover:bg-[#3B7A9E] text-white flex items-center justify-center gap-2 group transition-all"
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '创建账号'}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              已有账号?{' '}
              <Link 
                href="/login" 
                className="font-medium text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"
              >
                登录
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;