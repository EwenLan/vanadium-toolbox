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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('zh-CN');

  useEffect(() => {
    loadAppConfig(setIsDarkMode, setLanguage);
  }, []);

  const handleToggleTheme = async () => {
    await toggleTheme(isDarkMode, language, setIsDarkMode);
  };

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
          <Route path="/" element={<AppNavigator isDarkMode={isDarkMode} toggleTheme={handleToggleTheme} language={language} changeLanguage={handleChangeLanguage} />} >
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
