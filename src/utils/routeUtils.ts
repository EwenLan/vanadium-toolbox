/**
 * 路由工具函数
 * 提供路由相关的辅助功能
 */
import { routes, RouteConfig } from './routes';

/**
 * 构建完整路径
 * @param parentPath 父路径
 * @param routePath 路由路径
 * @returns 完整路径
 */
const buildFullPath = (parentPath: string, routePath: string): string => {
  const normalizedParent = parentPath.replace(/\/$/, '');
  const normalizedRoute = routePath.replace(/^\//, '');
  return `${normalizedParent}/${normalizedRoute}`;
};

/**
 * 在路由配置中查找指定路径的标题
 * @param routes 路由配置数组
 * @param targetPath 目标路径
 * @param parentPath 父路径
 * @returns 找到的标题，如果没找到则返回路径本身
 */
const findTitleInRoutes = (
  routes: RouteConfig[], 
  targetPath: string, 
  parentPath: string = ''
): string | null => {
  for (const route of routes) {
    const fullPath = parentPath ? buildFullPath(parentPath, route.path) : route.path;
    
    if (fullPath === targetPath && route.title) {
      return route.title;
    }
    
    if (route.children) {
      const found = findTitleInRoutes(route.children, targetPath, fullPath);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 从路由配置中获取路径对应的标题
 * @param path 路由路径
 * @returns 路由标题
 */
export const getRouteTitle = (path: string): string => {
  const title = findTitleInRoutes(routes, path);
  return title || path.split('/').pop() || path;
};

/**
 * 获取home路由的子路由配置
 * @returns home路由的子路由数组
 */
export const getHomeRouteChildren = (): RouteConfig[] => {
  const homeRoute = routes[0].children?.find(route => route.path === 'home');
  return homeRoute?.children || [];
};
