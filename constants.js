require("dotenv").config();

module.exports = {
  AIRTABLE_KEY: process.env.AIRTABLE_KEY,
  AIRTABLE_GAMES_BASE: process.env.AIRTABLE_GAMES_BASE,
  CATEGORY_BASES: {
    millennials: process.env.MILLENNIALS_BASE,
    idioms: process.env.IDIOMS_BASE,
    entertainment: process.env.ENTERTAINMENT_BASE,
    "tech/inventions": process.env.TECH_INVENTIONS_BASE,
    geography: process.env.GEOGRAPHY_BASE,
    "around the house": process.env.AROUND_THE_HOUSE_BASE,
    "food/drink": process.env.FOOD_DRINK_BASE,
    "plants/animals": process.env.PLANTS_ANIMALS_BASE
  }
};
