/**
 * 应用主组件
 * 负责应用的整体布局和路由管理
 */
import "./App.css";
import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import GroupOptions from "./templates/groupoptions";
import Nav1 from "./pages/home/nav1";
import Nav2 from "./pages/home/nav2";
import Nav3 from "./pages/home/nav3";
import AppNavigator from "./templates/appnavigator";
import About from "./pages/about";
import { loadAppConfig, toggleTheme, changeLanguage } from './utils/appLogic';

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
            {/* 默认重定向到首页 */}
            <Route index element={<Navigate to="/home/nav1" replace />} />
            {/* 主页路由组 */}
            <Route path="home" element={<GroupOptions />}>
              {/* 主页默认重定向到nav1 */}
              <Route index element={<Navigate to="nav1" replace />} />
              <Route path="nav1" element={<Nav1 />} />
              <Route path="nav2" element={<Nav2 />} />
              <Route path="nav3" element={<Nav3 />} />
            </Route>
            {/* 关于页面 */}
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
