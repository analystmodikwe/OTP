import express from "express";
import cors from "cors";
import otpRoutes from "./routes/otpRoutes";

const app = express();

app.use(cors({ origin: "https://otp-chi-nine.vercel.app" }));

app.use(express.json());
app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});