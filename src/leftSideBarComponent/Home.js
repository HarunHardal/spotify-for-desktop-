import React, { useEffect, useState } from "react";
import "./home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../node_modules/swiper/swiper.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SwiperCore, { Autoplay } from "swiper";
SwiperCore.use([Autoplay]);
export default function Home({
  featuredPlaylists,
  setCategory,
  setCheckPlaylist,
  setHome,
  setArtist,
  setArtistId,
  getPlaylistId,
  setPlaylistDetail,
  playlistTrack,
  chooseTrack,
  chooseTrackInfo,
}) {
  //PlaylistArray ı tüm componentlerden sil

  const [count, setCount] = useState(0);

  const [first, setFirst] = useState();
  const [firstCategoryName, setFirstCategoryName] = useState();
  const [second, setSecond] = useState();
  const [secondCategoryName, setSecondCategoryName] = useState();
  const [third, setThird] = useState();
  const [thirdCategoryName, setThirdCategoryName] = useState();
  const [artistslist, setArtistList] = useState([]);

  useEffect(() => {
    setCategory.getFollowedArtists({ limit: 50 }).then(function (data) {
      setArtistList(
        Array.from(
          { length: 10 },
          () => data.body.artists.items[Math.floor(Math.random() * 50)]
        ).filter(function (item, pos, self) {
          return self.indexOf(item) === pos;
        })
      );
    });

    setCategory
      .getCategories({ limit: 50, offset: 0, country: "US" })
      .then(function (data) {
        var firstCategory =
          data.body.categories.items[
            Math.floor(Math.random() * (30 - 15 + 1)) + 15
          ];

        var secondCategory =
          data.body.categories.items[Math.floor(Math.random() * (15 - 0 + 1))];

        var thirdCategory =
          data.body.categories.items[
            Math.floor(Math.random() * (50 - 40 + 1)) + 40
          ];

        setFirstCategoryName(firstCategory?.name);
        setSecondCategoryName(secondCategory?.name);
        setThirdCategoryName(thirdCategory?.name);
        setCategory
          .getPlaylistsForCategory(firstCategory?.id)
          .then(function (data) {
            setFirst(data?.body);
          });
        setCategory
          .getPlaylistsForCategory(secondCategory?.id)
          .then(function (data) {
            setSecond(data?.body);
          });
        setCategory
          .getPlaylistsForCategory(thirdCategory?.id)
          .then(function (data) {
            setThird(data?.body);
          });
      });
  }, []);

  const [control, setCotrol] = useState(false);
  useEffect(() => {
    if (control) {
      chooseTrack(playlistTrack[0].track);
      chooseTrackInfo(playlistTrack[0].track);
      setCotrol(false);
    }
  }, [control, chooseTrackInfo, playlistTrack, chooseTrack]);
  const [slideAni, setSlideAni] = useState();
  return (
    <div className="home-wrapper">
      <div className="carousel">
        <div className="slider-count-wrapper">
          <p className="count">{count + 1}</p>
          <p className="slash">/</p>
          <p className="total">{featuredPlaylists?.playlists.items.length}</p>
        </div>
        <Swiper
          onSlideChange={(e) => {}}
          loop={true}
          autoplay={{ delay: 5000 }}
          onRealIndexChange={(e) => {
            setCount(e.realIndex);
            setSlideAni(true);
            setTimeout(() => {
              setSlideAni(false);
            }, 500);
          }}
          onSlidePrevTransitionEnd={() => {}}
        >
          {featuredPlaylists?.playlists.items.map((e) => (
            <SwiperSlide className="slide" key={e.name}>
              <div className="slider-image">
                <img src={e.images[0].url} alt={e.name}></img>
                <FontAwesomeIcon
                  className="slider-play-button"
                  icon={faCirclePlay}
                  onClick={() => {
                    getPlaylistId(e.id);
                    setTimeout(() => {
                      setCotrol(true);
                    }, 500);
                  }}
                />
              </div>
              <div className="slider-content">
                <div
                  className="slider-title"
                  onClick={() => {
                    setCheckPlaylist(true);
                    setHome(false);
                    getPlaylistId(e.id);
                    setPlaylistDetail(e);
                  }}
                >
                  {e.name}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={
                      slideAni
                        ? "slide-arrow-right arrow-ani"
                        : "slide-arrow-right"
                    }
                  />
                </div>
                <div className="slider-text">{e.description}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {first === undefined ? null : (
        <div className="row">
          <h2 className="category-name">{firstCategoryName}</h2>
          <Swiper spaceBetween={20} slidesPerView={4}>
            {first?.playlists.items.map((e) => (
              <SwiperSlide key={e.name}>
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
                      setHome(false);
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
      )}

      <div className="row">
        <h2 className="category-name">Artists You Follow</h2>
        <Swiper spaceBetween={10} slidesPerView={4} className="bg">
          {artistslist.map((e) => (
            <SwiperSlide
              onClick={() => {
                setArtistId(e.id);
                setArtist(true);
                setHome(false);
                setCheckPlaylist(false);
              }}
              key={e.name}
            >
              <div className="card artist-background">
                <div className="playlist-card-image artist-image">
                  <img src={e.images[0].url} alt={e.name}></img>
                </div>
                <p className="card-name">{e.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {second === undefined ? null : (
        <div className="row">
          <h2 className="category-name">{secondCategoryName}</h2>
          <Swiper spaceBetween={20} slidesPerView={4}>
            {second?.playlists.items.map((e) => (
              <SwiperSlide key={e.name}>
                <div className="card">
                  <div className="playlist-card-image">
                    <img src={e.images[0].url} alt={e.name}></img>
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
                      setHome(false);
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
      )}

      {third === undefined ? null : (
        <div className="row">
          <h2 className="category-name">{thirdCategoryName} </h2>
          <Swiper spaceBetween={20} slidesPerView={4}>
            {third?.playlists.items.map((e) => (
              <SwiperSlide key={e.name}>
                <div className="card">
                  <div className="playlist-card-image">
                    <img src={e.images[0].url} alt={e.name}></img>
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
                      setHome(false);
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
      )}
    </div>
  );
}
