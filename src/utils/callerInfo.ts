/**
 * 调用栈信息解析工具
 * 用于获取日志调用的位置信息
 */

/**
 * 从栈帧中提取文件路径和行号
 * @param line 栈帧字符串
 * @returns 文件路径和行号，如果无法解析则返回null
 */
const parseStackLine = (line: string): { filePath: string; lineNumber: string } | null => {
  const patterns = [
    /\(([^:]+):(\d+):(\d+)\)/,
    /at\s+([^:]+):(\d+):(\d+)/,
    /([^:]+):(\d+):(\d+)/
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      return {
        filePath: match[1],
        lineNumber: match[2]
      };
    }
  }
  return null;
};

/**
 * 格式化文件路径信息
 * @param filePath 文件路径
 * @param lineNumber 行号
 * @returns 格式化后的位置信息
 */
const formatCallerLocation = (filePath: string, lineNumber: string): string => {
  const fileName = filePath.split('/').pop() || filePath;
  return `${fileName}:${lineNumber}`;
};

/**
 * 从错误栈中查找调用者信息
 * @param stack 错误栈字符串
 * @returns 调用者位置信息，如果找不到则返回空字符串
 */
const findCallerInStack = (stack: string): string => {
  const stackLines = stack.split('\n');
  
  for (let i = 1; i < stackLines.length; i++) {
    const line = stackLines[i].trim();
    
    if (line.includes('logger.ts') || line.includes('callerInfo.ts')) {
      continue;
    }
    
    const parsed = parseStackLine(line);
    if (parsed) {
      return formatCallerLocation(parsed.filePath, parsed.lineNumber);
    }
  }
  
  return '';
};

/**
 * 获取调用位置信息
 * @returns 调用位置的文件名和行号
 */
export const getCallerInfo = (): string => {
  try {
    const error = new Error();
    const stack = error.stack;
    
    if (stack) {
      return findCallerInStack(stack);
    }
  } catch (error) {
    console.error('Failed to get caller info:', error);
  }
  
  return '';
};
