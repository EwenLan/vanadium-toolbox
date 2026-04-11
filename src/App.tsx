import "./App.css";
import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Route, Routes } from "react-router";
import GroupOptions from "./templates/groupoptions";
import Nav1 from "./pages/home/nav1";
import Nav2 from "./pages/home/nav2";
import Nav3 from "./pages/home/nav3";
import AppNavigator from "./templates/appnavigator";
import About from "./pages/about";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 从localStorage中读取主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppNavigator isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} >
            <Route path="/home" element={<GroupOptions />}>
              <Route path="nav1" element={<Nav1 />} />
              <Route path="nav2" element={<Nav2 />} />
              <Route path="nav3" element={<Nav3 />} />
            </Route>
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
