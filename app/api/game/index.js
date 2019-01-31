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

const createGame = (gameCode, phrases, done) => {
  base("games").create(
    {
      id: `${gameCode}`,
      teams: JSON.stringify([{ id: 1, players: [] }, { id: 2, players: [] }]),
      phrases: JSON.stringify(phrases)
    },
    done
  );
};

const updateGame = (record, data, done) => {
  base("games").update(record.id, data, (err, record) => {
    if (err) {
      done({ error: err });
    } else {
      done({ record });
    }
  });
};

const findGame = (gameCode, done) => {
  console.log("looking for game: ", gameCode);
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
        done({ record });
      },
      err => {
        done({ error: err });
      }
    );
};

app.get("/", async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const phrases = await getPhrases(baseUrl);
  const gameCode = createGameId();
  createGame(gameCode, phrases, (err, record) => {
    if (err) {
      res.status(400).send({ msg: err });
    }
    res.status(200).send({ gameCode });
  });
});

app.get("/:code", (req, res) => {
  const gameCode = req.params.code;
  findGame(gameCode, result => {
    if (result.error) {
      res.status(400).send({ msg: result.error });
    } else if (result.record) {
      res.status(200).send({ game: result.record.fields });
    } else {
      res.status(404).send({ msg: "game not found", result });
    }
  });
});

app.post("/startGame", (req, res) => {
  const { gameId } = req.body;
  console.log("received request to start game: ", gameId);
  findGame(gameId, ({ record, error }) => {
    if (error) {
      console.log("ran into an error: ", error);
      res.status(404).send({ msg: "game not found", error });
    } else {
      console.log("found the game: ", record.fields);
      updateGame(
        record,
        {
          isActive: true
        },
        result => {
          if (result.error) {
            res.status(409).send({
              msg: "We ran into an error updatin the game",
              error: result.error
            });
          } else {
            console.log(
              "updated successfully, ",
              record.fields.id,
              record.fields.isActive
            );
            res.status(202).send({ game: result.record.fields });
          }
        }
      );
    }
  });
});

app.post("/addPlayer", (req, res) => {
  console.log("adding player, yo!", req);
});

module.exports = app;
