import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import ErrorBoundary from "./components/ErrorBoundary";
import { cleanupInvalidStorageItems } from "./utils/storageUtils";
import { setupUpdateFlow } from "./service-worker/updateFlow";

// Cleanup any invalid localStorage items before app initialization
cleanupInvalidStorageItems();

// Initialize service worker early
setupUpdateFlow();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ErrorBoundary>
  </StrictMode>
);
