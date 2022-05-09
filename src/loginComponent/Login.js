import React from "react";
import './login.css'
const AUTH =
  "https://accounts.spotify.com/authorize?client_id=eb815cbe4f634fc4b5b2e4764971491b&response_type=code&redirect_uri=https://spotify-for-desktop.netlify.app&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-follow-read";

export default function Login() {
  return( 
  <div className="login-component">
      <button type="button" className="login-btn"><a href={AUTH}>LOGIN WITH SPOTIFY</a></button>
  </div>);
}
