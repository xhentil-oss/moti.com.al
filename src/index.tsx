import React from "react";
import ReactDOM from "react-dom/client";
import { AnimaProvider } from "./lib/anima";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <AnimaProvider>
      <App />
    </AnimaProvider>
  </React.StrictMode>,
);
