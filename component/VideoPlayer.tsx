
import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  subtitleUrl: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, subtitleUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // When the src changes, we want to load the new video.
  // The 'key' prop on the component in DetailPage.tsx handles re-mounting,
  // but this ensures the video loads correctly if the component were reused differently.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      key={src} // Using key ensures the video element is re-created when src changes
      className="w-full h-full"
      controls
      autoPlay
      crossOrigin="anonymous"
    >
      <source src={src} type="application/x-mpegURL" />
      {subtitleUrl && (
        <track
          label="Indonesia"
          kind="subtitles"
          srcLang="id"
          src={subtitleUrl}
          default
        />
      )}
      Browser Anda tidak mendukung tag video.
    </video>
  );
};

export default VideoPlayer;
