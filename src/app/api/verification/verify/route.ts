// src/app/api/verification/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { VerificationService } from '@/server/email';
import { z } from 'zod';

// 请求体验证
const verifyCodeSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  code: z.string().min(6).max(6, { message: '验证码必须是6位数字' }),
  type: z.enum(['registration', 'password-reset'], {
    required_error: '验证类型是必需的',
    invalid_type_error: '验证类型必须是 registration 或 password-reset',
  }),
});

type VerifyCodeRequestBody = z.infer<typeof verifyCodeSchema>;



// 验证验证码API
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json() as VerifyCodeRequestBody;
    
    // 验证请求数据
    const result = verifyCodeSchema.safeParse(body);
    
    if (!result.success) {
      // 返回验证错误
      return NextResponse.json(
        { 
          success: false, 
          message: '请求数据无效', 
          errors: result.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { email, code, type } = result.data;
    
    // 验证验证码
    const verificationResult = await VerificationService.verifyCode(email, code, type);
    
    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, message: verificationResult.message }, 
        { status: 400 }
      );
    }
    
    // 返回成功响应
    return NextResponse.json({ 
      success: true, 
      message: verificationResult.message 
    });
    
  } catch (error) {
    console.error('验证验证码API错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' }, 
      { status: 500 }
    );
  }
}