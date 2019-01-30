const fetch = require("node-fetch");
const app = require("express")();
const Airtable = require("airtable");
const { createGameId } = require("../../../utils.js");

const { AIRTABLE_KEY, AIRTABLE_BASE } = require("../../../constants.js");

const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE);

const getBaseUrl = req => `${req.protocol}://${req.get("Host")}`;

const getPhrases = async baseUrl =>
  await fetch(`${baseUrl}/api/phrases`)
    .then(res => res.json())
    .then(({ phrases }) => phrases);

const createGame = async (gameCode, phrases, done) => {
  base("games").create(
    {
      id: `${gameCode}`,
      teams: JSON.stringify([{ id: 1, players: [] }, { id: 2, players: [] }]),
      phrases: JSON.stringify(phrases)
    },
    done
  );
};

app.get("/", async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const phrases = await getPhrases(baseUrl);
  const gameCode = createGameId();
  createGame(gameCode, phrases, (err, record) => {
    if (err) {
      console.error(err);
      res.status(400).send({ msg: err });
    }
    res.status(200).send({ gameCode });
  });
});

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
          const redirectUrl = getBaseUrl(req);
          console.log(
            "in code route but didnt find route, so redirecting to ",
            redirectUrl
          );
          res.redirect(redirectUrl);
        }
      },
      err => {
        if (err) {
          console.log("get error: ", err);
          res.status(400).send({ msg: err });
        }
      }
    );
});

module.exports = app;
