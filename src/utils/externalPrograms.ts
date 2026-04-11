/**
 * 外部程序配置管理
 * 处理外部程序配置的加载和解析
 */
import log from './logger';
import { ExternalProgram, ExternalProgramsConfig } from '../types/external-programs';

/**
 * 加载外部程序配置
 * @returns 外部程序配置对象
 */
export const loadExternalProgramsConfig = async (): Promise<ExternalProgramsConfig> => {
  try {
    log.info('Loading external programs config');
    // 动态导入配置文件
    const configModule = await import('../config/external-programs.json');
    // 类型转换
    const config = configModule.default as ExternalProgramsConfig;
    
    if (config && Array.isArray(config.programs)) {
      log.info(`Loaded ${config.programs.length} external programs`);
      return config;
    } else {
      log.warn('Invalid external programs config structure');
      return { programs: [] };
    }
  } catch (error: any) {
    log.error(`Failed to load external programs config: ${error.message}`);
    return { programs: [] };
  }
};

/**
 * 获取指定ID的外部程序配置
 * @param programId 程序ID
 * @returns 外部程序配置，如果未找到则返回null
 */
export const getExternalProgramById = async (programId: string): Promise<ExternalProgram | null> => {
  try {
    const config = await loadExternalProgramsConfig();
    const program = config.programs.find(p => p.id === programId);
    return program || null;
  } catch (error: any) {
    log.error(`Failed to get external program: ${error.message}`);
    return null;
  }
};
