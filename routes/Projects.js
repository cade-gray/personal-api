const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
router.use((req, res, next) => {
  next();
});
router.get("/", (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query("SELECT * FROM projects order by projectId desc", function (err, results) {
    if (err) {
    console.log(err);
    res.json(err);
  }
  else {
    res.json(results);
    }
  });
  connection.end();
});
module.exports = router;