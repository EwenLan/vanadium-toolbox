import {invoke} from "@tauri-apps/api/core";

// 日志函数
const log = {
  trace: (message: string) => {
    try {
      invoke('log_message', { level: 'trace', message: message });
    } catch (error) {
      console.error('Failed to log trace message:', error);
    }
  },
  debug: (message: string) => {
    try {
      invoke('log_message', { level: 'debug', message: message });
    } catch (error) {
      console.error('Failed to log debug message:', error);
    }
  },
  info: (message: string) => {
    try {
      invoke('log_message', { level: 'info', message: message });
    } catch (error) {
      console.error('Failed to log info message:', error);
    }
  },
  warn: (message: string) => {
    try {
      invoke('log_message', { level: 'warn', message: message });
    } catch (error) {
      console.error('Failed to log warn message:', error);
    }
  },
  error: (message: string) => {
    try {
      invoke('log_message', { level: 'error', message: message });
    } catch (error) {
      console.error('Failed to log error message:', error);
    }
  }
};

export default log;