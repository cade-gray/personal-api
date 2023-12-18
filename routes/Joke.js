/**
 * Joke.js
 * Endpoint for inserting jokes into the database.
 * Created By: Cade Gray.
 */
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const authenticateToken = require("../lib/authenticateToken");
router.use((req, res, next) => {
  next();
});
router.post("/", authenticateToken, (req, res) => {
  const { joke } = req.body;
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query("select max(jokeid) as jokeid from jokes", (err, result) => {
    if (err) {
      console.error("Error pulling jokeid from database:", err);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      console.log(result);
      var jokeid = result[0].jokeid + 1; // assuming result[0].jokeid gives the max jokeid
      connection.query(
        "INSERT INTO jokes (jokeid, setup, punchline) VALUES (?, ?, ?)",
        [jokeid, joke.setup, joke.punchline],
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
          console.log(result);
          return res
            .status(200)
            .json({ success: true, message: "Joke inserted successfully" });
        }
      );
    }
    connection.end();
  });
});
module.exports = router;