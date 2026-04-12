/**
 * 配置管理工具
 * 处理应用配置的加载和保存
 */
import log from './logger';
import {invoke} from "@tauri-apps/api/core";
import { isTauri } from './tauri';

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
 * 获取默认配置
 * @returns 默认配置对象
 */
const getDefaultConfig = (): Config => {
  return {
    theme: 'light',
    language: 'zh-CN',
    window_width: 800,
    window_height: 600
  };
};

/**
 * 从后端加载配置
 * @returns 配置对象
 */
const loadConfigFromBackend = async (): Promise<Config> => {
  try {
    log.info('Loading config from backend');
    const config = await invoke('read_config', {}) as Config;
    if (config) {
      log.info(`Config loaded successfully: theme=${config.theme}, language=${config.language}`);
      return config;
    } else {
      log.info('Using default config: theme=light, language=zh-CN');
      return getDefaultConfig();
    }
  } catch (error: any) {
    log.error(`Failed to load config from backend: ${error.message}, using default config`);
    return getDefaultConfig();
  }
};

/**
 * 从 localStorage 加载配置
 * @returns 配置对象
 */
const loadConfigFromLocalStorage = (): Config => {
  try {
    log.info('Loading config from localStorage');
    const storedConfig = localStorage.getItem('appConfig');
    if (storedConfig) {
      const config = JSON.parse(storedConfig) as Config;
      log.info(`Config loaded successfully from localStorage: theme=${config.theme}, language=${config.language}`);
      return config;
    } else {
      log.info('No stored config found, using default config: theme=light, language=zh-CN');
      return getDefaultConfig();
    }
  } catch (error) {
    log.error(`Failed to parse stored config: ${error}, using default config`);
    return getDefaultConfig();
  }
};

/**
 * 加载配置
 * 从后端读取配置文件，如果失败则返回默认配置
 * @returns 配置对象
 */
export const loadConfig = async (): Promise<Config> => {
  try {
    if (isTauri()) {
      return await loadConfigFromBackend();
    } else {
      return loadConfigFromLocalStorage();
    }
  } catch (error: any) {
    log.error(`Failed to load config: ${error.message}, using default config`);
    return getDefaultConfig();
  }
};

/**
 * 保存配置到后端
 * @param config 配置对象
 * @returns 是否保存成功
 */
const saveConfigToBackend = async (config: Config): Promise<boolean> => {
  try {
    log.debug(`Saving config: theme=${config.theme}, language=${config.language}`);
    await invoke('write_config', { config: config });
    log.info(`Config saved successfully`);
    return true;
  } catch (error: any) {
    log.error(`Failed to save config to backend: ${error.message}`);
    return false;
  }
};

/**
 * 保存配置到 localStorage
 * @param config 配置对象
 * @returns 是否保存成功
 */
const saveConfigToLocalStorage = (config: Config): boolean => {
  try {
    log.debug(`Saving config in browser: theme=${config.theme}, language=${config.language}`);
    localStorage.setItem('appConfig', JSON.stringify(config));
    log.info(`Config saved successfully in localStorage`);
    return true;
  } catch (error: any) {
    log.error(`Failed to save config to localStorage: ${error.message}`);
    return false;
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
    if (isTauri()) {
      return await saveConfigToBackend(config);
    } else {
      return saveConfigToLocalStorage(config);
    }
  } catch (error: any) {
    log.error(`Failed to save config: ${error.message}`);
    return false;
  }
};