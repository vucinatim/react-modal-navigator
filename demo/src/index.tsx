import ReactDOM from "react-dom/client";
import App from "./App";
import { ModalProvider } from "react-modal-navigator";
import { StrictMode } from "react";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>
);
