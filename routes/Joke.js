/**
 * Joke.js
 * Endpoints for Joke and joke sequence related requests.
 * Created By: Cade Gray.
 */
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const authenticateToken = require("../lib/authenticateToken");
router.use((req, res, next) => {
  next();
});

router.get("/", (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "SELECT * FROM personal.jokes WHERE jokeid IN (SELECT sequenceNbr FROM personal.sequences)",
    function (err, results) {
      if (err) {
        console.error("Error pulling jokes from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/:id", (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "SELECT * FROM personal.jokes WHERE jokeid = ?",
    [req.params.id],
    function (err, results) {
      if (err) {
        console.error("Error pulling joke from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ error: "Joke not found" });
        }
      }
    }
  );
});

router.post("/all", authenticateToken, (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "SELECT * FROM jokes order by jokeid desc",
    function (err, results) {
      if (err) {
        console.error("Error pulling jokes from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/all/weblist", (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "SELECT jokeid, setup FROM jokes order by jokeid desc",
    function (err, results) {
      if (err) {
        console.error("Error pulling jokes from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
      }
    }
  );
});

router.post("/", authenticateToken, (req, res) => {
  const { joke } = req.body;
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query("select max(jokeid) as jokeid from jokes", (err, result) => {
    if (err) {
      console.error("Error pulling jokeid from database:", err);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      var jokeid = result[0].jokeid + 1; // assuming result[0].jokeid gives the max jokeid
      connection.query(
        "INSERT INTO jokes (jokeid, setup, punchline, formattedPunchline) VALUES (?, ?, ?, ?)",
        [jokeid, joke.setup, joke.punchline, joke.formattedPunchline],
        (err, result) => {
          if (err) {
            console.error("Error inserting joke into database:", err);
            if (err.code === "ER_DATA_TOO_LONG") {
              return res.status(413).json({
                success: false,
                error:
                  "Setup or Punchline exceeded char limit. Please adjust accordingly.",
              });
            }
            return res
              .status(500)
              .json({ success: false, error: "Internal server error" });
          }
          return res
            .status(200)
            .json({ success: true, message: "Joke inserted successfully" });
        }
      );
    }
    connection.end();
  });
});

router.post("/getsequence", authenticateToken, (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "SELECT * FROM personal.sequences where sequenceName = 'JokeOfDay'",
    function (err, results) {
      if (err) {
        console.error("Error pulling sequences from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
      }
    }
  );
});

router.post("/updatesequence", authenticateToken, (req, res) => {
  const { sequenceNbr } = req.body;
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "UPDATE personal.sequences SET sequenceNbr = ? WHERE sequenceName = 'JokeOfDay'",
    [sequenceNbr],
    function (err, results) {
      if (err) {
        console.error("Error updating sequence in database:", err);
        return res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      } else {
        if (results.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(500).json({ success: false, error: results });
        }
      }
    }
  );
});

router.get("/count", (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    "SELECT count(*) as count FROM personal.jokes",
    function (err, results) {
      if (err) {
        console.error("Error pulling joke count from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
      }
    }
  );
});
module.exports = router;
