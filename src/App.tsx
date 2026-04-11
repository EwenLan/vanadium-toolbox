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
// 动态导入invoke函数，避免在Web环境中出错
let invoke: (cmd: string, args?: any) => Promise<any> = async () => {};

// 尝试导入invoke函数
if (typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined) {
  // 在Tauri环境中，使用__TAURI__对象
  invoke = (cmd: string, args?: any) => {
    return (window as any).__TAURI__.invoke(cmd, args);
  };
}



function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('zh-CN');

  useEffect(() => {
    // 从后端读取配置
    const loadConfig = async () => {
      try {
        const config = await invoke('read_config');
        if (config) {
          setIsDarkMode(config.theme === 'dark');
          setLanguage(config.language);
          // 切换语言
          const i18n = await import('./i18n');
          i18n.default.changeLanguage(config.language);
        } else {
          // 使用默认配置
          setIsDarkMode(false);
          setLanguage('zh-CN');
        }
      } catch (error) {
        console.error('Failed to load config:', error);
        // 使用默认配置
        setIsDarkMode(false);
        setLanguage('zh-CN');
      }
    };

    loadConfig();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    // 写入配置到后端
    try {
      await invoke('write_config', {
        config: {
          theme: newTheme ? 'dark' : 'light',
          language,
          window_width: 800,
          window_height: 600
        }
      });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const changeLanguage = async (newLanguage: string) => {
    setLanguage(newLanguage);
    // 切换语言
    const i18n = await import('./i18n');
    i18n.default.changeLanguage(newLanguage);
    // 写入配置到后端
    try {
      await invoke('write_config', {
        config: {
          theme: isDarkMode ? 'dark' : 'light',
          language: newLanguage,
          window_width: 800,
          window_height: 600
        }
      });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppNavigator isDarkMode={isDarkMode} toggleTheme={toggleTheme} language={language} changeLanguage={changeLanguage} />} >
            <Route index element={<Navigate to="/home/nav1" replace />} />
            <Route path="home" element={<GroupOptions />}>
              <Route index element={<Navigate to="nav1" replace />} />
              <Route path="nav1" element={<Nav1 />} />
              <Route path="nav2" element={<Nav2 />} />
              <Route path="nav3" element={<Nav3 />} />
            </Route>
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
