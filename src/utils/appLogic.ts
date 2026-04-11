/**
 * 应用逻辑工具函数
 * 处理应用配置加载，并整合主题和语言管理功能
 */
import log from './logger';
import { loadConfig } from './config';
import { toggleTheme } from './theme';
import { changeLanguage } from './language';

/**
 * 加载应用配置
 * @param setIsDarkMode 设置主题模式的回调函数
 * @param setLanguage 设置语言的回调函数
 */
export const loadAppConfig = async (
  setIsDarkMode: (value: boolean) => void, 
  setLanguage: (value: string) => void
) => {
  try {
    const config = await loadConfig();
    log.debug(`Setting theme to ${config.theme}, language to ${config.language}`);
    setIsDarkMode(config.theme === 'dark');
    setLanguage(config.language);
    
    const i18n = await import('../i18n');
    i18n.default.changeLanguage(config.language);
  } catch (error: any) {
    log.error(`Failed to load config: ${error.message}`);
  }
};

export { toggleTheme, changeLanguage };
