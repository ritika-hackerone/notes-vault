import "dotenv/config";
import express from "express";
import cors from "cors"

const app = express();
app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(express.json());

app.get("/health", (req,res)=>{
    res.json({status: "ok"});
});

const port = process.env.PORT || 4000;

app.listen(port, ()=>console.log(`API running on http://localhost:${port}`));
