import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ExternalProgram } from '../types/external-programs';
import { loadExternalProgramsConfig } from './externalPrograms';
import log from './logger';

// 定义上下文类型
interface ExternalProgramsContextType {
  programs: ExternalProgram[];
  loading: boolean;
  error: string | null;
}

// 创建上下文
const ExternalProgramsContext = createContext<ExternalProgramsContextType | undefined>(undefined);

// 提供者组件
interface ExternalProgramsProviderProps {
  children: ReactNode;
}

export const ExternalProgramsProvider: React.FC<ExternalProgramsProviderProps> = ({ children }) => {
  const [programs, setPrograms] = useState<ExternalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载外部程序配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const config = await loadExternalProgramsConfig();
        setPrograms(config.programs);
        setError(null);
      } catch (err: any) {
        log.error(`Failed to load external programs config: ${err.message}`);
        setError('加载外部程序配置失败');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []); // 空依赖数组，确保只加载一次

  return (
    <ExternalProgramsContext.Provider value={{ programs, loading, error }}>
      {children}
    </ExternalProgramsContext.Provider>
  );
};

// 自定义钩子
export const useExternalPrograms = (): ExternalProgramsContextType => {
  const context = useContext(ExternalProgramsContext);
  if (context === undefined) {
    throw new Error('useExternalPrograms must be used within an ExternalProgramsProvider');
  }
  return context;
};

// 辅助函数：根据ID获取程序
export const getProgramById = (id: string): ExternalProgram | undefined => {
  const context = useContext(ExternalProgramsContext);
  if (context === undefined) {
    throw new Error('getProgramById must be used within an ExternalProgramsProvider');
  }
  return context.programs.find(program => program.id === id);
};
