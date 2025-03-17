const mongoose = require("mongoose");
const Pan = require("./panModel"); // Assuming Pan.js is in the same models directory

const calculatePriority = async user => {
  let priorityScore = 0;

  // Fetch associated Pan document (assuming a link via phoneNumber or email)
  const pan = await Pan.findOne({ phoneNumber: user.phoneNumber });

  // 1. Customer Priority Factor (0-20 points) - Based on User.customerPriority
  switch (user.customerPriority) {
    case "Premium":
      priorityScore += 20;
      break;
    case "High":
      priorityScore += 15;
      break;
    case "Medium":
      priorityScore += 10;
      break;
    case "Low":
      priorityScore += 5;
      break;
    default:
      priorityScore += 5;
  }

  // 2. Account Age Factor (0-20 points) - Based on User.createdAt
  const accountAgeInYears = (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 365);
  if (accountAgeInYears >= 5) {
    priorityScore += 20;
  } else if (accountAgeInYears >= 3) {
    priorityScore += 15;
  } else if (accountAgeInYears >= 1) {
    priorityScore += 10;
  }

  // 3. Credit Score Factor (0-20 points) - Based on Pan.credit_score
  if (pan) {
    if (pan.credit_score >= 800) {
      priorityScore += 20;
    } else if (pan.credit_score >= 700) {
      priorityScore += 15;
    } else if (pan.credit_score >= 600) {
      priorityScore += 10;
    }
  }

  // 4. Income Range Factor (0-20 points) - Based on Pan.income_range
  if (pan) {
    const incomeRange = parseInt(pan.income_range.replace(/[^0-9]/g, "")) || 0; // Extract number if in format "500000-1000000"
    if (incomeRange >= 1000000) {
      priorityScore += 20;
    } else if (incomeRange >= 500000) {
      priorityScore += 15;
    } else if (incomeRange >= 200000) {
      priorityScore += 10;
    }
  }

  // 5. Spending Behavior Factor (0-20 points) - Based on Pan.spending_behavior.avg_monthly_spend
  if (pan && pan.spending_behavior) {
    if (pan.spending_behavior.avg_monthly_spend >= 100000) {
      priorityScore += 20;
    } else if (pan.spending_behavior.avg_monthly_spend >= 50000) {
      priorityScore += 15;
    } else if (pan.spending_behavior.avg_monthly_spend >= 20000) {
      priorityScore += 10;
    }
  }

  // Cap the score at 100
  return Math.min(100, priorityScore);
};

module.exports = calculatePriority;
