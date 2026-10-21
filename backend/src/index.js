// import "dotenv/config";
// import express from "express";
// import cors from "cors"

// const app = express();
// app.use(cors({origin: process.env.FRONTEND_URL}));
// app.use(express.json());

// app.get("/health", (req,res)=>{
//     res.json({status: "ok"});
// });

// const port = process.env.PORT || 4000;

// app.listen(port, ()=>console.log(`API running on http://localhost:${port}`));



// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.js";
// import noteRoutes from "./routes/notes.js"; // new

// const app = express();
// app.use(cors({ origin: process.env.FRONTEND_URL }));
// app.use(express.json());

// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/notes", noteRoutes); // new

// // Catch-all error handler (must be last, with 4 arguments)
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: "Something went wrong" });
// });

// const port = process.env.PORT || 4000;
// app.listen(port, () => console.log(`API running on http://localhost:${port}`));


import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

const app = express();

app.set("trust proxy", 1); // Railway sits behind a proxy; needed so rate limiting sees real client IPs
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Slow down password guessing: 20 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/notes", noteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on port ${port}`));