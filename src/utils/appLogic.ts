/**
 * 应用逻辑工具函数
 * 处理应用配置、主题切换和语言管理
 */
import log from './logger';
import { loadConfig, saveConfig } from './config';

/**
 * 加载应用配置
 * @param setIsDarkMode 设置主题模式的回调函数
 * @param setLanguage 设置语言的回调函数
 */
export const loadAppConfig = async (setIsDarkMode: (value: boolean) => void, setLanguage: (value: string) => void) => {
  try {
    // 从配置文件加载配置
    const config = await loadConfig();
    log.debug(`Setting theme to ${config.theme}`);
    // 设置主题模式
    setIsDarkMode(config.theme === 'dark');
    log.debug(`Setting language to ${config.language}`);
    // 设置语言
    setLanguage(config.language);
    // 应用语言设置
    await changeLanguageInternal(config.language);
  } catch (error: any) {
    log.error(`Failed to load config: ${error.message}`);
  }
};

/**
 * 切换主题
 * @param isDarkMode 当前主题模式
 * @param language 当前语言
 * @param setIsDarkMode 设置主题模式的回调函数
 */
export const toggleTheme = async (isDarkMode: boolean, language: string, setIsDarkMode: (value: boolean) => void) => {
  // 计算新的主题模式
  const newTheme = !isDarkMode;
  log.info(`Toggling theme from ${isDarkMode ? 'dark' : 'light'} to ${newTheme ? 'dark' : 'light'}`);
  // 更新主题状态
  setIsDarkMode(newTheme);
  try {
    // 保存新的主题配置
    await saveConfig({
      theme: newTheme ? 'dark' : 'light',
      language,
      window_width: 800,
      window_height: 600
    });
    log.info(`Theme saved successfully: ${newTheme ? 'dark' : 'light'}`);
  } catch (error: any) {
    log.error(`Failed to save config: ${error.message}`);
  }
};

/**
 * 切换语言
 * @param language 当前语言
 * @param newLanguage 新语言
 * @param setLanguage 设置语言的回调函数
 */
export const changeLanguage = async (language: string, newLanguage: string, setLanguage: (value: string) => void) => {
  log.info(`Changing language from ${language} to ${newLanguage}`);
  // 更新语言状态
  setLanguage(newLanguage);
  // 应用语言设置
  await changeLanguageInternal(newLanguage);
  try {
    // 保存新的语言配置
    await saveConfig({
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      language: newLanguage,
      window_width: 800,
      window_height: 600
    });
    log.info(`Language saved successfully: ${newLanguage}`);
  } catch (error: any) {
    log.error(`Failed to save config: ${error.message}`);
  }
};

/**
 * 内部语言切换函数
 * @param language 目标语言
 */
const changeLanguageInternal = async (language: string) => {
  try {
    log.debug(`Loading i18n module`);
    // 动态导入i18n模块
    const i18n = await import('../i18n');
    log.debug(`Changing language to ${language}`);
    // 切换语言
    i18n.default.changeLanguage(language);
    log.info(`Language changed to ${language}`);
  } catch (error: any) {
    log.error(`Failed to change language: ${error.message}`);
  }
};