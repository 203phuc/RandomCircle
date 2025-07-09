import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CircleGame from "./CircleGame";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CircleGame />
  </StrictMode>
);
