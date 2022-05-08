import React, { useEffect, useState } from "react";

export default function RightSideBar({ accessToken ,spotifyApi }) {
  const [playList, setPlayList] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.searchTracks('Love').then((data)=>{
      console.log(data)
      setPlayList(
      data.body.tracks.items.map(e=>{
       return e.name
      }
        
      )
      )
    })
  }, [accessToken, spotifyApi]);



  if (!accessToken) return null;
  return <div>{console.log(playList)}</div>;
}
