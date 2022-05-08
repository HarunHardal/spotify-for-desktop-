import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, track,setIsPlaying,getCurrentPlayback }) {

const [play, setPlay] = useState(false)
const [a , _a] = useState(false)

useEffect(()=>{
  setPlay(true)
},[track])

useEffect(()=>{
  if(a){
    setTimeout(()=>{
      getCurrentPlayback()
    },100)
    _a(false)
  }

},[a, getCurrentPlayback])

  if (!accessToken) return null;
  return (
    <div onClick={()=>console.log(track)}>
      <SpotifyPlayer
        token={accessToken}
        callback={state=>{
          if(!state.isPlaying) {
            setPlay(false)
            setIsPlaying(false)
            _a(false)
          }else{
            setIsPlaying(true)
            _a(true)
          }
        }}
        play={play}
        uris={track ? [track]: []}
      />
    </div>
  );
}