import React from 'react'

export default function TrackSearchResult({track, chooseTrack}) {
    function handlePlay(){
        chooseTrack(track)
    }
  return (
    <div onClick={()=>handlePlay()}>
        <img src={track.albumUrl} alt={track}/>
        <div>
        {track.artist}
        <br/>
        {track.title}
       
        </div>
    </div>
  )
}
