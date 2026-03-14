const express = require("express");
const router = express.Router();

const { getRegionOptions, recommendCrops } = require("../Services/cropEngine");

router.post("/", (req, res) => {
  try {
    const result = recommendCrops(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Unable to recommend crops",
    });
  }
});

router.get("/regions", (_req, res) => {
  res.json(getRegionOptions());
});

module.exports = router;
