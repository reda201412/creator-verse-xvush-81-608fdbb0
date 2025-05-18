import { Mux } from '@mux/mux-node';

// Initialize Mux with API credentials
const muxTokenId = import.meta.env.VITE_MUX_TOKEN_ID;
const muxTokenSecret = import.meta.env.VITE_MUX_TOKEN_SECRET;

if (!muxTokenId || !muxTokenSecret) {
  throw new Error('VITE_MUX_TOKEN_ID and VITE_MUX_TOKEN_SECRET must be set in environment variables');
}

const mux = new Mux({
  tokenId: muxTokenId,
  tokenSecret: muxTokenSecret,
});

/**
 * Creates a direct upload URL for Mux
 * @returns Upload URL and asset information
 */
export async function createDirectUpload() {
  try {
    const upload = await mux.video.uploads.create({
      cors_origin: import.meta.env.VITE_APP_URL || '*',
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard'
      }
    });
    
    // Log the upload object for debugging
    console.log('Mux Upload Object:', JSON.stringify(upload, null, 2));
    
    // Create a response object with type assertion to handle the Upload type
    const response = {
      id: upload.id,
      url: upload.url,
      assetId: upload.asset_id,
      cors_origin: (upload as any).cors_origin,
      status: upload.status,
      timeout: (upload as any).timeout,
      // Try to get the created timestamp from various possible properties
      createdAt: (upload as any).created_at || (upload as any).created || new Date().toISOString(),
      asset: upload.asset_id ? {
        id: upload.asset_id,
        playback_ids: (upload as any).asset_playback_ids?.map((id: string) => ({ id, policy: 'public' }))
      } : null
    };
    
    return response;
  } catch (error) {
    console.error('Error creating Mux direct upload:', error);
    throw new Error('Failed to create direct upload URL');
  }
}

/**
 * Gets information about a Mux asset
 * @param assetId The Mux asset ID
 * @returns Asset details
 */
export async function getAsset(assetId: string) {
  try {
    const asset = await mux.video.assets.retrieve(assetId);
    
    return {
      id: asset.id,
      status: asset.status,
      duration: asset.duration,
      aspect_ratio: asset.aspect_ratio,
      created_at: asset.created_at,
      max_stored_resolution: asset.max_stored_resolution,
      max_stored_frame_rate: asset.max_stored_frame_rate,
      playback_ids: asset.playback_ids?.map(pid => ({
        id: pid.id,
        policy: pid.policy
      })),
      is_live: asset.is_live,
      passthrough: asset.passthrough,
      errors: asset.errors,
      master_access: asset.master_access,
      mp4_support: asset.mp4_support,
      static_renditions: asset.static_renditions,
      test: asset.test,
      tracks: asset.tracks?.map(track => ({
        id: track.id,
        type: track.type,
        duration: track.duration,
        max_width: track.max_width,
        max_height: track.max_height,
        max_frame_rate: track.max_frame_rate,
        max_channels: track.max_channels,
        max_channel_layout: track.max_channel_layout
      }))
    };
  } catch (error) {
    console.error('Error fetching Mux asset:', error);
    throw new Error('Failed to fetch asset details');
  }
}

/**
 * Deletes a Mux asset
 * @param assetId The Mux asset ID to delete
 * @returns Success status
 */
export async function deleteAsset(assetId: string) {
  try {
    // The Mux Node SDK uses 'delete' instead of 'del'
    await mux.video.assets.delete(assetId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting Mux asset:', error);
    throw new Error('Failed to delete asset');
  }
}

/**
 * Creates a playback ID for an asset
 * @param assetId The Mux asset ID
 * @param policy The playback policy (public or signed)
 * @returns Playback ID information
 */
export async function createPlaybackId(assetId: string, policy: 'public' | 'signed' = 'public') {
  try {
    const playbackId = await mux.video.assets.createPlaybackId(assetId, { policy });
    return {
      id: playbackId.id,
      policy: playbackId.policy
    };
  } catch (error) {
    console.error('Error creating playback ID:', error);
    throw new Error('Failed to create playback ID');
  }
}

/**
 * Gets the playback URL for an asset
 * @param playbackId The playback ID
 * @returns The playback URL
 */
export function getPlaybackUrl(playbackId: string) {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
