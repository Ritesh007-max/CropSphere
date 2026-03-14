const express = require("express");
const cors = require("cors");

const recommendRoute = require("./routes/recommendCrop");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/recommend-crop", recommendRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});