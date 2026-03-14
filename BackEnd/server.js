const express = require("express");
const cors = require("cors");

const recommendRoute = require("./routes/recommendCrop");
const cropHealthRoute = require("./routes/cropHealth");
const harvestRoute = require("./routes/harvest");
const sellingRoute = require("./routes/selling");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/recommend-crop", recommendRoute);
app.use("/crop-health", cropHealthRoute);
app.use("/harvest", harvestRoute);
app.use("/selling", sellingRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
