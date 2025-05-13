
import React from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface XteaseVideoPlayerProps {
  playbackId: string; // The Mux Playback ID
  title?: string;      // Optional video title for metadata
  poster?: string;     // Optional thumbnail/poster URL
  autoPlay?: boolean;  // Optional autoplay flag
  muted?: boolean;     // Optional muted flag
  loop?: boolean;      // Optional loop flag
  className?: string;  // Optional class name for styling
}

const XteaseVideoPlayer: React.FC<XteaseVideoPlayerProps> = ({
  playbackId,
  title = 'Xtease Video',
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  className,
}) => {
  if (!playbackId) {
    console.error('XteaseVideoPlayer: No playback ID provided');
    return (
      <div className={`flex items-center justify-center bg-black aspect-video ${className}`}>
        <p className="text-white">Vidéo non disponible</p>
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      metadata={{
        video_title: title,
        player_name: 'Xtease Player',
      }}
    />
  );
};

export default XteaseVideoPlayer;
