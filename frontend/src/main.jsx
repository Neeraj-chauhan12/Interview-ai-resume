import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./features/auth/AuthContext.jsx";
import { InterviewProvider } from "./features/Interview/InterviewContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </AuthProvider>
    
  </StrictMode>,
);
