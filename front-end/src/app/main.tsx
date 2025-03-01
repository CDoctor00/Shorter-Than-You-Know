import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeContextProvider from "../contexts/theme/Provider.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>
);
