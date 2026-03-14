const crops = require("../data/crops.json");
const regions = require("../data/regions.json");
const {
  calculateSuitability,
  calculateProfitability,
  getRiskSummary,
  normalizeLevel,
} = require("../utils/scoring");

function getRegionOptions() {
  return regions;
}

function buildActionPlan(crop, input) {
  const landSize = Number(input.landSize) || 1;
  const irrigationMode = input.irrigation ? `Use ${input.waterSource || "available"} irrigation for uniform moisture.` : "Depend on rainfall timing and reserve one backup irrigation if possible.";

  return crop.actionTemplate.map((step, index) => ({
    dayRange: `Day ${index * 7 + 1}-${index * 7 + 7}`,
    task: `${step}. ${index === 1 ? irrigationMode : `Cover ${landSize} acre(s) in this phase.`}`,
  }));
}

function buildCards(crop, input, successRate) {
  const profitability = calculateProfitability(crop, input.landSize);
  const risk = getRiskSummary(crop);
  const estimatedWater = normalizeLevel(crop.waterRequirement) === "high" ? "High water demand" : normalizeLevel(crop.waterRequirement) === "medium" ? "Moderate water demand" : "Low water demand";
  const reasons = [
    `${crop.name} fits ${input.state}, ${input.district}`,
    `${crop.budgetRequirement} budget profile`,
    `${crop.labourRequirement} labour demand`,
    crop.irrigationRequired ? "benefits from irrigation support" : "works with limited irrigation",
  ];

  return [
    {
      id: "top-recommendation",
      title: "Top crop recommendation",
      type: "recommendation",
        content: {
          crop: crop.name,
          successRate,
          district: crop.district,
          season: crop.season,
          reason: reasons.join(", "),
        },
      },
    {
      id: "profitability",
      title: "Profitability estimate",
      type: "profitability",
      content: profitability,
    },
    {
      id: "resources",
      title: "Resource requirements",
      type: "resources",
      content: {
        water: estimatedWater,
        irrigation: crop.irrigationRequired ? "Irrigation recommended" : "Can work in low-irrigation conditions",
        labour: `${crop.labourRequirement} labour intensity`,
        budget: `${crop.budgetRequirement} input budget`,
        inputs: crop.resources,
      },
    },
    {
      id: "weather-window",
      title: "Weather and planting window",
      type: "weather",
      content: {
        plantingWindow: crop.weatherWindow,
        cropDuration: `${crop.growingDays} days`,
      },
    },
    {
      id: "risk-level",
      title: "Risk level",
      type: "risk",
      content: risk,
    },
    {
      id: "action-plan",
      title: "30-day farming action plan",
      type: "action-plan",
      content: buildActionPlan(crop, input),
    },
  ];
}

function recommendCrops(input) {
  if (!input.state || !input.district) {
    throw new Error("State and district are required.");
  }

  const regionalMatches = crops.filter(
    (crop) =>
      crop.state === input.state &&
      crop.district === input.district
  );

  const stateMatches = crops.filter((crop) => crop.state === input.state);
  const fallbackMatches = crops.filter((crop) => crop.state !== input.state);

  const recommendationPool = [...regionalMatches];

  stateMatches.forEach((crop) => {
    if (!recommendationPool.find((item) => item.id === crop.id)) {
      recommendationPool.push(crop);
    }
  });

  fallbackMatches.forEach((crop) => {
    if (!recommendationPool.find((item) => item.id === crop.id)) {
      recommendationPool.push(crop);
    }
  });

  const ranked = recommendationPool
    .map((crop) => {
      const successRate = calculateSuitability(input, crop);

      return {
        cropId: crop.id,
        cropName: crop.name,
        successRate,
        summary: {
          state: crop.state,
          district: crop.district,
          season: crop.season,
          waterRequirement: crop.waterRequirement,
          budgetRequirement: crop.budgetRequirement,
          labourRequirement: crop.labourRequirement,
        },
        cards: buildCards(crop, input, successRate),
      };
    })
    .sort((first, second) => second.successRate - first.successRate)
    .slice(0, 3);

  return {
    farmerProfile: {
      state: input.state,
      district: input.district,
      landSize: input.landSize,
      irrigation: input.irrigation,
      waterSource: input.waterSource,
      budget: input.budget,
      labour: input.labour,
      previousCrop: input.previousCrop || null,
    },
    topRecommendations: ranked,
  };
}

module.exports = {
  getRegionOptions,
  recommendCrops,
};
