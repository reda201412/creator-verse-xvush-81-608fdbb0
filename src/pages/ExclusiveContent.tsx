
import React from 'react';
import { ensureRequiredRestrictionProps } from '@/utils/exclusive-content-utils';
// Fix the import statement to import default export
import ExclusiveContentViewer from '@/components/exclusive/ExclusiveContentViewer';

const ExclusiveContent = () => {
  // Mock content data
  const exclusiveContent = [
    {
      id: '1',
      title: 'Premium Tutorial',
      description: 'Advanced techniques for creators',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
      contentUrl: 'https://example.com/premium-content-1',
      type: 'video',
      creatorId: 'creator-123',
      creatorName: 'Creative Pro',
      creatorAvatar: 'https://i.pravatar.cc/150?u=creator123',
      restrictions: {
        tier: 'vip',
        tokenPrice: 50,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        viewLimit: 5,
        downloadsAllowed: false,
        sharingAllowed: false
      }
    },
    {
      id: '2',
      title: 'Exclusive Interview',
      description: 'Behind the scenes with industry leaders',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
      contentUrl: 'https://example.com/premium-content-2',
      type: 'audio',
      creatorId: 'creator-456',
      creatorName: 'Industry Insider',
      creatorAvatar: 'https://i.pravatar.cc/150?u=creator456',
      restrictions: {
        tier: 'superfan',
        tokenPrice: 25,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        viewLimit: 3,
        downloadsAllowed: true,
        sharingAllowed: false
      }
    },
    {
      id: '3',
      title: 'Fan-Only Content',
      description: 'Special content just for fans',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      contentUrl: 'https://example.com/premium-content-3',
      type: 'image',
      creatorId: 'creator-789',
      creatorName: 'Fan Favorite',
      creatorAvatar: 'https://i.pravatar.cc/150?u=creator789',
      restrictions: {
        tier: 'fan',
        tokenPrice: 10,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        viewLimit: 10,
        downloadsAllowed: false,
        sharingAllowed: true
      }
    }
  ];
  
  // Fix the restrictions compatibility issue by ensuring required properties
  const renderContent = (content: any) => {
    const contentWithRequiredProps = {
      ...content,
      restrictions: ensureRequiredRestrictionProps(content.restrictions || {})
    };
    
    return (
      <div className="exclusive-content-item p-4 border rounded-lg shadow-sm">
        <img 
          src={content.thumbnailUrl || 'https://via.placeholder.com/300x169'} 
          alt={content.title}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
        <h3 className="text-lg font-semibold">{content.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{content.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={content.creatorAvatar} 
            alt={content.creatorName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm">{content.creatorName}</span>
        </div>
        
        <div className="bg-gray-100 p-2 rounded-md text-sm">
          <div className="flex justify-between mb-1">
            <span>Access Level:</span>
            <span className="font-medium">{content.restrictions.tier}</span>
          </div>
          {content.restrictions.tokenPrice && (
            <div className="flex justify-between mb-1">
              <span>Price:</span>
              <span className="font-medium">{content.restrictions.tokenPrice} tokens</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Expires:</span>
            <span className="font-medium">
              {new Date(content.restrictions.expiresAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <button className="w-full mt-3 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
          Unlock Content
        </button>
      </div>
    );
  };
  
  // Fix ExclusiveContentViewer props
  const renderContentViewer = (content: any) => {
    const formattedContent = {
      id: content.id,
      title: content.title,
      description: content.description,
      type: content.type,
      mediaUrl: content.contentUrl,
      thumbnailUrl: content.thumbnailUrl,
      creator: {
        id: content.creatorId,
        name: content.creatorName,
        avatar: content.creatorAvatar
      },
      stats: {
        likes: 0,
        views: 0,
        shares: 0,
        comments: 0
      },
      restrictions: {
        tier: content.restrictions.tier,
        tokenPrice: content.restrictions.tokenPrice,
        expiresAt: content.restrictions.expiresAt,
        viewLimit: content.restrictions.viewLimit,
        downloadsAllowed: content.restrictions.downloadsAllowed || false,
        sharingAllowed: content.restrictions.sharingAllowed || false
      }
    };
    
    return (
      <ExclusiveContentViewer
        content={formattedContent}
        userTier="free"
        userTokenBalance={0}
        onUnlock={() => {}}
        onLike={() => {}}
        onComment={() => {}}
      />
    );
  };
  
  return (
    <div className="exclusive-content-page p-4">
      <h1 className="text-2xl font-bold mb-6">Exclusive Content</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exclusiveContent.map(content => (
          <div key={content.id}>
            {renderContent(content)}
          </div>
        ))}
      </div>
      
      {/* Uncomment when ExclusiveContentViewer component is available */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Featured Content</h2>
        {renderContentViewer(exclusiveContent[0])}
      </div> */}
    </div>
  );
};

export default ExclusiveContent;
