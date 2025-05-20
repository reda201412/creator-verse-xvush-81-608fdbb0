
import React from 'react';
import { VideoData } from '@/types/video';

// Fix the creator rating issue - make sure it's a number
const CreatorProfile = () => {
  // Replace the string rating with a number
  const creatorData = {
    metrics: {
      rating: 4.5, // Changed from string to number
      followers: 1000,
      content: 50
    }
  };
  
  // Fix VideoData property accesses
  const renderVideo = (video: VideoData) => {
    // Use video.format with safe fallback
    const format = video.format || '16:9';
    
    return (
      <div className="video-item">
        <img 
          src={video.thumbnail_url || video.thumbnailUrl || 'https://via.placeholder.com/300x169'} 
          alt={video.title} 
        />
        <div className="video-stats">
          <span>{video.viewCount || 0} views</span>
          <span>{video.likeCount || 0} likes</span>
          <span>{video.commentCount || 0} comments</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="creator-profile">
      {/* Creator profile content would go here */}
      <div className="profile-header">
        <h1>Creator Profile</h1>
        <div className="metrics">
          <div className="metric">
            <span className="value">{creatorData.metrics.followers}</span>
            <span className="label">Followers</span>
          </div>
          <div className="metric">
            <span className="value">{creatorData.metrics.rating}</span>
            <span className="label">Rating</span>
          </div>
          <div className="metric">
            <span className="value">{creatorData.metrics.content}</span>
            <span className="label">Content</span>
          </div>
        </div>
      </div>
      
      <div className="videos-section">
        <h2>Videos</h2>
        <div className="videos-grid">
          {/* Example of using renderVideo */}
          {renderVideo({
            id: '1',
            userId: 'user123',
            title: 'Sample Video',
            thumbnail_url: 'https://via.placeholder.com/300x169',
            type: 'standard',
            viewCount: 1200,
            likeCount: 350,
            commentCount: 45
          })}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
