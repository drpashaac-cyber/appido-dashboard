import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppidoDashboard from "@/AppidoDashboard";
import { DataProvider } from "@/lib/dataset";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataProvider>
      <AppidoDashboard />
    </DataProvider>
  </StrictMode>,
);
