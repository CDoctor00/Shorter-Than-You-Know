import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeContextProvider from "../contexts/theme/Provider.tsx";
import ModalContextProvider from "../contexts/modal/Provider.tsx";
import UrlContextProvider from "../contexts/url/Provider.tsx";
import HistoryContextProvider from "../contexts/history/Provider.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <HistoryContextProvider>
        <UrlContextProvider>
          <ModalContextProvider>
            <App />
            <div id="portal-wrapper"></div>
          </ModalContextProvider>
        </UrlContextProvider>
      </HistoryContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
