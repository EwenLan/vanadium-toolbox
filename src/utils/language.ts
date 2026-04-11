/**
 * 语言管理模块
 * 处理应用语言的切换和保存
 */
import log from './logger';
import { saveConfig } from './config';

/**
 * 切换i18n语言
 * @param language 目标语言
 */
const changeI18nLanguage = async (language: string) => {
  try {
    log.debug('Loading i18n module and changing language');
    const i18n = await import('../i18n');
    i18n.default.changeLanguage(language);
    log.info(`Language changed to ${language}`);
  } catch (error: any) {
    log.error(`Failed to change i18n language: ${error.message}`);
  }
};

/**
 * 切换语言
 * @param language 当前语言
 * @param newLanguage 新语言
 * @param setLanguage 设置语言的回调函数
 */
export const changeLanguage = async (
  language: string, 
  newLanguage: string, 
  setLanguage: (value: string) => void
) => {
  log.info(`Changing language from ${language} to ${newLanguage}`);
  
  setLanguage(newLanguage);
  await changeI18nLanguage(newLanguage);
  
  try {
    await saveConfig({
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      language: newLanguage,
      window_width: 800,
      window_height: 600
    });
    log.info(`Language saved successfully: ${newLanguage}`);
  } catch (error: any) {
    log.error(`Failed to save language config: ${error.message}`);
  }
};
