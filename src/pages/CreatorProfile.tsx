
import React, { useState } from 'react';
import { VideoData } from '@/types/video';
import { FiUser, FiClock, FiHeart, FiMessageSquare, FiEye, FiBarChart2, FiCalendar, FiAward } from 'react-icons/fi';

// Types for our enhanced creator data
interface CreatorMetrics {
  followers: number;
  following: number;
  totalViews: number;
  totalLikes: number;
  totalVideos: number;
  engagementRate: number;
  joinDate: string;
  categories: string[];
}

interface VideoCategory {
  id: string;
  name: string;
  videos: VideoData[];
}

const CreatorProfile = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [activeCategory, setActiveCategory] = useState('all');

  // Enhanced creator data
  const creatorData = {
    name: 'Creator Name',
    username: '@creator',
    bio: 'Digital creator passionate about creating engaging content. Join me on this creative journey!',
    avatar: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/1200x400',
    metrics: {
      followers: 12453,
      following: 342,
      totalViews: 1250000,
      totalLikes: 45000,
      totalVideos: 87,
      engagementRate: 4.8,
      joinDate: '2022-01-15',
      categories: ['Tutorials', 'Vlogs', 'Reviews', 'Gaming']
    } as CreatorMetrics
  };

  // Sample video data organized by categories
  const videoCategories: VideoCategory[] = [
    {
      id: 'all',
      name: 'All Videos',
      videos: [
        {
          id: 1,
          userId: 'user123',
          title: 'Getting Started with React Native',
          description: 'Learn the basics of React Native development',
          thumbnail_url: 'https://via.placeholder.com/300x169/4a90e2/ffffff',
          type: 'tutorial',
          viewCount: 12453,
          likeCount: 1245,
          commentCount: 87,
          duration: '12:45',
          uploadDate: '2023-05-15',
          category: 'Tutorials'
        },
        {
          id: 2,
          userId: 'user123',
          title: 'My Daily Routine',
          description: 'A day in my life as a content creator',
          thumbnail_url: 'https://via.placeholder.com/300x169/50e3c2/ffffff',
          type: 'vlog',
          viewCount: 8765,
          likeCount: 654,
          commentCount: 32,
          duration: '8:20',
          uploadDate: '2023-05-12',
          category: 'Vlogs'
        },
        {
          id: 3,
          userId: 'user123',
          title: 'iPhone 14 Pro Review',
          description: 'My honest thoughts after 1 month of use',
          thumbnail_url: 'https://via.placeholder.com/300x169/9013fe/ffffff',
          type: 'review',
          viewCount: 23456,
          likeCount: 1987,
          commentCount: 143,
          duration: '15:30',
          uploadDate: '2023-05-08',
          category: 'Reviews'
        }
      ]
    },
    {
      id: 'tutorials',
      name: 'Tutorials',
      videos: [
        {
          id: 1,
          userId: 'user123',
          title: 'Getting Started with React Native',
          description: 'Learn the basics of React Native development',
          thumbnail_url: 'https://via.placeholder.com/300x169/4a90e2/ffffff',
          type: 'tutorial',
          viewCount: 12453,
          likeCount: 1245,
          commentCount: 87,
          duration: '12:45',
          uploadDate: '2023-05-15',
          category: 'Tutorials'
        }
      ]
    },
    {
      id: 'vlogs',
      name: 'Vlogs',
      videos: [
        {
          id: 2,
          userId: 'user123',
          title: 'My Daily Routine',
          description: 'A day in my life as a content creator',
          thumbnail_url: 'https://via.placeholder.com/300x169/50e3c2/ffffff',
          type: 'vlog',
          viewCount: 8765,
          likeCount: 654,
          commentCount: 32,
          duration: '8:20',
          uploadDate: '2023-05-12',
          category: 'Vlogs'
        }
      ]
    },
    {
      id: 'reviews',
      name: 'Reviews',
      videos: [
        {
          id: 3,
          userId: 'user123',
          title: 'iPhone 14 Pro Review',
          description: 'My honest thoughts after 1 month of use',
          thumbnail_url: 'https://via.placeholder.com/300x169/9013fe/ffffff',
          type: 'review',
          viewCount: 23456,
          likeCount: 1987,
          commentCount: 143,
          duration: '15:30',
          uploadDate: '2023-05-08',
          category: 'Reviews'
        }
      ]
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderVideoCard = (video: VideoData) => (
    <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={video.thumbnail_url || 'https://via.placeholder.com/300x169'}
          alt={video.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration || '0:00'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="flex items-center mr-3">
            <FiEye className="mr-1" /> {formatNumber(video.viewCount || 0)}
          </span>
          <span className="flex items-center">
            <FiHeart className="mr-1" /> {formatNumber(video.likeCount || 0)}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(video.uploadDate || '').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{formatNumber(creatorData.metrics.followers)}</div>
        <div className="text-gray-600">Followers</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{formatNumber(creatorData.metrics.totalViews)}</div>
        <div className="text-gray-600">Total Views</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{creatorData.metrics.engagementRate}%</div>
        <div className="text-gray-600">Engagement Rate</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{formatNumber(creatorData.metrics.totalVideos)}</div>
        <div className="text-gray-600">Videos</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        <img 
          src={creatorData.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-12 left-4 md:left-8">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-white overflow-hidden">
            <img 
              src={creatorData.avatar} 
              alt={creatorData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 md:px-8 pt-16 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{creatorData.name}</h1>
            <p className="text-gray-600">{creatorData.username}</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
        
        <p className="mt-3 text-gray-700">{creatorData.bio}</p>
        
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <span className="flex items-center mr-4">
            <FiCalendar className="mr-1" />
            Joined {new Date(creatorData.metrics.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center">
            <FiUser className="mr-1" />
            {formatNumber(creatorData.metrics.following)} Following
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {creatorData.metrics.categories.map(category => (
            <span 
              key={category} 
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4 md:px-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'videos'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 md:px-8 py-6">
        {activeTab === 'videos' && (
          <div>
            {/* Video Categories */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {videoCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videoCategories
                .find(cat => cat.id === activeCategory)?.videos
                .map(video => renderVideoCard(video))
              }
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">About {creatorData.name}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Bio</h3>
                <p className="mt-1 text-gray-600">{creatorData.bio}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Stats</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FiAward className="text-indigo-500 mr-2" />
                    <span className="text-gray-600">Top 5%</span>
                  </div>
                  <div className="flex items-center">
                    <FiBarChart2 className="text-indigo-500 mr-2" />
                    <span className="text-gray-600">4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="text-indigo-500 mr-2" />
                    <span className="text-gray-600">2+ years creating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Channel Analytics</h2>
            {renderMetrics()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Top Performing Videos</h3>
                <div className="space-y-3">
                  {videoCategories[0].videos
                    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 3)
                    .map(video => (
                      <div key={video.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <img 
                          src={video.thumbnail_url || 'https://via.placeholder.com/80x45'} 
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                          <p className="text-xs text-gray-500">{formatNumber(video.viewCount || 0)} views</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Audience Demographics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">18-24 years</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">25-34 years</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">35-44 years</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
