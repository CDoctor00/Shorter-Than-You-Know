import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeContextProvider from "../contexts/theme/Provider.tsx";
import ModalContextProvider from "../contexts/modal/Provider.tsx";
import App from "./App.tsx";
import "./index.css";
import UrlContextProvider from "../contexts/url/Provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <UrlContextProvider>
        <ModalContextProvider>
          <App />
          <div id="portal-wrapper"></div>
        </ModalContextProvider>
      </UrlContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
