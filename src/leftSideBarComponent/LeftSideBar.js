import React, { useState } from "react";
import "./leftSideBar.css";
import Home from "./Home";
import Playlist from "./Playlist";
import Artist from "./Artist";
import LikedSongs from "./LikedSongs";
import Search from "./Search";

export default function LeftSideBar({
  playlist,
  getPlaylistId,
  playlistTrack,
  chooseTrack,
  chooseTrackInfo,
  featuredPlaylists,
  setCategory,
  playlistArray,
  setPlaylistTracks,
  setPlaylistArray,
}) {
  const [rightSide, setRightSide] = useState(true);
  const [centerActive, setCenterActive] = useState(false);
  const [centerInfo, setCenterInfo] = useState("");
  const [playlistDetail, setPlaylistDetail] = useState();
  const [checkPlaylist, setCheckPlaylist] = useState(false);
  const [home, setHome] = useState(false);
  const [artist, setArtist] = useState(false);
  const [likedSongs, setLikedSongs] = useState(false);
  const [search, setSearch] = useState(false);
  const [artistId, setArtistId] = useState();
  const open = require("../images/angle-open.png");
  const logo = require("../images/logo2.png");
  function menuIcon() {
    if (centerActive) {
      return "arrow-icon menu-center-active";
    } else if (!rightSide) {
      return "arrow-icon menu-active";
    }
    return "arrow-icon";
  }

  const [click, setClick] = useState(false);
  function handleClick() {
    setClick(!click);
  }

  function handleCenter(info) {
    if (info === centerInfo) {
      setCenterActive(!centerActive);
    } else {
      setCenterActive(true);
    }
  }

  return (
    <>
      <div
        className={
          rightSide
            ? "right-side-bar-component"
            : "right-side-bar-component right-side-bar-component-active"
        }
      >
        <div className="logo-wrapper">
          <img className="logo" src={logo} alt="logo" />
        </div>
        <ul>
          <li
            onClick={() => {
              handleCenter("home");
              setCenterInfo("home");
              setHome(true);
              setCheckPlaylist(false);
              setArtist(false);
              setLikedSongs(false);
              setSearch(false);
            }}
          >
            HOME
          </li>
          <li
            onClick={() => {
              handleCenter("search");
              setCenterInfo("search");
              setArtist(false);
              setHome(false);
              setCheckPlaylist(false);
              setLikedSongs(false);
              setSearch(true);
            }}
          >
            SEARCH
          </li>
          <li
            onClick={() => {
              handleCenter("liked song");
              setCenterInfo("liked song");
              setArtist(false);
              setHome(false);
              setCheckPlaylist(false);
              setLikedSongs(true);
              setSearch(false);
            }}
          >
            LIKED SONGS
          </li>
          <li>PLAY LİSTS</li>

          <div className="playlists">
            <ul className="">
              {playlist.length < 1 ? (
                <ul>You don't have any playlists </ul>
              ) : (
                playlist?.map((e) => (
                  <li
                    className="playlist-name"
                    key={e.name}
                    onClick={() => {
                      handleCenter(e.name);
                      setCenterInfo(e.name);
                      getPlaylistId(e.id);
                      setPlaylistDetail(e);
                      setCheckPlaylist(true);
                      setHome(false);
                      setArtist(false);
                      setLikedSongs(false);
                      setSearch(false);
                    }}
                  >
                    {e.name}
                  </li>
                ))
              )}
            </ul>
          </div>
        </ul>
      </div>
      <div className={menuIcon()} onClick={() => handleClick()}>
        <img
          onClick={() => {
            setRightSide(!rightSide);
            if (centerActive) return setCenterActive(false);
          }}
          src={open}
          alt={open}
          className={click ? "left-bar left-bar-open" : "left-bar"}
        />
      </div>
      <div className={!centerActive ? "center" : "center center-active"}>
        {checkPlaylist ? (
          <Playlist
            playlistDetail={playlistDetail}
            playlistTrack={playlistTrack}
            chooseTrack={chooseTrack}
            chooseTrackInfo={chooseTrackInfo}
            setArtistId={setArtistId}
            setArtist={setArtist}
            setCheckPlaylist={setCheckPlaylist}
            setHome={setHome}
          />
        ) : null}
        {home ? (
          <>
            <Home
              getPlaylistId={getPlaylistId}
              featuredPlaylists={featuredPlaylists}
              setCategory={setCategory}
              setCheckPlaylist={setCheckPlaylist}
              setHome={setHome}
              setArtist={setArtist}
              setArtistId={setArtistId}
              setPlaylistDetail={setPlaylistDetail}
              playlistDetail={playlistDetail}
              playlistTrack={playlistTrack}
              chooseTrack={chooseTrack}
              chooseTrackInfo={chooseTrackInfo}
              playlistArray={playlistArray}
            />
          </>
        ) : null}
        {search ? (
          <Search
            search={setCategory}
            chooseTrack={chooseTrack}
            setArtistId={setArtistId}
            setArtist={setArtist}
            setSearch={setSearch}
            setCheckPlaylist={setCheckPlaylist}
            getPlaylistId={getPlaylistId}
            setPlaylistDetail={setPlaylistDetail}
            playlistTrack={playlistTrack}
          />
        ) : null}
        {artist ? (
          <Artist
            setArtist={setArtist}
            artistId={artistId}
            sendArtistInfo={setCategory}
            getPlaylistId={getPlaylistId}
            setCheckPlaylist={setCheckPlaylist}
            setHome={setHome}
            setPlaylistDetail={setPlaylistDetail}
            chooseTrack={chooseTrack}
            chooseTrackInfo={chooseTrackInfo}
            playlistTrack={playlistTrack}
            setPlaylistTracks={setPlaylistTracks}
            setPlaylistArray={setPlaylistArray}
          />
        ) : null}
        {likedSongs ? (
          <LikedSongs
            setLikedSongs={setCategory}
            chooseTrack={chooseTrack}
            chooseTrackInfo={chooseTrackInfo}
            setPlaylistArray={setPlaylistArray}
            setLikedSong={setLikedSongs}
            setHome={setHome}
          />
        ) : null}
      </div>
    </>
  );
}
