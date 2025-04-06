// === server.js ===
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const { registerUser } = require("./controllers/userController");
const geoDataRoutes = require("./routes/geodataRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
// app.post("/api/users/register", registerUser);
app.use("/api/auth", authRoutes);
// app.use("/api", geoDataRoutes);
app.use('/api/geo-data', geoDataRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
