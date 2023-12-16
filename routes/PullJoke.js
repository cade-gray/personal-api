/*
    This file is used to pull a joke from the dad-jokes API
    and return it to the client.

    The dad-jokes API is a free API that returns a random joke
    from a list of jokes. The API is hosted on RapidAPI and
    can be found here: https://rapidapi.com/KegenGuyll/api/dad-jokes

    TODOS: 
    - Update password to something more secure
    - Add error handling for when the API is down or returns an error

*/
const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post("/", async (req, res) => {
  const url = "https://dad-jokes.p.rapidapi.com/random/joke";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "34c17d32bemsh462a45c60494d04p15cbf1jsn9e9d513c698f",
      "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
    },
  };
  if (req.body.password !== "password") {
    res.json({
      success: false,
      messsage: "Denied",
    });
  } else {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      if (result.success === false) {
        res.json({
          success: false,
        });
      } else {
        const setup = result.body[0].setup;
        const punchline = result.body[0].punchline;
        res.json({
          setup: setup,
          punchline: punchline,
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
      });
    }
  }
});
module.exports = router;
