import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faHeart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function LikedSongs({
  setLikedSongs,
  chooseTrack,
  chooseTrackInfo,
  setPlaylistArray,
  setHome,
  setLikedSong,
}) {
  const [tracks, setTracks] = useState([]);
  useEffect(() => {
    setLikedSongs.getMySavedTracks({ limit: 50, offset: 2 }).then(
      (data) => {
        setTracks(data.body);
      },
      (err) => console.log(err)
    );
  }, []);
  function ms2minute(ms) {
    var minute = Math.floor(ms / 60000);
    var second = ((ms % 60000) / 1000).toFixed(0);
    return `${minute}:${(second < 10 ? "0" : "") + second}`;
  }

  return (
    <>
      <div className="playlist-detail">
        <div className="liked-songs-bg">
          <FontAwesomeIcon icon={faHeart} className="heart" />
        </div>
        <div className="playlist-info-wrapper liked-songs-info-wrapper">
          <p className="playlist-title" onClick={()=>{
            setHome(true)
            setLikedSong(false)
          }}>
            Liked Songs
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={"slide-arrow-left arrow-ani"}
            />
          </p>
        </div>
      </div>
      <table style={{ border: "none" }} cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>Album</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {tracks.items?.map((e, i) => (
            <tr
              key={i}
              onClick={() => {
                chooseTrack(e.track);
                chooseTrackInfo(e.track);
                setPlaylistArray(tracks);
              }}
              className="playlist-tr"
            >
              <td>{i + 1}</td>
              <td className="album-artis-name">
                <div>
                  <img
                    src={e.track.album.images[2]?.url}
                    alt={e.track.album?.name}
                  ></img>
                </div>
                <div className="names">
                  <div>{e.track?.name}</div>
                  <div className="artist-name-container">
                    {e.track.artists[0]?.name}
                  </div>
                </div>
              </td>
              <td>{e.track.album.name}</td>
              <td> {ms2minute(e.track.duration_ms)} </td>
            </tr>
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </>
  );
}
