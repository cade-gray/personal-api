const mysql = require("mysql2");
const authenticateToken = (req, res, next) => {
  const { user } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  const query = "SELECT * FROM tokens WHERE username = ? AND token = ?";
  connection.query(query, [user, token], async (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length === 1) {
        next();
      } else {
        res.status(401).json({ error: "Invalid Token" });
      }
    }
  });
};
module.exports = authenticateToken;
