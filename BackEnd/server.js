const express = require("express");
const cors = require("cors");
const path = require("path");

const recommendRoute = require("./routes/recommendCrop");
const cropHealthRoute = require("./routes/cropHealth");
const harvestRoute = require("./routes/harvest");
const sellingRoute = require("./routes/selling");
const diseaseDetectionRoute = require("./routes/diseaseDetectionRoutes");
const authRoute = require("./routes/auth");
const schemesRoute = require("./routes/schemes");
const connectDB = require("./Config/db");

if (typeof process.loadEnvFile === "function") {
  process.loadEnvFile(path.join(__dirname, ".env"));
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/recommend-crop", recommendRoute);
app.use("/crop-health", cropHealthRoute);
app.use("/harvest", harvestRoute);
app.use("/selling", sellingRoute);
app.use("/api", diseaseDetectionRoute);
app.use("/", diseaseDetectionRoute);
app.use("/auth", authRoute);
app.use("/schemes", schemesRoute);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
