import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "../../node_modules/swiper/swiper.min.css";
import "./search.css";

export default function Search({
  search,
  chooseTrack,
  setArtistId,
  setArtist,
  setSearch,
  setCheckPlaylist,
  getPlaylistId,
  setPlaylistDetail,
  playlistTrack,
}) {
  const [searchKeys, setSearchKeys] = useState("");
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [playlistResults, setPlaylistResults] = useState([]);
  const [trackResultsLimit,setTrackResultsLimit] = useState(false)
  useEffect(() => {
    if (!searchKeys)
      return () => {
        setArtistResults([]);
        setTrackResults([]);
        setPlaylistResults([])
      };

    search.searchArtists(searchKeys).then((data) => {
      setArtistResults(data.body.artists.items);
    });

    search.searchTracks(searchKeys).then(
      (data) => {
        setTrackResults(data.body.tracks.items);
      },
      (err) => console.log(err)
    );
    search.searchPlaylists(searchKeys).then((data) => {
      setPlaylistResults(data.body.playlists.items);
    });
  }, [searchKeys, setSearch]);
  const [control, setCotrol] = useState(false);
  useEffect(() => {
    if (control) {
      chooseTrack(playlistTrack[0].track);
      setCotrol(false);
    }
  }, [control, playlistTrack, chooseTrack]);
  function ms2minute(ms) {
    var minute = Math.floor(ms / 60000);
    var second = ((ms % 60000) / 1000).toFixed(0);
    return `${minute}:${(second < 10 ? "0" : "") + second}`;
  }
  return (
    <div className="search-wrapper">
      <div className="search-box-wrapper">
        <input
          type="search"
          placeholder="Search"
          className="search-box"
          onChange={(e) => {
            setSearchKeys(e.target.value);
          }}
          autoFocus
        />
      </div>
      <div className="results-wrapper">
        {artistResults?.length > 1 ? (
          <div className="artists-results">
            <h2 className="search-title"> Artists</h2>
            <Swiper spaceBetween={10} slidesPerView={4} className="bg">
              {artistResults?.map((e, i) => (
                <SwiperSlide
                  key={i}
                  onClick={() => {
                    setArtistId(e.id);
                    setArtist(true);
                    setSearch(false);
                  }}
                >
                  <div className="card artist-background">
                    <div className="playlist-card-image artist-image">
                      <img src={e.images[0]?.url} alt={e.name}></img>
                    </div>
                    <p className="card-name">{e.name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : null}
        {trackResults?.slice(0, trackResultsLimit?20:5).length > 1 ? (
          <div className="track-results">
            <h2 className="search-title"> Songs</h2>
            <table style={{ border: "none" }} cellPadding="0" cellSpacing="0">
              <tbody>
                {trackResults?.slice(0, trackResultsLimit?20:5).map((e, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      chooseTrack(e);
                    }}
                    className="playlist-tr"
                  >
                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                    <td>
                      <img
                        className="topfive-img"
                        src={e.album.images[0].url}
                        alt={""}
                      ></img>
                    </td>
                    <td>
                      <div className="names">{e.name}</div>
                    </td>
                    <td> {ms2minute(e.duration_ms)} </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="add-more" onClick={()=>setTrackResultsLimit(!trackResultsLimit)}>Add More</div>
          </div>
        ) : null}
        {playlistResults?.length > 1 ? (
          <div>
            <h2 className="search-title"> Playlist</h2>
            <Swiper spaceBetween={20} slidesPerView={4}>
              {playlistResults?.map((e, i) => (
                <SwiperSlide key={i}>
                  <div className="card">
                    <div className="playlist-card-image">
                      <img src={e.images[0]?.url} alt={e.name}></img>

                      <FontAwesomeIcon
                        className="playlist-card-play-button"
                        icon={faCirclePlay}
                        onClick={() => {
                          getPlaylistId(e.id);
                          setTimeout(() => {
                            setCotrol(true);
                          }, 500);
                        }}
                      />
                    </div>
                    <p
                      className="card-name"
                      onClick={() => {
                        setCheckPlaylist(true);
                        setSearch(false);
                        getPlaylistId(e.id);
                        setPlaylistDetail(e);
                      }}
                    >
                      {e.name}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : null}
      </div>
    </div>
  );
}
