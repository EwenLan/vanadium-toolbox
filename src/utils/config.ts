import log from './logger';

import {invoke} from "@tauri-apps/api/core";

interface Config {
  theme: string;
  language: string;
  window_width: number;
  window_height: number;
}

export const loadConfig = async (): Promise<Config> => {
  try {
    log.info('Loading config from backend');
    const config = await invoke('read_config', {}) as Config;
    log.debug(`Config received: ${JSON.stringify(config)}`);
    if (config) {
      log.info(`Config loaded successfully: theme=${config.theme}, language=${config.language}`);
      return config;
    } else {
      log.info('Using default config: theme=light, language=zh-CN');
      return {
        theme: 'light',
        language: 'zh-CN',
        window_width: 800,
        window_height: 600
      };
    }
  } catch (error: any) {
    log.error(`Failed to load config: ${error.message}, Using default config due to error: theme=light, language=zh-CN`);
    return {
      theme: 'light',
      language: 'zh-CN',
      window_width: 800,
      window_height: 600
    };
  }
};

export const saveConfig = async (config: Config): Promise<boolean> => {
  try {
    log.debug(`Saving config: ${JSON.stringify(config)}`);
    await invoke('write_config', { config: config });
    log.info(`Config saved successfully: theme=${config.theme}, language=${config.language}`);
    return true;
  } catch (error: any) {
    log.error(`Failed to save config: ${error.message}`);
    return false;
  }
};