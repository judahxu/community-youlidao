'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Mail, Lock, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // 处理密码强度逻辑
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    // 一个简单的密码强度评估
    let strength = 0;
    let feedback = '';

    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;

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
  }, [newPassword]);

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
      // 这里添加实际的发送验证码逻辑
      // await sendVerificationCode(email);
      
      // 模拟发送过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCodeSent(true);
      setCountdown(60);
      setError('');
      setSuccess('验证码已发送到您的邮箱，请查收');
    } catch (err) {
      setError('验证码发送失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 验证邮箱步骤
  const handleVerifyEmail = async () => {
    if (!email || !verificationCode) {
      setError('请填写邮箱和验证码');
      return;
    }

    try {
      setIsLoading(true);
      // 这里添加实际的验证码验证逻辑
      // await verifyCode(email, verificationCode);
      
      // 模拟验证过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(2);
      setError('');
      setSuccess('');
    } catch (err) {
      setError('验证码错误，请重新输入');
    } finally {
      setIsLoading(false);
    }
  };

  // 重设密码步骤
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('请设置新密码');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (passwordStrength < 50) {
      setError('请设置更强的密码');
      return;
    }

    try {
      setIsLoading(true);
      // 这里添加实际的密码重置逻辑
      // await resetPassword(email, verificationCode, newPassword);
      
      // 模拟重置过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep(3);
      setError('');
      setSuccess('密码重置成功！');
    } catch (err) {
      setError('密码重置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  
// 步骤组件
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-between items-center w-full mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === step 
              ? 'bg-[#2A5674] text-white' 
              : currentStep > step 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
            {step === 1 ? '验证邮箱' : step === 2 ? '重置密码' : '完成'}
          </div>
        </div>
      ))}
      <div className={`h-1 w-1/3 absolute left-[16%] ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
      <div className={`h-1 w-1/3 absolute right-[16%] ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
    </div>
  );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo和标题 */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            {/* <div className="h-12 w-12 bg-gradient-to-r from-[#2A5674] to-[#3B7A9E] rounded-xl flex items-center justify-center text-white text-xl font-bold">
              AI
            </div> */}
             <img src="/favicon.ico" alt="" className='w-8 h-8 mr-2' />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">忘记密码</h1>
          <p className="text-gray-500 dark:text-gray-400">重置您的密码，恢复账号访问</p>
        </div>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">重置密码</CardTitle>
            <CardDescription>我们将帮您找回密码</CardDescription>
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

            <div className="relative mb-8">
              <StepIndicator currentStep={currentStep} />
            </div>

            {currentStep === 1 && (
              <div className="space-y-4">
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

                <Button 
                  type="button" 
                  className="w-full mt-6 bg-[#2A5674] hover:bg-[#3B7A9E] text-white flex items-center justify-center gap-2 group transition-all"
                  onClick={handleVerifyEmail}
                  disabled={isLoading}
                >
                  {isLoading ? '验证中...' : '验证身份'}
                  {!isLoading && (
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密码</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      placeholder="至少8个字符"
                      className="pl-10" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  {newPassword && (
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认新密码</Label>
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
                  {newPassword && confirmPassword && (
                    newPassword === confirmPassword ? (
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

                <Button 
                  type="button" 
                  className="w-full mt-6 bg-[#2A5674] hover:bg-[#3B7A9E] text-white flex items-center justify-center gap-2 group transition-all"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? '重置中...' : '重置密码'}
                  {!isLoading && (
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">密码重置成功</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    您的密码已成功重置，现在可以使用新密码登录
                  </p>
                </div>
                
                <Button 
                  type="button" 
                  className="bg-[#2A5674] hover:bg-[#3B7A9E] text-white"
                  onClick={() => router.push('/login')}
                >
                  返回登录
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <Link 
              href="/login" 
              className="text-sm font-medium text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors"
            >
              返回登录页面
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          遇到问题? 请<a href="#" className="text-[#2A5674] dark:text-[#4A8CAB] hover:text-[#3B7A9E] transition-colors">联系客服</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;