require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");

const app = express();

const categoryRoutes = require("./routes/categoryRoutes");
const promptRoutes = require("./routes/promptRoutes");


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("AI Prompt Library Backend Running");
});

app.use("/api/categories", categoryRoutes);
app.use("/api/prompts", promptRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});