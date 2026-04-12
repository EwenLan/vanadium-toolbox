/**
 * Tauri 环境检测工具
 * 检测当前是否在 Tauri 应用环境中运行
 */

/**
 * 检测当前是否在 Tauri 应用环境中运行
 * @returns 是否在 Tauri 环境中
 */
export const isTauri = (): boolean => {
  // 直接返回 true，因为这个程序不需要保证浏览器模式下的功能
  return true;
};
