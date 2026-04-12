import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import { ExternalProgramsProvider } from "./utils/externalProgramsState";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ExternalProgramsProvider>
      <App />
    </ExternalProgramsProvider>
  </React.StrictMode>,
);
