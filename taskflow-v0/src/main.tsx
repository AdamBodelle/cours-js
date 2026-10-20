import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

import { Card } from "./components/Card.tsx";
import { MAX_TITLE } from "./types.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter : relie l'application à l'URL */}
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
