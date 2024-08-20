require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();
const port = 3030;
const cors = require("cors");
const bodyParser = require("body-parser");
const Login = require("./routes/Login");
const Logout = require("./routes/Logout");
const Wedding = require("./routes/Wedding");
const PullJoke = require("./routes/PullJoke");
const Joke = require("./routes/Joke");
const Projects = require("./routes/Projects");
app.use(cors());
app.use(helmet());
app.disable("x-powered-by");
app.use(express.json());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/login", Login);
app.use("/logout", Logout);
app.use("/wedding", Wedding);
app.use("/pulljoke", PullJoke);
app.use("/joke", Joke);
app.use("/projects", Projects);

// Post rsvp data to wedding database
// app.post("/wedding/guest", (req, res) => {
//   const formData = req.body;
//   console.log("Received data from the client:", formData);
//   const connection = mysql.createConnection(process.env.DATABASE_URL);
//   connection.query(
//     "INSERT INTO Guests (first_name, last_name, email, attending_yn, diet_rest, plus_one_yn, plus_one_name, children_yn, child_count) values (?,?,?,?,?,?,?,?,?)",
//     [
//       formData.firstName,
//       formData.lastName,
//       formData.email,
//       formData.attendingYN,
//       formData.dietRest,
//       formData.plusOneYN,
//       formData.plusOneName,
//       formData.childrenYN,
//       formData.childCount,
//     ],
//     function (err, results) {
//       if (err) {
//         console.log(err);
//         res.json(err);
//       }
//       res.json(results);
//     }
//   );
//   connection.end();
// });

app.listen(port, () => {
  console.log(`API Server listening at http://localhost:${port}`);
});

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Dear Cade or Hacker, this route does not exist.");
});

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send(
      "Something is a little screwed up internally, did you break something?"
    );
});
