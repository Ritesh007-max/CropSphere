const SCORE_WEIGHTS = {
  region: 12,
  irrigation: 18,
  waterSource: 14,
  budget: 14,
  labour: 12,
  previousCrop: 12,
  landSize: 8,
  yield: 6,
  priceTrend: 4,
};

const LEVELS = {
  low: 1,
  medium: 2,
  high: 3,
};

function normalizeLevel(value, fallback = "medium") {
  return String(value || fallback).trim().toLowerCase();
}

function compareLevels(inputValue, cropValue) {
  const input = LEVELS[normalizeLevel(inputValue)];
  const crop = LEVELS[normalizeLevel(cropValue)];

  if (!input || !crop) {
    return 0.5;
  }

  const difference = Math.abs(input - crop);

  if (difference === 0) {
    return 1;
  }

  if (difference === 1) {
    return 0.45;
  }

  return 0.05;
}

function scoreBoolean(inputValue, cropValue) {
  return Boolean(inputValue) === Boolean(cropValue) ? 1 : 0.1;
}

function scoreWaterSource(inputValue, supportedSources = []) {
  if (!inputValue) {
    return 0.5;
  }

  return supportedSources.includes(String(inputValue).trim().toLowerCase()) ? 1 : 0.1;
}

function scorePreviousCrop(previousCrop, crop) {
  if (!previousCrop) {
    return 0.55;
  }

  const normalized = String(previousCrop).trim().toLowerCase();
  const preferred = (crop.preferredPreviousCrops || []).map((item) => item.toLowerCase());
  const avoided = (crop.avoidPreviousCrops || []).map((item) => item.toLowerCase());

  if (preferred.includes(normalized)) {
    return 1;
  }

  if (avoided.includes(normalized) || crop.name.toLowerCase() === normalized) {
    return 0.1;
  }

  return 0.6;
}

function normalizeMetric(value) {
  const safeValue = Number(value) || 0;
  return Math.max(0, Math.min(1, safeValue / 100));
}

function scoreRegion(input, crop) {
  if (input.state === crop.state && input.district === crop.district) {
    return 1;
  }

  if (input.state === crop.state) {
    return 0.7;
  }

  return 0.15;
}

function scoreLandSize(landSize, crop) {
  const acres = Number(landSize) || 1;
  const labour = normalizeLevel(crop.labourRequirement);
  const budget = normalizeLevel(crop.budgetRequirement);

  if (acres <= 3) {
    if (budget === "high" || labour === "high") {
      return 1;
    }

    return 0.65;
  }

  if (acres <= 10) {
    if (budget === "medium" || labour === "medium") {
      return 1;
    }

    return 0.8;
  }

  if (labour === "high") {
    return 0.35;
  }

  if (budget === "high") {
    return 0.55;
  }

  return 1;
}

function calculateSuitability(input, crop) {
  const weightedScore =
    SCORE_WEIGHTS.region * scoreRegion(input, crop) +
    SCORE_WEIGHTS.irrigation * scoreBoolean(input.irrigation, crop.irrigationRequired) +
    SCORE_WEIGHTS.waterSource * scoreWaterSource(input.waterSource, crop.waterSource) +
    SCORE_WEIGHTS.budget * compareLevels(input.budget, crop.budgetRequirement) +
    SCORE_WEIGHTS.labour * compareLevels(input.labour, crop.labourRequirement) +
    SCORE_WEIGHTS.previousCrop * scorePreviousCrop(input.previousCrop, crop) +
    SCORE_WEIGHTS.landSize * scoreLandSize(input.landSize, crop) +
    SCORE_WEIGHTS.yield * normalizeMetric(crop.historicalYield) +
    SCORE_WEIGHTS.priceTrend * normalizeMetric(crop.priceTrend);

  return Math.round(weightedScore);
}

function calculateProfitability(crop, landSize) {
  const acres = Number(landSize) || 1;
  const gross = Math.round((crop.baseProfitPerAcre || 0) * acres);
  const costRatio = normalizeLevel(crop.budgetRequirement) === "high" ? 0.38 : normalizeLevel(crop.budgetRequirement) === "medium" ? 0.28 : 0.18;
  const estimatedCost = Math.round(gross * costRatio);

  return {
    grossRevenue: gross,
    estimatedCost,
    netProfit: gross - estimatedCost,
  };
}

function getRiskSummary(crop) {
  const label = normalizeLevel(crop.riskLevel);
  const notes = {
    low: "Stable option with manageable pest and market exposure.",
    medium: "Moderate climate and pricing sensitivity. Weekly monitoring is advised.",
    high: "Higher downside from disease pressure or price volatility. Strong field management is required.",
  };

  return {
    level: label,
    note: notes[label] || notes.medium,
  };
}

module.exports = {
  calculateSuitability,
  calculateProfitability,
  getRiskSummary,
  normalizeLevel,
};
