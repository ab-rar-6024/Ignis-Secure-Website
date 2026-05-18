import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/App.tsx";
import "./styles/index.css";

// 🔁 Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "991135671019-n4mpuv0lk0qe5lca4m17148i66mcjo9i.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);