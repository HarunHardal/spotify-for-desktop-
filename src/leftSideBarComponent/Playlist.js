import React, { useState } from "react";
import "./playlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export default function Playlist({
  playlistDetail,
  playlistTrack,
  chooseTrack,
  chooseTrackInfo,
  setArtistId,
  setArtist,
  setCheckPlaylist,
  setHome,
}) {
  function ms2minute(ms) {
    var minute = Math.floor(ms / 60000);
    var second = ((ms % 60000) / 1000).toFixed(0);
    return `${minute}:${(second < 10 ? "0" : "") + second}`;
  }

  function msToTime() {
    const full = playlistTrack?.map((e) => e.track?.duration_ms)
      .reduce((e, i) => e + i, 0);
    var hours = Math.floor((full / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((full / (1000 * 60)) % 60);

    return hours + " hr " + minutes + "min";
  }
  /* eğer center kapandıysa id değerini boş döndür */

  function html2Text(elem) {
    var template = document.createElement("div");
    template.innerHTML = elem;

    return template.textContent || template.innerHTML || "";
  }
  const [goArtist, setGoArtist] = useState(false);
  return (
    <>
      <div className="playlist-detail">
        <img
          className="playlist-image"
          src={playlistDetail?.images[0]?.url}
          alt={playlistDetail?.name}
        ></img>
        <div className="playlist-info-wrapper">
          <p className="playlist-time">
            {playlistDetail?.public ? "Public Playlist" : null}
          </p>
          <p className="playlist-title" onClick={()=>{
            setHome(true);
            setCheckPlaylist(false)
            }}>
            {playlistDetail?.name}
            <FontAwesomeIcon icon={faArrowLeft} className={ "slide-arrow-left arrow-ani" }/>
            </p>
          <p className="playlist-description">
            {html2Text(playlistDetail?.description)}
          </p>
          <p className="playlist-time">{isNaN(msToTime())?null:msToTime()}</p>
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
          {playlistTrack?.map((e, i) => (
            <tr
              key={i}
              onClick={() => {
                if (!goArtist) {
                  chooseTrack(e.track);
                  chooseTrackInfo(e.track);
                } else {
                  setArtistId(e.track.artists[0]?.id);
                  setArtist(true);
                  setCheckPlaylist(false);
                }
              }}
              className="playlist-tr"
            >
              <td>{i + 1}</td>
              <td className="album-artis-name">
                <div>
                  <img
                    src={e.track?.album?.images[2]?.url}
                    alt={e.track?.album?.name}
                  ></img>
                </div>
                <div className="names">
                  <div>{e.track?.name}</div>
                  <div
                    className="artist-name-container"
                    onMouseEnter={() => setGoArtist(true)}
                    onMouseLeave={() => setGoArtist(false)}
                  >
                    {e.track?.artists[0]?.name} 
                  </div>
                </div>
              </td>
              <td>{e.track?.album.name}</td>
              <td> {ms2minute(e.track?.duration_ms)} </td>
            </tr>
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </>
  );
}
