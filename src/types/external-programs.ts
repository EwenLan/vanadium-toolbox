/**
 * 外部程序配置类型定义
 */

/**
 * 参数类型
 */
export type ParamType = 'string' | 'number';

/**
 * 外部程序参数配置
 */
export interface ProgramParameter {
  name: string;
  label: string;
  type: ParamType;
  required: boolean;
  default?: string | number;
  description: string;
}

/**
 * 外部程序配置
 */
export interface ExternalProgram {
  id: string;
  name: string;
  path: string;
  description: string;
  parameters: ProgramParameter[];
}

/**
 * 外部程序配置文件结构
 */
export interface ExternalProgramsConfig {
  programs: ExternalProgram[];
}
