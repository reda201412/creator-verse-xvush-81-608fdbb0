import React from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface XteaseVideoPlayerProps {
  playbackId: string; // The Mux Playback ID
  title?: string;       // Optional video title for metadata
  // Add any other props you need (e.g., autoPlay, muted, loop)
}

const XteaseVideoPlayer: React.FC<XteaseVideoPlayerProps> = ({
  playbackId,
  title,
  // ... other props
}) => {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand" // Or 'live' if it's a live stream
      metadata={{
        videoTitle: title || 'Untitled Video',
        // Add other metadata as needed
      }}
      // Add other attributes as needed (autoPlay, muted, loop, etc.)
    />
  );
};

export default XteaseVideoPlayer;
