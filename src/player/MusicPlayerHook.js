import  { useEffect, useState } from 'react'

export default function MusicPlayerHook(spotifyApi,isPlaying) {
    const [progress, setProgress] = useState()
    useEffect(()=>{
        if(!isPlaying) return null
        const timer = setInterval(()=>{
            
            spotifyApi.getMyCurrentPlaybackState().then((data)=>{
                if(data.body && data.body.is_playing){
                    setProgress(data.body.progress_ms)
                }
            })
        },1100)
        return ()=> clearInterval(timer)
    },[])
 
    return progress
}
