/**
 * 应用主组件
 * 负责应用的整体布局和路由管理
 */
import "./App.css";
import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from "react-router";
import AppNavigator from "./templates/appnavigator";
import { loadAppConfig, toggleTheme, changeLanguage } from './utils/appLogic';
import { generateRoutes, routes } from './utils/routes.tsx';

/**
 * App 组件
 * - 管理应用的主题和语言状态
 * - 配置路由结构
 * - 加载应用初始配置
 */
function App() {
  // 主题状态管理
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 语言状态管理
  const [language, setLanguage] = useState('zh-CN');

  /**
   * 组件挂载时加载应用配置
   */
  useEffect(() => {
    loadAppConfig(setIsDarkMode, setLanguage);
  }, []);

  /**
   * 处理主题切换
   */
  const handleToggleTheme = async () => {
    await toggleTheme(isDarkMode, language, setIsDarkMode);
  };

  /**
   * 处理语言切换
   * @param newLanguage 新语言代码
   */
  const handleChangeLanguage = async (newLanguage: string) => {
    await changeLanguage(language, newLanguage, setLanguage);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* 主路由 - 包含导航栏 */}
          <Route 
            path="/" 
            element={
              <AppNavigator 
                isDarkMode={isDarkMode} 
                toggleTheme={handleToggleTheme} 
                language={language} 
                changeLanguage={handleChangeLanguage} 
              /> 
            } 
          >
            {/* 生成路由配置 */}
            {generateRoutes(routes[0].children || [])}
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
