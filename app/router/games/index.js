const fetch = require("node-fetch");
const app = require("express")();
const Airtable = require("airtable");

const { AIRTABLE_KEY, AIRTABLE_BASE } = require("../../../constants.js");

const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE);

app.get("/:code", (req, res) => {
  const gameCode = req.params.code;
  base("games")
    .select({
      view: "Grid view",
      cellFormat: "json"
    })
    .eachPage(
      async (records, fetchNextPage) => {
        const record = records.filter(record => {
          return record.fields.id === gameCode;
        })[0];
        if (record) {
          res.status(200).send({ game: record.fields });
        } else {
          const phrases = await fetch(
            `${req.protocol}://${req.get("Host")}/api/phrases`
          ).then(res => res.json());
          base("games").create(
            {
              id: `${gameCode}`,
              teams: JSON.stringify([
                { id: 1, players: [] },
                { id: 2, players: [] }
              ]),
              phrases: JSON.stringify(phrases)
            },
            (err, record) => {
              if (err) {
                console.error(err);
                res.status(400).send({ msg: err });
              }
              res.status(201).send({ game: record.fields });
            }
          );
        }
      },
      err => {
        if (err) {
          res.status(400).send({ msg: err });
        }
      }
    );
});

module.exports = app;
