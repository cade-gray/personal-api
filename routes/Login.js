const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const generateAndStoreToken = require("../lib/generateAndStoreToken");
router.use((req, res, next) => {
  next();
});
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  // Check the username against the database
  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length === 1) {
        const user = results[0];

        // Compare the provided password with the hashed password from the database
        bcrypt.compare(
          password,
          user.password,
          async (compareErr, passwordMatch) => {
            if (compareErr) {
              console.error("Error comparing passwords:", compareErr);
              res.status(500).json({ error: "Internal server error" });
            } else if (passwordMatch) {
              const token = await generateAndStoreToken(username);
              res.json({
                success: true,
                message: "Login successful",
                token: token,
              });
            } else {
              res.status(401).json({ error: "Invalid credentials" });
            }
          }
        );
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });
  connection.end();
});

module.exports = router;
