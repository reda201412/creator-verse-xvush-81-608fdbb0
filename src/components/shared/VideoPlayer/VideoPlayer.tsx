import React, { useState, useRef, useEffect } from 'react';
import MuxPlayer, { MuxPlayerRefAttributes } from '@mux/mux-player-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type MuxPlayerElement = React.ElementRef<typeof MuxPlayer>;

export interface VideoPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /**
   * The Mux playback ID for the video
   */
  playbackId: string;
  /**
   * The title of the video (for accessibility)
   */
  title?: string;
  /**
   * Whether the video should start playing automatically
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Whether the video should loop
   * @default false
   */
  loop?: boolean;
  /**
   * Whether to show the video controls
   * @default true
   */
  controls?: boolean;
  /**
   * Whether to mute the video by default
   * @default false
   */
  muted?: boolean;
  /**
   * Custom poster image URL
   */
  poster?: string;
  /**
   * Custom class name for the player container
   */
  className?: string;
  /**
   * Callback when the video starts playing
   */
  onPlay?: () => void;
  /**
   * Callback when the video is paused
   */
  onPause?: () => void;
  /**
   * Callback when the video ends
   */
  onEnded?: () => void;
  /**
   * Callback when the video encounters an error
   */
  onError?: (error: unknown) => void;
}

/**
 * A responsive video player component using Mux Player
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  playbackId,
  title = 'Video Player',
  autoPlay = false,
  loop = false,
  controls = true,
  muted = false,
  poster,
  className,
  onPlay,
  onPause,
  onEnded,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const playerRef = useRef<MuxPlayerRefAttributes>(null);

  // Handle loading state
  useEffect(() => {
    if (playerRef.current) {
      const handleCanPlay = () => setIsLoading(false);
      const handleWaiting = () => setIsLoading(true);
      
      const player = playerRef.current;
      player.addEventListener('canplay', handleCanPlay);
      player.addEventListener('waiting', handleWaiting);
      
      return () => {
        player.removeEventListener('canplay', handleCanPlay);
        player.removeEventListener('waiting', handleWaiting);
      };
    }
  }, [playbackId]);

  // Handle play/pause state
  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause?.();
  };

  // Handle errors
  const handleError = (error: Error) => {
    console.error('Video player error:', error);
    setIsLoading(false);
    onError?.(error);
  };

  if (!playbackId) {
    return (
      <div className={cn('bg-gray-100 rounded-lg flex items-center justify-center aspect-video', className)}>
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full bg-black rounded-lg overflow-hidden', className)} {...props}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      
      {/* Mux Player */}
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        metadata={{
          video_id: playbackId,
          video_title: title,
          viewer_user_id: 'viewer', // You might want to pass the actual user ID here
        }}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        style={{
          '--controls': controls ? 'block' : 'none',
          '--seek-backward-button': 'none',
          '--seek-forward-button': 'none',
        } as React.CSSProperties}
        className="w-full h-full"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={onEnded}
        onError={() => handleError(new Error('Video playback error'))}
      >
        {poster && (
          <div slot="poster" className="absolute inset-0 w-full h-full">
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </MuxPlayer>
      
      {/* Custom play button when not showing controls */}
      {!controls && !isPlaying && !isLoading && (
        <button
          className="absolute inset-0 flex items-center justify-center z-10"
          onClick={() => playerRef.current?.play()}
          aria-label="Play video"
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
