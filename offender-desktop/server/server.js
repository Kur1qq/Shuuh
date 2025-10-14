import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import offenderRoutes from "./routes/offenderRoutes.js"; // ← энэ мөрийг нэм

const app = express();
const PORT = 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ API routes
app.use("/api", offenderRoutes); // ← энэ хамгийн чухал шугам

// ✅ Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
