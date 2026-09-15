import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SendOtp from "./pages/SendOtp";
import VerifyOtp from "./pages/VerifyOtp";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "16px", textAlign: "center" }}>
        <Link to="/" style={{ marginRight: "16px" }}>Send OTP</Link>
        <Link to="/verify">Verify OTP</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SendOtp />} />
        <Route path="/verify" element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
  );
}