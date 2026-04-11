/**
 * 路由配置管理
 * 集中管理应用的路由配置，简化路由管理
 */
import { ReactNode } from 'react';
import { Navigate, Route } from 'react-router';
import GroupOptions from '../templates/groupoptions';
import Nav1 from '../pages/home/nav1';
import Nav2 from '../pages/home/nav2';
import Nav3 from '../pages/home/nav3';
import About from '../pages/about';

/**
 * 路由配置接口
 */
export interface RouteConfig {
  path: string;          // 路由路径
  element?: ReactNode;   // 路由组件（重定向路由不需要）
  children?: RouteConfig[]; // 子路由
  index?: boolean;       // 是否为索引路由
  redirect?: string;     // 重定向路径
  label?: string;        // 导航菜单标签
  title?: string;        // 面包屑标题
}

/**
 * 应用路由配置
 */
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: null, // 由App组件提供AppNavigator
    children: [
      {
        path: '',
        redirect: '/home/nav1',
        index: true
      },
      {
        path: 'home',
        element: <GroupOptions />,
        label: 'Home',
        title: 'Home',
        children: [
          {
            path: '',
            redirect: 'nav1',
            index: true
          },
          {
            path: 'nav1',
            element: <Nav1 />,
            label: 'Nav 1',
            title: 'Nav 1'
          },
          {
            path: 'nav2',
            element: <Nav2 />,
            label: 'Nav 2',
            title: 'Nav 2'
          },
          {
            path: 'nav3',
            element: <Nav3 />,
            label: 'Nav 3',
            title: 'Nav 3'
          }
        ]
      },
      {
        path: 'about',
        element: <About />,
        label: 'About',
        title: 'About'
      }
    ]
  }
];

/**
 * 生成路由组件
 * @param routeConfig 路由配置
 * @returns 路由组件
 */
export const generateRoutes = (routeConfig: RouteConfig[]) => {
  return routeConfig.map((route) => {
    if (route.redirect) {
      return (
        <Route
          key={route.path || 'index'}
          path={route.path}
          index={route.index}
          element={<Navigate to={route.redirect} replace />}
        />
      );
    }

    if (route.children) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        >
          {generateRoutes(route.children)}
        </Route>
      );
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    );
  });
};
