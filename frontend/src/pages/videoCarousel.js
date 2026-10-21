
import React, { useEffect, useState } from 'react';
import './videoCarousel.css';

const VIDEOS = [
  {
    src: '../videos/Pointpedro_Jetty.mp4',
    title: 'Point Pedro Jetty',
  },
    {
    src: '../videos/Pointpedro_Jetty.mp4',
    title: 'Point Pedro Jetty',
  },
    {
    src: '../videos/Pointpedro_Jetty.mp4',
    title: 'Point Pedro Jetty',
  },
//   {
//     src: '../videos/Pointpedro_LH.mp4',
//     title: 'Point Pedro Lighthouse',
//   },
//   {
//     src: '../videos/Tropical.webm',
//     title: 'Northern Beaches',
//   },
];

export default function HeroVideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % VIDEOS.length);
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  const activeVideo = VIDEOS[activeIndex];

  return (
    <div className="hero-video-carousel">
      <video
        key={activeVideo.src}
        className="hero-video"
        autoPlay
        muted
        playsInline
        loop
        poster={activeVideo.poster}
      >
        <source src={activeVideo.src} type="video/mp4" />
      </video>

      <div className="hero-video-shade" />

      <div className="hero-video-caption">
        {activeVideo.title}
      </div>

      <div className="hero-video-dots">
        {VIDEOS.map((video, index) => (
          <button
            key={video.src}
            type="button"
            className={`hero-video-dot ${
              index === activeIndex ? 'active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${video.title}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
