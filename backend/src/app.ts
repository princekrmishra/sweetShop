import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { requireAuth } from "./middlewares/requireAuth";
import { requireAdmin } from "./middlewares/requireAdmin";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

app.get('/env-check', (_, res) => {
  res.json({
    databaseUrlLoaded: !!process.env.DATABASE_URL,
  });
});

app.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

app.get("/admin-only", requireAuth, requireAdmin, (_, res) => {
  res.json({ message: "Welcome admin" });
});


app.use("/api/auth", authRoutes);

export default app;
