const app = require("express")();
const Airtable = require("airtable");
const { AIRTABLE_KEY, AIRTABLE_BASE } = require("../../../constants.js");

const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE);

app.get("/", (req, res) => {
  let phrases = [];
  base("phrases")
    .select({
      view: "Grid view"
    })
    .eachPage(
      (records, fetchNextPage) => {
        records.forEach(function(record) {
          const phrase = record.get("phrase");
          if (phrase) {
            phrases = phrases.concat(phrase);
          }
        });
        fetchNextPage();
      },
      err => {
        if (err) {
          console.error(err);
          return;
        }
        res.status(200).send({ phrases });
      }
    );
});

module.exports = app;
