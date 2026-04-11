import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import GroupOptions from "./templates/groupoptions";
import Nav1 from "./pages/home/nav1";
import Nav2 from "./pages/home/nav2";
import Nav3 from "./pages/home/nav3";
import AppNavigator from "./templates/appnavigator";
import About from "./pages/about";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppNavigator />} >
          <Route path="/home" element={<GroupOptions />}>
            <Route path="nav1" element={<Nav1 />} />
            <Route path="nav2" element={<Nav2 />} />
            <Route path="nav3" element={<Nav3 />} />
          </Route>
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
