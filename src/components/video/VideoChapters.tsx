
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime?: number; // in seconds
  thumbnailUrl?: string;
}

interface VideoChaptersProps {
  chapters: VideoChapter[];
  currentTime: number;
  duration: number;
  onChapterClick: (startTime: number) => void;
  className?: string;
}

const VideoChapters: React.FC<VideoChaptersProps> = ({
  chapters,
  currentTime,
  duration,
  onChapterClick,
  className
}) => {
  // Sort chapters by start time
  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => a.startTime - b.startTime);
  }, [chapters]);
  
  // Calculate which chapter is currently active
  const activeChapterId = useMemo(() => {
    for (let i = sortedChapters.length - 1; i >= 0; i--) {
      if (currentTime >= sortedChapters[i].startTime) {
        return sortedChapters[i].id;
      }
    }
    return sortedChapters[0]?.id;
  }, [sortedChapters, currentTime]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("w-full border rounded-md", className)}>
      <div className="p-3 border-b">
        <h3 className="font-medium">Chapitres</h3>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="p-2">
          {sortedChapters.map((chapter, index) => {
            const isActive = chapter.id === activeChapterId;
            const endTime = chapter.endTime || 
                          (sortedChapters[index + 1]?.startTime || duration);
            const chapterDuration = endTime - chapter.startTime;
            
            return (
              <div 
                key={chapter.id}
                onClick={() => onChapterClick(chapter.startTime)}
                className={cn(
                  "flex items-center p-2 rounded-md mb-1 cursor-pointer hover:bg-secondary/20 transition-colors",
                  isActive && "bg-primary/20"
                )}
              >
                {chapter.thumbnailUrl ? (
                  <div className="w-16 h-9 rounded overflow-hidden flex-shrink-0 mr-3">
                    <img 
                      src={chapter.thumbnailUrl} 
                      alt={chapter.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-9 bg-muted rounded flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-xs font-medium">{formatTime(chapter.startTime)}</span>
                  </div>
                )}
                
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={cn(
                    "text-sm font-medium truncate", 
                    isActive && "text-primary"
                  )}>
                    {chapter.title}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{formatTime(chapter.startTime)}</span>
                    <span className="mx-1">-</span>
                    <span>{formatTime(endTime)}</span>
                    <span className="ml-2">({formatTime(chapterDuration)})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VideoChapters;
