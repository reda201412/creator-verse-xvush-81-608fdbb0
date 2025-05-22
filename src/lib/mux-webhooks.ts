
import { prisma } from './prisma';

// Handler for when a video upload is created in Mux
export const handleVideoCreated = async (data: any) => {
  try {
    const { id, upload_id, status, created_at, aspect_ratio } = data;
    
    console.log(`Handling video created webhook for asset ID: ${id}`);
    
    // Find the video by upload ID
    const video = await prisma.video.findUnique({
      where: { uploadId: upload_id }
    });
    
    if (!video) {
      console.error(`No video found with upload ID: ${upload_id}`);
      return { success: false, message: 'Video not found' };
    }
    
    // Update the video with the Mux asset ID and status
    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data: {
        assetId: id,
        status: status,
        createdAt: created_at,
        aspectRatio: aspect_ratio
      }
    });
    
    console.log(`Updated video ${video.id} with asset ID: ${id}`);
    
    return {
      success: true,
      video: updatedVideo
    };
  } catch (error) {
    console.error('Error handling video created webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Handler for when a video asset is ready for playback in Mux
export const handleAssetReady = async (data: any) => {
  try {
    const { id, playback_ids, status, duration, aspect_ratio } = data;
    
    console.log(`Handling asset ready webhook for asset ID: ${id}`);
    
    // Find the video by Mux asset ID
    const video = await prisma.video.findUnique({
      where: { assetId: id }
    });
    
    if (!video) {
      console.error(`No video found with asset ID: ${id}`);
      return { success: false, message: 'Video not found' };
    }
    
    // Get the playback ID (we'll just use the first one)
    const playbackId = playback_ids && playback_ids.length > 0 ? playback_ids[0].id : null;
    
    if (!playbackId) {
      console.error('No playback ID found in webhook data');
      return { success: false, message: 'No playback ID found' };
    }
    
    // Update the video with playback details
    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data: {
        playbackId,
        status,
        duration,
        aspectRatio: aspect_ratio,
        isPublished: true
      }
    });
    
    console.log(`Updated video ${video.id} with playback ID: ${playbackId}`);
    
    return {
      success: true,
      video: updatedVideo
    };
  } catch (error) {
    console.error('Error handling asset ready webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Handler for when an asset is deleted from Mux
export const handleAssetDeleted = async (data: any) => {
  try {
    const { id } = data;
    
    console.log(`Handling asset deleted webhook for asset ID: ${id}`);
    
    // Find the video by Mux asset ID
    const video = await prisma.video.findUnique({
      where: { assetId: id }
    });
    
    if (!video) {
      console.error(`No video found with asset ID: ${id}`);
      return { success: false, message: 'Video not found' };
    }
    
    // Update the video to reflect deletion
    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data: {
        status: 'deleted',
        isPublished: false
      }
    });
    
    console.log(`Marked video ${video.id} as deleted`);
    
    return {
      success: true,
      video: updatedVideo
    };
  } catch (error) {
    console.error('Error handling asset deleted webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Add the missing processWebhookRequest function
export const processWebhookRequest = async (req: any) => {
  try {
    // Get the webhook data from the request body
    const { type, data } = req.body;
    
    console.log(`Processing webhook: ${type}`);
    
    // Handle different webhook types
    switch (type) {
      case 'video.asset.created':
        return await handleVideoCreated(data);
      
      case 'video.asset.ready':
        return await handleAssetReady(data);
      
      case 'video.asset.deleted':
        return await handleAssetDeleted(data);
      
      default:
        console.log(`Unhandled webhook type: ${type}`);
        return { success: true, message: 'Webhook received but not processed' };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw new Error(`Failed to process webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
