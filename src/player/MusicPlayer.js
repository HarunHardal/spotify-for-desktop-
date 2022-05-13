import React, { useEffect, useRef, useState } from "react";
import "./musicPlayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faVolumeOff,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

export default function MusicPlayer({
  recentlyPlayed,
  volumeFunc,
  handlePlayPause,
  background,
  artistName,
  trackName,
  ani,
  seekPos,
  isPlaying,
  next,
  prev,
  spotifyApi,
  playlistArray,
}) {
  const [image, setImage] = useState();
  const [counter, setCounter] = useState(1);
  const ref = useRef();
  const [state, setState] = useState({ artisname: "", trackname: "" });
  const stateRef = useRef(state);
  const [volume, setVolume] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState();
  const progressRef = useRef();
  const [progress, setProgress] = useState(0);
  const [duration1, setDuration] = useState(0);

  useEffect(() => {
    progressRef.current = setInterval(() => {
      spotifyApi.getMyCurrentPlaybackState().then(function (data) {
        if (data.body && data.body.is_playing) {
          setProgress(data.body.progress_ms);
          setDuration(data.body.item.duration_ms);
        }
      });
    }, 1000);
    return clearInterval(progressRef.current)
  }, []);

  useEffect(() => {
    setState({ artisname: artistName, trackname: trackName });
  }, [artistName, trackName]);

  useEffect(() => {
    if (stateRef.current !== state) {
      setCounter(1);
    }
  }, [state]);
  useEffect(() => {
    if (playlistArray.length === 0) {
      return null;
    } else {
      if (counter === 98 || counter > 98) {
        if (!isPlaying) {
          next();
          setCounter(2);
        }
      }
    }
  }, [counter, isPlaying, playlistArray]);

  useEffect(() => {
    const round = document.querySelector(".progress");
    const bounding = round.getBoundingClientRect();
    let positionX,
      positionY,
      centerX,
      centerY,
      mouseX,
      mouseY,
      adjacentSide,
      oppositeSide,
      currentRadial,
      getRadiansInDegrees,
      finalAngleInDegrees,
      seekSetting;

    if (isPlaying) {
      if (!duration1) return null;
      ref.current = setInterval(() => {
        // round.setAttribute(
        //   "stroke-dasharray",
        //   `${(counter / 100) * 825}, 2000`
        // );
        setCounter(counter + 1);
      }, duration1 / 100);

      return () => {
        clearInterval(ref.current);
      };
    }
    // if(isPlaying){
    //   if (counter === 99) {
    //     next();
    //     setCounter(2);
    //   }
    //}

    round.addEventListener(getMouseDown(), onMouseDown);
    document.addEventListener(getMouseUp(), onMouseUp);

    function onMouseDown() {
      document.addEventListener(getMouseMove(), onMouseMove);
    }

    function onMouseUp() {
      document.removeEventListener(getMouseMove(), onMouseMove);
    }

    function onMouseMove(event) {
      positionX = bounding.left;
      positionY = bounding.top;
      if (detectMobile() === "desktop") {
        mouseX = event.pageX; //get mouse's x global position
        mouseY = event.pageY; //get mouse's y global position
      } else {
        mouseX = event.touches[0].pageX; //get finger's x global position
        mouseY = event.touches[0].pageY; //get finger's y global position
      }
      centerX = bounding.width / 2 + positionX;
      centerY = bounding.height / 2 + positionY;

      adjacentSide = centerX - mouseX;
      oppositeSide = centerY - mouseY;

      currentRadial = Math.atan2(adjacentSide, oppositeSide);

      getRadiansInDegrees = (currentRadial * 180) / Math.PI;

      finalAngleInDegrees = -(getRadiansInDegrees - 135); /* result 270 deg*/

      if (finalAngleInDegrees >= 0 && finalAngleInDegrees <= 271) {
        seekSetting = Math.floor(
          finalAngleInDegrees / (270 / 100)
        ); /*270 to 100 result 0-100*/
        var a = (seekSetting / 100) * 825; /*270 825*/
        round.setAttribute("stroke-dasharray", `${a}, 2000`);
        setCounter(seekSetting);
      }
    }

    /*MOBİLE?*/
    function detectMobile() {
      var result = navigator.userAgent.match(
        /(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i
      );
      if (result !== null) {
        return "mobile";
      } else {
        return "desktop";
      }
    }
    function getMouseDown() {
      if (detectMobile() === "desktop") {
        return "mousedown";
      } else {
        return "touchstart";
      }
    }
    function getMouseUp() {
      if (detectMobile() === "desktop") {
        return "mouseup";
      } else {
        return "touchend";
      }
    }
    function getMouseMove() {
      if (detectMobile() === "desktop") {
        return "mousemove";
      } else {
        return "touchmove";
      }
    }

    /* Volume*/

    var volumePositionX,
      volumePositionY,
      volumeCenterX,
      volumeCenterY,
      volumeMouseX,
      volumeMouseY,
      volumeAdjacentSide,
      volumeOppositeSide,
      volumeCurrentRadial,
      volumeGetRadiansInDegrees,
      volumeFinalAngleInDegrees,
      volumeSetting,
      volumeBar = document.querySelector(".progress2"),
      bounding2 = volumeBar.getBoundingClientRect();

    volumeBar.addEventListener(getMouseDown2(), onMouseDown2);
    document.addEventListener(getMouseUp2(), onMouseUp2);

    function onMouseDown2() {
      document.addEventListener(getMouseMove2(), onMouseMove2);
    }
    function onMouseUp2() {
      document.removeEventListener(getMouseMove2(), onMouseMove2);
    }

    function onMouseMove2(event) {
      volumePositionX = bounding2.left;
      volumePositionY = bounding2.top;
      if (detectMobile() === "desktop") {
        volumeMouseX = event.pageX;
        volumeMouseY = event.pageY;
      } else {
        volumeMouseX = event.touches[0].pageX;
        volumeMouseY = event.touches[0].pageY;
      }
      volumeCenterX = bounding2.width / 2 + volumePositionX;
      volumeCenterY = bounding2.height / 2 + volumePositionY;

      volumeAdjacentSide = volumeCenterX - volumeMouseX;
      volumeOppositeSide = volumeCenterY - volumeMouseY;

      volumeCurrentRadial = Math.atan2(volumeAdjacentSide, -volumeOppositeSide);
      volumeGetRadiansInDegrees = (volumeCurrentRadial * 180) / Math.PI;
      volumeFinalAngleInDegrees = -(volumeGetRadiansInDegrees - 180); /*start*/

      if (271 >= volumeFinalAngleInDegrees && volumeFinalAngleInDegrees >= 90) {
        volumeSetting = Math.floor(
          (volumeFinalAngleInDegrees - 90) / (180 / 100)
        ); /*90*/
        var volumeStroke = (volumeSetting / 100) * 770; /* 1 */ /*660*/
        volumeBar.setAttribute("stroke-dasharray", `${volumeStroke}, 2000`);
        setVolumeLevel(volumeSetting);
      }
    }
    function getMouseDown2() {
      if (detectMobile() === "desktop") {
        return "mousedown";
      } else {
        return "touchstart";
      }
    }
    function getMouseUp2() {
      if (detectMobile() === "desktop") {
        return "mouseup";
      } else {
        return "touchend";
      }
    }
    function getMouseMove2() {
      if (detectMobile() === "desktop") {
        return "mousemove";
      } else {
        return "touchmove";
      }
    }
  }, [duration1, volumeFunc, counter, isPlaying, next]);

  useEffect(() => {
    if (!recentlyPlayed) return;
    setImage(recentlyPlayed);
  }, [recentlyPlayed]);

  function ms2minutes(ms) {
    var minute = Math.floor(ms / 60000);
    var second = ((ms % 60000) / 1000).toFixed(0);
    return `${minute}:${(second < 10 ? "0" : "") + second}`;
  }

  const [seekBar, setSeekBar] = useState(false);

  return (
    <div
      className="music-player-container"
      onMouseUp={() => {
        if (seekBar) {
          seekPos(counter * (duration1 / 100));
          setSeekBar(false);
        }
        if (volume) {
          volumeFunc(volumeLevel);
          setVolume(false);
        }
      }}
    >
      <img className="background" src={background?.url} alt="" />
      <div className="track-name-info">
        <div className="line"> </div>
        <div className="names">
          <div className={ani ? "artist-name animation" : "artist-name"}>
            {trackName}
          </div>
          <div className={ani ? "track-name animation" : "track-name"}>
            {artistName}
          </div>
        </div>
      </div>
      <svg id="circle">
        <circle
          r="175"
          cx="50%"
          cy="50%"
          stroke="#f1f0ea"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="825, 825"
        ></circle>
        <linearGradient id="linearColors">
          <stop offset="0%" stopColor="#00fffc"></stop>
          <stop offset="100%" stopColor="#fa45fc"></stop>
        </linearGradient>
        <circle
          className="progress"
          r="175"
          cx="50%"
          cy="50%"
          stroke="url(#linearColors)"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(counter / 100) * 825}, 2000`}
          onMouseDown={() => {
            setSeekBar(true);
          }}
        ></circle>
      </svg>
      <svg id="circle2">
        <circle
          r="245"
          cx="50%"
          cy="50%"
          stroke="#f1f0ea"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="770, 770"
        ></circle>
        <linearGradient id="linearColors2">
          <stop offset="0%" stopColor="#833ab4"></stop>
          <stop offset="50%" stopColor="#fd1d1d"></stop>
          <stop offset="100%" stopColor="#fcb045"></stop>
        </linearGradient>
        <circle
          className="progress2"
          r="245"
          cx="50%"
          cy="50%"
          stroke="url(#linearColors2)"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="770, 2000"
          onMouseDown={() => {
            setVolume(true);
          }}
        ></circle>
      </svg>
      <div className="volume-icons-container">
        <FontAwesomeIcon className="volume-icon" icon={faVolumeOff} />
        <FontAwesomeIcon className="volume-icon" icon={faVolumeHigh} />
      </div>
      <div className="media-controls">
        <p className="">{ms2minutes(progress)}</p>
        <FontAwesomeIcon
          className="media-buttons padding"
          icon={faBackwardStep}
          style={playlistArray.length<2?{pointerEvents:'none'}:{pointerEvents:'visible'}}
          onClick={() => prev()}
        />
        {isPlaying ? (
          <FontAwesomeIcon
            onClick={() => handlePlayPause()}
            icon={faPause}
            className="media-buttons padding"
            
          />
        ) : (
          <FontAwesomeIcon
            onClick={() => handlePlayPause()}
            icon={faPlay}
            className="media-buttons"
            style={{ padding: "10px 15px" }}
          />
        )}
        <FontAwesomeIcon
          icon={faForwardStep}
          className="media-buttons padding"
          style={playlistArray.length<2?{pointerEvents:'none'}:{pointerEvents:'visible'}}
          onClick={() => {
            next();
            setCounter(0);
          }}
    
        />
        <p className="">{ms2minutes(duration1)}</p>
      </div>
      <div style={{ pointerEvents: "none" }} className="album-image">
        {<img src={image?.url} alt="a"></img>}
      </div>
    </div>
  );
}
