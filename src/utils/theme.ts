/**
 * 主题管理模块
 * 处理应用主题的切换和保存
 */
import log from './logger';
import { saveConfig } from './config';

/**
 * 切换主题
 * @param isDarkMode 当前主题模式
 * @param language 当前语言
 * @param setIsDarkMode 设置主题模式的回调函数
 */
export const toggleTheme = async (
  isDarkMode: boolean, 
  language: string, 
  setIsDarkMode: (value: boolean) => void
) => {
  const newTheme = !isDarkMode;
  log.info(`Toggling theme from ${isDarkMode ? 'dark' : 'light'} to ${newTheme ? 'dark' : 'light'}`);
  
  setIsDarkMode(newTheme);
  
  try {
    await saveConfig({
      theme: newTheme ? 'dark' : 'light',
      language,
      window_width: 800,
      window_height: 600
    });
    log.info(`Theme saved successfully: ${newTheme ? 'dark' : 'light'}`);
  } catch (error: any) {
    log.error(`Failed to save theme config: ${error.message}`);
  }
};
