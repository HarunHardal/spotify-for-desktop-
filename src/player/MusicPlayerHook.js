import  { useEffect, useState } from 'react'

export default function MusicPlayerHook(spotifyApi,isPlaying) {
    const [progress, setProgress] = useState()
    useEffect(()=>{
        
        const timer = setInterval(()=>{
            if(!isPlaying) return null
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
