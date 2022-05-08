import { useEffect, useState } from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "eb815cbe4f634fc4b5b2e4764971491b",
});

export default function Auth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExprisInToken] = useState();

  useEffect(() => {
    axios
      .post("https://spotify-for-desktop.netlify.app/", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExprisInToken(res.data.expiresIn);
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const timeOut = setInterval(() => {
      axios
        .post("https://spotify-for-desktop.netlify.app//refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExprisInToken(res.data.expiresIn);
        })
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);
    return ()=> clearInterval(timeOut)
  }, [refreshToken, expiresIn]);

  spotifyApi.setAccessToken(accessToken)
  return accessToken;
}
