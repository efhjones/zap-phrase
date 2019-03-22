const app = require("express")();
const Airtable = require("airtable");
const { AIRTABLE_KEY, CATEGORY_BASES } = require("../../../constants.js");

const getBaseCodeForCategory = category => CATEGORY_BASES[category];

const getPhrasesForCategory = (category, done) => {
  const baseCode = getBaseCodeForCategory(category);
  const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(baseCode);
  let phrases = [];
  base("phrases")
    .select({
      view: "Grid view"
    })
    .eachPage(
      (records, fetchNextPage) => {
        records.forEach(function(record) {
          const phrase = record.get("phrase");
          phrases = phrase ? phrases.concat({ phrase }) : phrases;
        });
        fetchNextPage();
      },
      err => {
        done(err, phrases);
      }
    );
};

const getPhrases = (categoryArray, phrases = [], done) => {
  if (categoryArray.length === 0) {
    done(null, phrases);
  } else {
    const nextCategory = categoryArray[0];
    const newCategoryArray = categoryArray.slice(1);
    getPhrasesForCategory(nextCategory, (err, phrases) => {
      getPhrases(newCategoryArray, phrases, done);
    });
  }
};

app.get("/", (req, res) => {
  const categories = req.query.categories.split(",");
  getPhrases(categories, [], (err, phrases) => {
    if (err) {
      res
        .status(400)
        .send({ msg: "We ran into a problem getting phrases", err });
    } else {
      res.status(200).send(phrases);
    }
  });
});

module.exports = app;
