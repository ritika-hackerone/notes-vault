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


import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

// Catch-all error handler (must be last, with 4 arguments)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));