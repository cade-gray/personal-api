const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const authenticateToken = require("../lib/authenticateToken");
router.use((req, res, next) => {
  next();
});
router.post("/", authenticateToken, (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { user } = req.body;
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  // Delete the token from the database
  connection.query(
    "DELETE FROM tokens WHERE token = ? and username = ?",
    [token, user],
    (err, result) => {
      if (err) {
        console.error("Error removing token from database:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Token not found" });
      }

      return res.status(200).json({ message: "Token removed successfully" });
    }
  );
  connection.end();
});
module.exports = router;
