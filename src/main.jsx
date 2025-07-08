import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BlockGameWithoutOverlapCheck from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BlockGameWithoutOverlapCheck />
  </StrictMode>
);
