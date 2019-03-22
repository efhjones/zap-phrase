const fetch = require("node-fetch");
const app = require("express")();
const Airtable = require("airtable");
const {
  createGameId,
  addPlayerToTeam,
  removePlayerfromTeam
} = require("../../../utils.js");

const { AIRTABLE_KEY, AIRTABLE_GAMES_BASE } = require("../../../constants.js");

const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_GAMES_BASE);

const getBaseUrl = req => `${req.protocol}://${req.get("Host")}`;

const getPhrases = async (baseUrl, categories) => {
  const categoryString = categories.join(",");
  const maybeCategory =
    categoryString.length > 0 ? `?categories=${categoryString}` : "";
  const url = `${baseUrl}/api/phrases${maybeCategory}`;
  return await fetch(url)
    .then(res => res.json())
    .then(phrases => phrases);
};

const createGame = (gameCode, phrases = {}, done) => {
  base("games").create(
    {
      id: `${gameCode}`,
      teams: JSON.stringify([{ id: 1, players: [] }, { id: 2, players: [] }]),
      phrases: JSON.stringify(phrases),
      category: "Random"
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
  base("games")
    .select({
      view: "Grid view",
      cellFormat: "json"
    })
    .eachPage(
      (records, fetchNextPage) => {
        const matchingRecord = records.filter(record => {
          const recordId = record.get("id");
          return recordId && recordId === gameCode;
        })[0];
        if (matchingRecord) {
          done({ record: matchingRecord });
        } else {
          fetchNextPage();
        }
      },
      err => {
        done({ error: err });
      }
    );
};

app.get("/", async (req, res) => {
  const gameCode = createGameId();
  createGame(gameCode, [], (err, record) => {
    if (err) {
      res.status(400).send({ msg: err });
    }
    res.status(200).send({ gameCode });
  });
});

app.get("/:code", (req, res) => {
  const gameCode = req.params.code;
  findGame(gameCode, result => {
    if (result.error || !result.record) {
      res.status(404).send({ msg: "game not found", result });
    } else {
      res.status(200).send({ game: result.record.fields });
    }
  });
});

app.post("/chooseCategory", (req, res) => {
  findGame(req.body.gameId, async ({ record, error }) => {
    if (error) {
      res.status(404).send({ msg: "Unable to set category", error });
    } else {
      updateGame(
        record,
        {
          category: req.body.category
        },
        result => {
          if (result.error) {
            res.status(409).send({
              msg: "We ran into an error setting the category",
              error: result.error
            });
          } else {
            res.status(202).send({ game: result.record.fields });
          }
        }
      );
    }
  });
});

app.post("/startGame", (req, res) => {
  findGame(req.body.gameId, async ({ record, error }) => {
    if (error) {
      res.status(404).send({ msg: "game not found", error });
    } else {
      const baseUrl = getBaseUrl(req);
      const recordCategory = record.get("category");
      const categories = {
        Millennials: "millennials",
        "Plants and Animals": "plants/animals",
        "Around the House": "around the house",
        "Food and Drink": "food/drink",
        Idioms: "idioms",
        Entertainment: "entertainment",
        "Tech and Inventions": "tech/inventions",
        Geography: "geography"
      };

      const chosenCategories =
        recordCategory === "Random"
          ? Object.values(categories)
          : [categories[recordCategory]];

      const categoryPhrases = await getPhrases(baseUrl, chosenCategories);
      updateGame(
        record,
        {
          isActive: true,
          phrases: JSON.stringify(categoryPhrases)
        },
        result => {
          if (result.error) {
            res.status(409).send({
              msg: "We ran into an error updatin the game",
              error: result.error
            });
          } else {
            res.status(202).send({ game: result.record.fields });
          }
        }
      );
    }
  });
});

app.post("/stopGame", (req, res) => {
  findGame(req.body.gameId, ({ record, error }) => {
    if (error) {
      res.status(404).send({ msg: "game not found", error });
    } else {
      updateGame(
        record,
        {
          isActive: false
        },
        result => {
          if (result.error) {
            res.status(409).send({
              msg: "We ran into an error updatin the game",
              error: result.error
            });
          } else {
            res.status(202).send({ game: result.record.fields });
          }
        }
      );
    }
  });
});

app.post("/addPlayer", (req, res) => {
  findGame(req.body.gameId, ({ record, error }) => {
    if (error) {
      res.status(404).send({ msg: "game not found", error });
    } else {
      const { teams, player } = addPlayerToTeam({
        teams: JSON.parse(record.fields.teams),
        name: req.body.name,
        socketId: req.body.socketId
      });
      updateGame(
        record,
        {
          teams: JSON.stringify(teams)
        },
        result => {
          if (result.error) {
            res.status(409).send({
              msg: "We ran into an error updatin' the game :'(",
              error: result.error
            });
          } else {
            res.status(202).send({ game: result.record.fields, player });
          }
        }
      );
    }
  });
});

app.post("/removePlayer", (req, res) => {
  findGame(req.body.gameId, ({ record, error }) => {
    if (error) {
      res.status(404).send({ msg: "game not found", error });
    } else {
      const newTeams = removePlayerfromTeam({
        teams: JSON.parse(record.fields.teams),
        playerName: req.body.playerName
      });
      updateGame(
        record,
        {
          teams: JSON.stringify(newTeams),
          isActive: false
        },
        result => {
          if (result.error) {
            res.status(409).send({
              msg: "We ran into an error updatin' the game :'(",
              error: result.error
            });
          } else {
            res.status(202).send({ game: result.record.fields });
          }
        }
      );
    }
  });
});

module.exports = app;
