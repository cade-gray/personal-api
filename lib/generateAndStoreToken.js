const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2");
const generateAndStoreToken = async (username) => {
  try {
    const token = uuidv4(); // Generate a random UUID token

    // Create a MySQL database connection
    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // Wrap the connection.query operation in a Promise
    const insertToken = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO tokens (username, token) VALUES (?, ?)",
          [username, token],
          function (err, results) {
            if (err) {
              console.log(err);
              reject(err);
            }
            if (results.affectedRows === 1) {
              resolve(token);
            } else {
              reject(new Error("Failed to generate token"));
            }
          }
        );
      });
    };

    // Await the Promise and handle the result
    await insertToken();

    connection.end();
    return token;
  } catch (error) {
    throw new Error("Error generating token: " + error);
  }
};
module.exports = generateAndStoreToken;
