import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import Auth from "../authHook/Auth";
import MusicPlayer from "../player/MusicPlayer";
import Player from "../playerComponent/Player";
import LeftSideBar from "../leftSideBarComponent/LeftSideBar";

const spotifyApi = new SpotifyWebApi();

export default function Dashboard({ code }) {
  const accessToken = Auth(code);
  const [play, setPlay] = useState();
  const [volume1, setVolume] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState();
  const [playInfo, setPlayInfo] = useState(true);
  const [background, setBackground] = useState("");
  const [playlist, setPlaylist] = useState();
  const [playlistID, getPlaylistID] = useState("");
  const [playlistTrack, setPlaylistTracks] = useState();
  const [ani, setAni] = useState();
  const [artistName, setArtistName] = useState("");
  const [trackName, setTrackName] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [playlistArray, setPlaylistArray] = useState([]);

  /*
  SEEK POSİTİON
  */

  function seekPos(x) {
    if (!x) return;
    spotifyApi.seek(Math.round(x));
  }

  /* SET ACCESS TOKEN */

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  /*CHOOSE TRACK*/

  function chooseTrack(track) {
    setPlay(track);
    setAni(true);
    setTimeout(() => {
      setAni(false);
    }, 1000);
    clearTimeout();
  }

    /* PLAY PAUSE */

    function handlePlayPause() {
      setPlayInfo(!playInfo);
      if (playInfo) {
        spotifyApi.pause();
      } else {
        spotifyApi.play();
      }
    }

  /* Next Track */
  function next() {
    if (!playlistArray) return null
    if(playlistArray===1) return null
    playlistArray?.items.map((e, i) => {
    if(e.track){
      if (e.track.uri === play.uri) {
        if (i === playlistArray.items.length - 1) {
          setPlay(playlistArray.items[0].track);
        } else {
          setPlay(playlistArray.items[i + 1].track);
        }
      }
    }else{
      if (e.uri === play.uri) {
        if (i === playlistArray.items.length - 1) {
          setPlay(playlistArray.items[0]);
        } else {
          setPlay(playlistArray.items[i + 1]);
        }
      }
    }
    });
    setTimeout(() => {
      setAni(true);
      setTimeout(() => {
        setAni(false);
      }, 1000);
    }, 100);
  }
  /* PREV FUNCTION */
  function prev() {
    if (!playlistArray) return;
   
    playlistArray?.items.map((e, i) => {
      if(e.track){
        if (e.track.uri === play.uri) {
          if (i === 0) {
            setPlay(
              playlistArray.items[playlistArray.items.length - 1]
                .track
            );
          } else {
            setPlay(playlistArray.items[i - 1].track);
          }
        }
      }else{
        if (e.uri === play.uri) {
          if (i === 0) {
            setPlay(
              playlistArray.items[playlistArray.items.length - 1]);
          } else {
            setPlay(playlistArray.items[i - 1]);
          }
        }
      }
   
    });
    setTimeout(() => {
      setAni(true);
      setTimeout(() => {
        setAni(false);
      }, 1000);
    }, 500);
  }

  /*Set Current PlaybackState*/
  function getCurrentPlayback() {
    spotifyApi.getMyCurrentPlaybackState().then(function (data) {
      // Output items
      if (data.body && data.body.is_playing) {
        setArtistName(data.body.item.artists[0].name);
        setTrackName(data.body.item.name);
        setRecentlyPlayed(data.body.item.album.images[0]);
        spotifyApi
          .getArtist(data.body.item.artists[0].id)
          .then(function (data) {
            setBackground(data.body.images[0]);
          });
      }
    });
  }

  /*Playlist Func */

  function getPlaylistId(id) {
    getPlaylistID(id);
  }

  /* CHOOSE TRACK INFO */
  function chooseTrackInfo(e) {
    setArtistName(e.artists[0].name);
    setTrackName(e.name);
    setRecentlyPlayed(e.album.images[0]);
    spotifyApi.getArtist(e.artists[0].id).then(function (data) {
      setBackground(data.body.images[0]);
    });
  }

  /* VOLUME FUNCTION */

  function volumeFunc(volume) {
    setVolume(volume);
  }

  /* SET VOLUME */

  useEffect(() => {
    if (!volume1) return;
    spotifyApi.setVolume(volume1);
  }, [volume1]);

    /* NEW RELEASES */
    const [featuredPlaylists, setFeaturedPlaylists] = useState();

  /* TO OPEN THE PAGE*/
  //In order for the data to arrive quickly when the page is first opened

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getMyRecentlyPlayedTracks().then((data) => {
      setPlay(data.body.items[0].track);
      setRecentlyPlayed(data.body.items[0].track.album.images[0]);
      setArtistName(data.body.items[0].track.artists[0].name);
      setTrackName(data.body.items[0].track.name);
      spotifyApi
        .getArtist(data.body.items[0].track.artists[0].id)
        .then(function (data) {
          setBackground(data.body.images[0]);
        });
    });
    spotifyApi.getMe().then((data) => {
      spotifyApi.getUserPlaylists(data.body.id).then(
        function (data) {
          setPlaylist(data.body.items);
        },
        function (err) {
          console.log(err);
        }
      );
    });

  
    spotifyApi.getFeaturedPlaylists().then(function (data) {
      setFeaturedPlaylists(data.body);
    });
  }, [accessToken]);

  /* SET PLAYLİST */

  useEffect(() => {
    if (!playlistID) return;
    spotifyApi.getPlaylist(playlistID).then(
      function (data) {
        setPlaylistArray(data.body.tracks);
        setPlaylistTracks(data.body.tracks.items);
      },
      function (err) {
        console.log(err);
      }
    );
  }, [playlistID]);

  /* SEARCH */



  return (
    <div style={{ maxHeight: "100vh" }}>
      <LeftSideBar
        playlist={playlist}
        getPlaylistId={getPlaylistId}
        playlistTrack={playlistTrack}
        chooseTrack={chooseTrack}
        chooseTrackInfo={chooseTrackInfo}
        playlistArray={playlistArray}
        featuredPlaylists={featuredPlaylists}
        setCategory={spotifyApi}
        setPlaylistTracks={setPlaylistTracks}
        setPlaylistArray={setPlaylistArray}
      />
      <div>
        <MusicPlayer
          recentlyPlayed={recentlyPlayed}
          volumeFunc={volumeFunc}
          handlePlayPause={handlePlayPause}
          background={background}
          artistName={artistName}
          trackName={trackName}
          ani={ani}
          seekPos={seekPos}
          isPlaying={isPlaying}
          next={next}
          prev={prev}
          spotifyApi={spotifyApi}
          playlistArray={playlistArray}
        />
      </div>
      {/* Player */}
      <div
        style={{
          width: "100%",
          height: " 50px",
          position: "absolute",
          zIndex: "999",
          top: "0",
          display: "none",
        }}
      >
        <Player
          accessToken={accessToken}
          track={play?.uri}
          setIsPlaying={setIsPlaying}
          getCurrentPlayback={getCurrentPlayback}
        />
      </div>
    </div>
  );
}
