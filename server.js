const express = require("express");
const SpotifyWeb = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWeb({
    redirectUri: "https://spotify-for-desktop.netlify.app/",
    clientId: "eb815cbe4f634fc4b5b2e4764971491b",
    clientSecret: "3539c40161804828817cb4cce873979a",
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then(function (data) {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch((err) => {
      res.sendStatus(400);
      console.log(err);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWeb({
    redirectUri: "https://spotify-for-desktop.netlify.app/",
    clientId: "eb815cbe4f634fc4b5b2e4764971491b",
    clientSecret: "3539c40161804828817cb4cce873979a",
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(process.env.PORT || 3001);
