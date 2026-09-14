import express from "express";
import cors from "cors";
import otpRoutes from "./routes/otpRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});