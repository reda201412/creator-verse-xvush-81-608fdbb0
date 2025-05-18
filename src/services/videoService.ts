import { Client } from '@neondatabase/serverless';

// Type pour les métadonnées de la vidéo
export interface VideoMetadata {
  id?: number;
  user_id: string;
  title: string;
  description?: string;
  mux_asset_id: string;
  mux_playback_id?: string;
  mux_upload_id?: string;
  thumbnail_url?: string;
  duration?: number;
  aspect_ratio?: string;
  status: 'processing' | 'ready' | 'error';
  type: 'standard' | 'teaser' | 'premium' | 'vip';
  is_premium: boolean;
  token_price?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Get the database URL from environment variables
const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL;

export const saveVideoMetadata = async (metadata: Omit<VideoMetadata, 'id' | 'created_at' | 'updated_at'>): Promise<VideoMetadata> => {
  const client = new Client(databaseUrl);
  try {
    await client.connect();
    
    const query = `
      INSERT INTO videos (
        user_id, title, description, mux_asset_id, mux_playback_id, 
        mux_upload_id, thumbnail_url, duration, aspect_ratio, 
        status, type, is_premium, token_price
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING *
    `;

    const result = await client.query(query, [
      metadata.user_id,
      metadata.title,
      metadata.description || null,
      metadata.mux_asset_id,
      metadata.mux_playback_id || null,
      metadata.mux_upload_id || null,
      metadata.thumbnail_url || null,
      metadata.duration || null,
      metadata.aspect_ratio || null,
      metadata.status,
      metadata.type,
      metadata.is_premium,
      metadata.token_price || null
    ]);

    return result.rows[0] as VideoMetadata;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des métadonnées de la vidéo:', error);
    throw error;
  } finally {
    await client.end();
  }
};

export const updateVideoMetadata = async (id: number, updates: Partial<VideoMetadata>): Promise<VideoMetadata> => {
  const client = new Client(databaseUrl);
  try {
    await client.connect();
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Construire dynamiquement les champs à mettre à jour
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error('Aucune mise à jour fournie');
    }

    // Add the id to the values array
    values.push(id);
    
    // Build and execute the query
    const query = `
      UPDATE videos 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await client.query(query, values);
    return result.rows[0] as VideoMetadata;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des métadonnées de la vidéo:', error);
    throw error;
  } finally {
    await client.end();
  }
};

export const getVideoById = async (id: number): Promise<VideoMetadata | null> => {
  const client = new Client(databaseUrl);
  try {
    await client.connect();
    
    const query = `
      SELECT * FROM videos 
      WHERE id = $1
    `;
    const result = await client.query(query, [id]);
    return result.rows[0] as VideoMetadata || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    throw error;
  } finally {
    await client.end();
  }
};

export const getVideosByUserId = async (userId: string): Promise<VideoMetadata[]> => {
  const client = new Client(databaseUrl);
  try {
    await client.connect();
    
    const query = `
      SELECT * FROM videos 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await client.query(query, [userId]);
    return result.rows as VideoMetadata[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos de l\'utilisateur:', error);
    throw error;
  } finally {
    await client.end();
  }
};
