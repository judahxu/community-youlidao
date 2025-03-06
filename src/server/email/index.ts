// src/server/services/verification-service.ts
import { createTransport } from 'nodemailer';
import { redis } from '@/server/redis';

interface SendVerificationOptions {
  email: string;
  type: 'registration' | 'password-reset';
  expiresIn?: number; // 单位：秒
}

interface VerificationResult {
  success: boolean;
  message: string;
}

/**
 * 验证码服务
 * 用于生成、发送和验证邮箱验证码
 */
export class VerificationService {
  // 生成6位数字验证码
  private static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // 获取Redis存储键
  private static getRedisKey(email: string, type: string): string {
    return `verification:${type}:${email}`;
  }
  
  // 发送验证码邮件
  private static async sendEmail(email: string, code: string, type: string): Promise<boolean> {
    try {
      // 如果在开发环境中，可以使用控制台输出验证码而不是真正发送邮件
      if (process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL_SENDING === 'true') {
        console.log(`[开发模式] 发送验证码到 ${email}: ${code}`);
        return true;
      }

      // 创建Nodemailer传输器
      const transporter = createTransport({
        // host: process.env.EMAIL_HOST,
        // port: Number(process.env.EMAIL_PORT) || 587,
        // secure: process.env.EMAIL_SECURE === 'true',
        service:"Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      // 根据类型设置不同的邮件主题和内容
      let subject = '';
      let html = '';
      
      if (type === 'registration') {
        subject = 'AI尤里岛 - 注册验证码';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2A5674; margin-bottom: 5px;">AI尤里岛</h1>
              <p style="color: #6b7280; margin-top: 0;">您的AI学习社区</p>
            </div>
            <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #111827; margin-top: 0;">验证您的邮箱</h2>
              <p style="color: #4b5563;">感谢您注册AI尤里岛。请使用以下验证码完成注册流程：</p>
              <div style="background-color: #2A5674; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 6px; letter-spacing: 5px; margin: 20px 0;">
                ${code}
              </div>
              <p style="color: #4b5563; font-size: 14px;">验证码有效期为10分钟，请勿将验证码分享给他人。</p>
            </div>
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              如果您没有请求此验证码，请忽略此邮件。
            </p>
          </div>
        `;
      } else if (type === 'password-reset') {
        subject = 'AI尤里岛 - 密码重置验证码';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2A5674; margin-bottom: 5px;">AI尤里岛</h1>
              <p style="color: #6b7280; margin-top: 0;">您的AI学习社区</p>
            </div>
            <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #111827; margin-top: 0;">重置您的密码</h2>
              <p style="color: #4b5563;">您最近请求重置密码。请使用以下验证码完成密码重置流程：</p>
              <div style="background-color: #2A5674; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 6px; letter-spacing: 5px; margin: 20px 0;">
                ${code}
              </div>
              <p style="color: #4b5563; font-size: 14px;">验证码有效期为10分钟，请勿将验证码分享给他人。</p>
            </div>
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              如果您没有请求重置密码，请忽略此邮件并考虑修改您的密码。
            </p>
          </div>
        `;
      }
      
      // 发送邮件
      const info = await transporter.sendMail({
        from: `"AI尤里岛" <${process.env.EMAIL_FROM ?? process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });
      
      console.log('验证码邮件已发送: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('发送验证码邮件失败:', error);
      return false;
    }
  }
  
  /**
   * 发送验证码
   * @param options - 发送验证码的选项
   * @returns 发送结果
   */
  public static async sendVerificationCode(options: SendVerificationOptions): Promise<VerificationResult> {
    const { email, type, expiresIn = 600 } = options; // 默认10分钟有效期
    
    try {
      // 确保 Redis 连接
      await this.ensureRedisConnected();
      
      // 检查是否有未过期的验证码(防止频繁请求)
      const existingKey = this.getRedisKey(email, type);
      const ttl = await redis.ttl(existingKey);
      
      // 如果存在且TTL大于540秒(即距离上次发送不到1分钟)
      if (ttl > expiresIn - 60) {
        return {
          success: false,
          message: '验证码已发送，请稍后再试',
        };
      }
      
      // 生成新的验证码
      const code = this.generateCode();
      
      // 存储验证码到Redis
      await redis.set(existingKey, code, {
        EX: expiresIn,
      });
      
      // 发送验证码邮件
      const emailSent = await this.sendEmail(email, code, type);
      
      if (!emailSent) {
        // 如果邮件发送失败，删除Redis中的记录
        await redis.del(existingKey);
        return {
          success: false,
          message: '验证码发送失败，请稍后再试',
        };
      }
      
      return {
        success: true,
        message: '验证码已发送到您的邮箱',
      };
    } catch (error) {
      console.error('发送验证码失败:', error);
      return {
        success: false,
        message: '服务器错误，请稍后再试',
      };
    }
  }
  
  /**
   * 验证验证码
   * @param email - 邮箱
   * @param code - 用户输入的验证码
   * @param type - 验证类型
   * @returns 验证结果
   */
  public static async verifyCode(email: string, code: string, type: 'registration' | 'password-reset'): Promise<VerificationResult> {
    try {
      // 确保 Redis 连接
      await this.ensureRedisConnected();
      
      // 获取Redis键
      const key = this.getRedisKey(email, type);
      
      // 从Redis获取存储的验证码
      const storedCode = await redis.get(key);
      
      if (!storedCode) {
        return {
          success: false,
          message: '验证码已过期或不存在',
        };
      }
      
      // 验证码比对
      if (storedCode !== code) {
        return {
          success: false,
          message: '验证码错误',
        };
      }
      
      // 验证成功后删除验证码(一次性使用)
      await redis.del(key);
      
      return {
        success: true,
        message: '验证成功',
      };
    } catch (error) {
      console.error('验证码验证失败:', error);
      return {
        success: false,
        message: '服务器错误，请稍后再试',
      };
    }
  }

  /**
   * 确保 Redis 连接
   */
  private static async ensureRedisConnected() {
    if (!redis.isReady) {
      await redis.connect();
    }
  }
}