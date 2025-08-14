import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { FavoriteProvider } from "./context/FavoriteContext.tsx";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <FavoriteProvider>
          <App />
        </FavoriteProvider>
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>
);
