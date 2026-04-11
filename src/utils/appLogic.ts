import log from './logger';
import { loadConfig, saveConfig } from './config';

// 加载应用配置
export const loadAppConfig = async (setIsDarkMode: (value: boolean) => void, setLanguage: (value: string) => void) => {
  try {
    const config = await loadConfig();
    log.debug(`Setting theme to ${config.theme}`);
    setIsDarkMode(config.theme === 'dark');
    log.debug(`Setting language to ${config.language}`);
    setLanguage(config.language);
    await changeLanguageInternal(config.language);
  } catch (error: any) {
    log.error(`Failed to load config: ${error.message}`);
  }
};

// 切换主题
export const toggleTheme = async (isDarkMode: boolean, language: string, setIsDarkMode: (value: boolean) => void) => {
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
    log.error(`Failed to save config: ${error.message}`);
  }
};

// 切换语言
export const changeLanguage = async (language: string, newLanguage: string, setLanguage: (value: string) => void) => {
  log.info(`Changing language from ${language} to ${newLanguage}`);
  setLanguage(newLanguage);
  await changeLanguageInternal(newLanguage);
  try {
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

// 内部语言切换函数
const changeLanguageInternal = async (language: string) => {
  try {
    log.debug(`Loading i18n module`);
    const i18n = await import('../i18n');
    log.debug(`Changing language to ${language}`);
    i18n.default.changeLanguage(language);
    log.info(`Language changed to ${language}`);
  } catch (error: any) {
    log.error(`Failed to change language: ${error.message}`);
  }
};