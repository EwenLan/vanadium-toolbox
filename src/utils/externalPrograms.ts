/**
 * 外部程序配置管理
 * 处理外部程序配置的加载和解析
 */
import log from './logger';
import { ExternalProgram, ExternalProgramsConfig } from '../types/external-programs';

/**
 * 获取默认的 MD5 校验程序配置
 * @returns MD5 校验程序配置
 */
const getDefaultMd5sumProgram = (): ExternalProgram => {
  return {
    id: "md5sum",
    name: "MD5 校验",
    path: "md5sum",
    description: "计算文件或字符串的 MD5 哈希值",
    parameters: [
      {
        name: "input",
        label: "输入",
        type: "string",
        required: true,
        description: "要计算 MD5 的字符串或文件路径"
      }
    ]
  };
};

/**
 * 获取默认的 Echo 命令程序配置
 * @returns Echo 命令程序配置
 */
const getDefaultEchoProgram = (): ExternalProgram => {
  return {
    id: "echo",
    name: "Echo 命令",
    path: "echo",
    description: "输出指定的字符串",
    parameters: [
      {
        name: "message",
        label: "消息",
        type: "string",
        required: true,
        description: "要输出的消息"
      }
    ]
  };
};

/**
 * 获取默认的 Ping 测试程序配置
 * @returns Ping 测试程序配置
 */
const getDefaultPingProgram = (): ExternalProgram => {
  return {
    id: "ping",
    name: "Ping 测试",
    path: "ping",
    description: "测试网络连接",
    parameters: [
      {
        name: "host",
        label: "主机",
        type: "string",
        required: true,
        description: "要 ping 的主机地址"
      },
      {
        name: "count",
        label: "次数",
        type: "number",
        required: false,
        default: 4,
        description: "ping 的次数"
      }
    ]
  };
};

/**
 * 获取默认的外部程序配置
 * @returns 默认的外部程序配置对象
 */
const getDefaultProgramsConfig = (): ExternalProgramsConfig => {
  return {
    programs: [
      getDefaultMd5sumProgram(),
      getDefaultEchoProgram(),
      getDefaultPingProgram()
    ]
  };
};

/**
 * 加载外部程序配置
 * @returns 外部程序配置对象
 */
export const loadExternalProgramsConfig = async (): Promise<ExternalProgramsConfig> => {
  try {
    log.info('Loading external programs config');
    
    // 尝试通过 Tauri 后端获取配置
    try {
      // 通过 Tauri 后端获取配置
      const { invoke } = await import('@tauri-apps/api/core');
      const config = await invoke('read_external_programs_config');
      
      // 转换后端返回的数据格式
      const formattedConfig: ExternalProgramsConfig = {
        programs: (config as any).programs.map((program: any) => ({
          id: program.id,
          name: program.name,
          path: program.path,
          description: program.description,
          parameters: program.parameters.map((param: any) => ({
            name: param.name,
            label: param.label,
            type: param.type_, // 后端使用 type_，前端使用 type
            required: param.required,
            default: param.default,
            description: param.description
          })),
          platformArgs: program.platform_args ? {
            ...program.platform_args
          } : undefined
        }))
      };
      
      if (formattedConfig && Array.isArray(formattedConfig.programs)) {
        log.info(`Loaded ${formattedConfig.programs.length} external programs from backend`);
        return formattedConfig;
      } else {
        log.warn('Invalid external programs config structure from backend');
        // 返回默认数据
        return getDefaultProgramsConfig();
      }
    } catch (error: any) {
      log.warn(`Failed to load external programs from backend: ${error.message}, using default data`);
      // 返回默认数据
      return getDefaultProgramsConfig();
    }
  } catch (error: any) {
    log.error(`Failed to load external programs config: ${error.message}`);
    return getDefaultProgramsConfig();
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

/**
 * 获取当前平台类型
 * @returns 平台类型字符串 (win32, darwin, linux)
 */
export const getCurrentPlatform = async (): Promise<string> => {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const platform = await invoke<string>('get_platform');
    log.info(`Current platform: ${platform}`);
    return platform;
  } catch (error: any) {
    log.warn(`Failed to get platform from backend: ${error.message}, using darwin as default`);
    return 'darwin';
  }
};

/**
 * 替换模板字符串中的变量
 * @param template 模板字符串
 * @param paramName 参数名
 * @param value 参数值
 * @returns 替换后的字符串
 */
const replaceTemplateVariable = (template: string, paramName: string, value: string | number): string => {
  return template.replace(new RegExp(`\\{${paramName}\\}`, 'g'), value.toString());
};

/**
 * 检查模板中是否还有未替换的变量
 * @param arg 参数字符串
 * @returns 是否包含未替换的变量
 */
const hasUnreplacedVariables = (arg: string): boolean => {
  return arg.includes('{') && arg.includes('}');
};

/**
 * 根据平台和参数值构建命令参数
 * @param platformArgs 平台参数配置
 * @param platform 当前平台
 * @param paramValues 参数值映射
 * @returns 构建后的命令参数数组
 */
export const buildCommandArgs = (
  platformArgs: Record<string, string[]> | undefined,
  platform: string,
  paramValues: Record<string, string | number>
): string[] => {
  const args: string[] = [];

  if (!platformArgs) {
    log.info('No platformArgs configured, using default param order');
    return Object.values(paramValues).map(v => v.toString());
  }

  // 优先使用特定平台的配置
  if (platformArgs[platform]) {
    log.info(`Using platform-specific args for ${platform}`);
    platformArgs[platform].forEach(argTemplate => {
      let arg = argTemplate;
      for (const [paramName, value] of Object.entries(paramValues)) {
        arg = replaceTemplateVariable(arg, paramName, value);
      }
      if (!hasUnreplacedVariables(arg)) {
        args.push(arg);
      } else {
        log.warn(`Skipping arg with unreplaced variables: ${arg}`);
      }
    });
    return args;
  }

  // 没有特定平台配置，尝试使用 any 选项
  if (platformArgs['any']) {
    log.info(`No platform-specific args for ${platform}, using "any" configuration`);
    platformArgs['any'].forEach(argTemplate => {
      let arg = argTemplate;
      for (const [paramName, value] of Object.entries(paramValues)) {
        arg = replaceTemplateVariable(arg, paramName, value);
      }
      if (!hasUnreplacedVariables(arg)) {
        args.push(arg);
      } else {
        log.warn(`Skipping arg with unreplaced variables: ${arg}`);
      }
    });
    return args;
  }

  // 尝试 darwin 作为默认
  if (platformArgs['darwin']) {
    log.warn(`No args for ${platform}, trying darwin as default`);
    platformArgs['darwin'].forEach(argTemplate => {
      let arg = argTemplate;
      for (const [paramName, value] of Object.entries(paramValues)) {
        arg = replaceTemplateVariable(arg, paramName, value);
      }
      if (!hasUnreplacedVariables(arg)) {
        args.push(arg);
      }
    });
    return args;
  }

  // 没有任何匹配的配置，使用默认参数顺序
  log.warn('No platform configuration matched, using default param order');
  return Object.values(paramValues).map(v => v.toString());
};
