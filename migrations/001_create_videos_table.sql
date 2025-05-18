-- Création de la table videos
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    mux_asset_id TEXT NOT NULL,
    mux_playback_id TEXT,
    mux_upload_id TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    aspect_ratio TEXT,
    status TEXT NOT NULL CHECK (status IN ('processing', 'ready', 'error')),
    type TEXT NOT NULL CHECK (type IN ('standard', 'teaser', 'premium', 'vip')),
    is_premium BOOLEAN NOT NULL DEFAULT false,
    token_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index pour les recherches courantes
    CONSTRAINT uq_mux_asset_id UNIQUE (mux_asset_id)
);

-- Index pour les requêtes de recherche
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON videos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
