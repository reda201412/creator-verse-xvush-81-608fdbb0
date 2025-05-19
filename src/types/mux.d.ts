// Types pour les réponses de l'API Mux
declare namespace Mux {
  // Réponse de l'API Mux pour un asset
  interface Asset {
    id: string;
    created_at: string;
    status: 'preparing' | 'ready' | 'errored';
    duration: number;
    aspect_ratio?: string;
    playback_ids?: PlaybackId[];
    max_stored_resolution?: string;
    max_stored_frame_rate?: number;
    is_live?: boolean;
    errors?: {
      type: string;
      messages: string[];
    };
  }

  // ID de lecture pour un asset
  interface PlaybackId {
    id: string;
    policy: 'public' | 'signed';
  }

  // Réponse de l'API Mux pour un upload
  interface Upload {
    id: string;
    status: 'waiting' | 'asset_created' | 'errored' | 'cancelled' | 'timed_out';
    asset_id?: string;
    error?: {
      type: string;
      message: string;
    };
  }

  // Événement de webhook
  type WebhookEvent = {
    type: string;
    object: {
      type: 'video.asset' | 'video.upload' | 'video.live_stream';
      id: string;
    };
    id: string;
    environment: {
      name: string;
      id: string;
    };
    data: Asset | Upload;
    request_id?: string;
    created_at: string;
  };
}
