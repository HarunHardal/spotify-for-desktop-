import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../node_modules/swiper/swiper.min.css";
import "./artist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Artist({
  sendArtistInfo,
  artistId,
  getPlaylistId,
  chooseTrack,
  setPlaylistArray,
}) {
  const [artistName, setArtistName] = useState("");
  const [artisImage, setArtistImage] = useState("");
  const [topFive, setTopFive] = useState([]);
  const [topTracks, setTopTracks]= useState()
  const [artisAlbums, setArtistAlbums] = useState([]);
  const [artisSingle, setArtistSingle] = useState([]);


  //Album Tracks
  const [handleAlbum, setHandleAlbum] = useState(false);
  const [handleSingle, setHandleSingle]=useState(false)

  useEffect(() => {
    sendArtistInfo.getArtist(artistId).then(
      (data) => {
        setArtistName(data?.body.name);
        setArtistImage(data?.body.images[0]);
      }
    );
    sendArtistInfo.getArtistTopTracks(artistId, "US").then(
      (data) => {
        setTopTracks({items:data.body.tracks})
        setTopFive(data.body.tracks.slice(0, 5));
      }
    );
    sendArtistInfo.getArtistAlbums(artistId).then(
      (data) => {
        setArtistAlbums(
          data.body.items.filter((e, i, a) => {
            return (
              e.album_group === "album" &&
              a.findIndex((v2) => v2.name === e.name) === i
            );
          })
        );
        setArtistSingle(
          data.body.items.filter((e, i, a) => {
            return (
              e.album_group === "single" &&
              a.findIndex((v2) => v2.name === e.name) === i
            );
          })
        );
      }
    );
  }, [artistId]);

  const [albumName, setAlbumName] = useState();
  const [albumImg, setAlbumImg] = useState();
  const [singleName,setSingleName] = useState();
  const [singleImg, setSingleImg] = useState();
  const [tracks, setTracks] = useState([]);


  function showAlbumTracks(albumId){
    if (!albumId) return null;
    sendArtistInfo.getAlbumTracks(albumId).then(function (data) {
        setPlaylistArray(data.body);
        setTracks(data.body);
    });
  }

  function setAlbumTracks(albumId) {
    if (!albumId) return null;
    sendArtistInfo.getAlbumTracks(albumId).then(function (data) {
     
        chooseTrack(data.body.items[0]);
        setPlaylistArray(data.body);
        setTracks(data.body.items);
      
    });
  }

  function ms2minute(ms) {
    var minute = Math.floor(ms / 60000);
    var second = ((ms % 60000) / 1000).toFixed(0);
    return `${minute}:${(second < 10 ? "0" : "") + second}`;
  }

  return (
    <div className="artist-wrapper">
      <div className="artist-image-wrapper">
        <div className="parent">
          <img src={artisImage.url} alt={artistName} className="artis-img" />
        </div>
      </div>
      <div className="artist-info-container">
        <p className="artist-name1">{artistName}</p>
      </div>
      <div className="tracks-albums-container">
        <p className="artist-title">Top Songs</p>
        <table style={{ border: "none" }} cellPadding="0" cellSpacing="0">
          <tbody>
            {topFive.map((e, i) => (
              <tr
                key={i}
                onClick={() => {
                  chooseTrack(e);
                  setPlaylistArray(topTracks)
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
        {artisAlbums.length > 0 ? (
          <div className="row">
            <p className="artist-title">Album</p>
            <Swiper
              spaceBetween={20}
              slidesPerView={handleAlbum ? 1 : 4}
              loop={false}
              allowSlideNext={handleAlbum ? false : true}
              allowSlidePrev={handleAlbum ? false : true}
              allowTouchMove={handleAlbum ? false : true}
            >
              {artisAlbums?.map((e, i) => (
                <SwiperSlide key={i}>
                  <div className={handleAlbum ? "card2" : "card"}>
                    <div className="playlist-card-image">
                      <img
                        alt={i}
                        src={handleAlbum ? albumImg : e.images[0].url}
                      />
                      <FontAwesomeIcon
                        className="playlist-card-play-button"
                        icon={faCirclePlay}
                        onClick={() => {
                          setAlbumTracks(e.id);
                        }}
                      />
                    </div>

                    <p
                      className={handleAlbum ? "display-none" : "card-name"}
                      onClick={() => {
                        setHandleAlbum(!handleAlbum);
                        showAlbumTracks(e.id)
                        setAlbumName(e.name);
                        setAlbumImg(e.images[0].url);
                      }}
                    >
                      {e.name}
                    </p>
                    <p
                      onClick={() => {
                        setHandleAlbum(!handleAlbum);
                      }}
                      className={handleAlbum ? "album-title" : "display-none"}
                     
                    >
                      {albumName}
                      <FontAwesomeIcon icon={faArrowLeft} className={
                      handleAlbum
                        ? "slide-arrow-left arrow-ani"
                        : "slide-arrow-left"
                    }/>
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : null}
        {handleAlbum ? (
          <div className="tracks-wrapper">
            <table style={{ border: "none" }} cellPadding="0" cellSpacing="0">
              <thead></thead>
              <tbody>
                {tracks.items?.map((e, i) => (
                  <tr key={i} onClick={()=>{
                    chooseTrack(e)
                    setPlaylistArray(tracks);
                    }}
                    className="playlist-tr"
                    >
                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                    <td>
                      <div className="names">
                        {e.name}
                        
                        </div>
                    </td>
                    <td> {ms2minute(e.duration_ms)} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {artisSingle.length > 0 ? (
          <>
            <p className="artist-title">Single</p>
            <Swiper 
             slidesPerView={handleSingle ? 1 : 4}
             loop={false}
             allowSlideNext={handleSingle ? false : true}
             allowSlidePrev={handleSingle ? false : true}
             allowTouchMove={handleSingle ? false : true}
            >
              {artisSingle?.map((e, i) => (
                <SwiperSlide key={i}>
                  <div className={handleSingle ? "card2" : "card"}>
                    <div className="playlist-card-image">
                      <img
                        alt={i}
                        src={handleSingle?singleImg:e.images[0].url}
                        onClick={() => {
                          getPlaylistId(e.id);
                        }}
                      />
                      <FontAwesomeIcon
                        className="playlist-card-play-button"
                        icon={faCirclePlay}
                        onClick={() => {
                          setAlbumTracks(e.id);
                        }}
                      />
                    </div>

                    <p
                      className={handleSingle ? "display-none" : "card-name"}
                      onClick={() => {
                        setHandleSingle(!handleSingle);
                        showAlbumTracks(e.id);
                        setSingleName(e.name);
                        setSingleImg(e.images[0].url);
                      }}
                    >
                      {e.name}
                    </p>
                    <p
                      onClick={() => {
                        setHandleSingle(!handleSingle);
                      }}
                      className={handleSingle ? "album-title" : "display-none"}
                    >
                     {singleName}
                     <FontAwesomeIcon icon={faArrowLeft} className={
                      handleSingle
                        ? "slide-arrow-left arrow-ani"
                        : "slide-arrow-left"
                    }/>
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : null}
            {handleSingle ? (
          <div className="tracks-wrapper">
            <table style={{ border: "none" }} cellPadding="0" cellSpacing="0">
              <thead></thead>
              <tbody>
                {tracks.items?.map((e, i) => (
                  <tr key={i} onClick={()=>{
                    chooseTrack(e)
                    setPlaylistArray(tracks);
                    }}
                    className="playlist-tr"
                    >
                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                    <td>
                      <div className="names">{e.name}</div>
                    </td>
                    <td> {ms2minute(e.duration_ms)} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
