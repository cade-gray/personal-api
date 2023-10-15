const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const authenticateToken = require("../lib/authenticateToken");
router.use((req, res, next) => {
  next();
});
router.post("/guests", authenticateToken, (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query("SELECT * FROM `Guests`", function (err, results) {
    res.json(results);
  });
  connection.end();
});
module.exports = router;
