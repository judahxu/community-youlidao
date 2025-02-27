// src/lib/hooks/useVerification.ts
import { useState, useCallback } from 'react';

interface VerificationOptions {
  email: string;
  type: 'registration' | 'password-reset';
}

interface VerifyCodeOptions extends VerificationOptions {
  code: string;
}

interface UseVerificationReturn {
  sendCode: (options: VerificationOptions) => Promise<{ success: boolean; message: string }>;
  verifyCode: (options: VerifyCodeOptions) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * 验证码Hook，用于发送和验证邮箱验证码
 */
export function useVerification(): UseVerificationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 发送验证码
   */
  const sendCode = useCallback(async (options: VerificationOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '发送验证码失败');
      }
      
      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送验证码失败';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 验证验证码
   */
  const verifyCode = useCallback(async (options: VerifyCodeOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '验证码验证失败');
      }
      
      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '验证码验证失败';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendCode,
    verifyCode,
    isLoading,
    error,
  };
}