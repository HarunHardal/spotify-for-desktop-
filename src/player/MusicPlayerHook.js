import  { useEffect, useState } from 'react'
import SpotifyWebApi from "spotify-web-api-node";
const spotifyApi = new SpotifyWebApi({
    clientId: "eb815cbe4f634fc4b5b2e4764971491b",
  });
export default function MusicPlayerHook() {
    const [progress, setProgress] = useState()
    useEffect(()=>{
        
        const timer = setInterval(()=>{
            spotifyApi.getMyCurrentPlaybackState().then((data)=>{
                if(data.body && data.body.is_playing){
                    setProgress(data.body.progress_ms)
                }
            })
        },1000)
        return ()=> clearInterval(timer)
    },[])
 
    return progress
}
