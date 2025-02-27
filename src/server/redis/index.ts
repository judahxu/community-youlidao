// src/server/redis/index.ts
import { createClient } from 'redis';

// 从环境变量获取Redis配置
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// 创建Redis客户端
const redisClient = createClient({
  url: redisUrl,
});

// 错误处理
redisClient.on('error', (err) => {
  console.error('Redis连接错误:', err);
});

// 连接成功事件
redisClient.on('connect', () => {
  console.log('Redis连接成功');
});

// 重连事件
redisClient.on('reconnecting', () => {
  console.log('Redis重新连接中...');
});

// 终止事件
redisClient.on('end', () => {
  console.log('Redis连接已关闭');
});

// 导出Redis客户端
export const redis = redisClient;

// 导出一个初始化函数，在应用启动时调用
export async function initRedis() {
  try {
    if (!redis.isReady) {
      await redis.connect();
    }
    console.log('Redis初始化成功');
  } catch (error) {
    console.error('Redis初始化失败:', error);
    // 在生产环境中，可能需要根据具体情况决定是否需要退出进程
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}