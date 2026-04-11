/**
 * 配置管理工具
 * 处理应用配置的加载和保存
 */
import log from './logger';
import {invoke} from "@tauri-apps/api/core";

/**
 * 配置接口
 * 定义应用配置的结构
 */
interface Config {
  theme: string;      // 主题模式: 'light' 或 'dark'
  language: string;   // 语言: 'zh-CN' 或 'en-US'
  window_width: number;  // 窗口宽度
  window_height: number; // 窗口高度
}

/**
 * 加载配置
 * 从后端读取配置文件，如果失败则返回默认配置
 * @returns 配置对象
 */
export const loadConfig = async (): Promise<Config> => {
  try {
    log.info('Loading config from backend');
    // 调用后端API读取配置
    const config = await invoke('read_config', {}) as Config;
    log.debug(`Config received: ${JSON.stringify(config)}`);
    if (config) {
      log.info(`Config loaded successfully: theme=${config.theme}, language=${config.language}`);
      return config;
    } else {
      log.info('Using default config: theme=light, language=zh-CN');
      // 返回默认配置
      return {
        theme: 'light',
        language: 'zh-CN',
        window_width: 800,
        window_height: 600
      };
    }
  } catch (error: any) {
    log.error(`Failed to load config: ${error.message}, Using default config due to error: theme=light, language=zh-CN`);
    // 错误时返回默认配置
    return {
      theme: 'light',
      language: 'zh-CN',
      window_width: 800,
      window_height: 600
    };
  }
};

/**
 * 保存配置
 * 将配置写入后端存储
 * @param config 配置对象
 * @returns 是否保存成功
 */
export const saveConfig = async (config: Config): Promise<boolean> => {
  try {
    log.debug(`Saving config: ${JSON.stringify(config)}`);
    // 调用后端API写入配置
    await invoke('write_config', { config: config });
    log.info(`Config saved successfully: theme=${config.theme}, language=${config.language}`);
    return true;
  } catch (error: any) {
    log.error(`Failed to save config: ${error.message}`);
    return false;
  }
};