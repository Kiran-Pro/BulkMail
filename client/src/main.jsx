import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import EmailHistory from "./pages/EmailHistory.jsx";
import LoginPage from "./pages/LoginPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/home" element={<App />} />
      <Route path="/history" element={<EmailHistory />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);
