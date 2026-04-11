/**
 * 日志工具
 * 提供统一的日志记录接口，支持不同日志级别
 */
import { invoke } from "@tauri-apps/api/core";
import { getCallerInfo } from './callerInfo';

/**
 * 创建日志函数
 * @param level 日志级别
 * @returns 日志函数
 */
const createLogFunction = (level: string) => {
  return (message: string) => {
    try {
      const callerInfo = getCallerInfo();
      const fullMessage = callerInfo ? `[${callerInfo}] ${message}` : message;
      invoke('log_message', { level, message: fullMessage });
    } catch (error) {
      console.error(`Failed to log ${level} message:`, error);
    }
  };
};

/**
 * 日志对象
 * 提供trace、debug、info、warn、error五个级别的日志记录
 */
const log = {
  trace: createLogFunction('trace'),
  debug: createLogFunction('debug'),
  info: createLogFunction('info'),
  warn: createLogFunction('warn'),
  error: createLogFunction('error')
};

export default log;
