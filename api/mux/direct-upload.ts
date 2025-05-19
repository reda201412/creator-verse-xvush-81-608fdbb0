
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { Mux } from "@mux/mux-node";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Mux client
const muxTokenId = process.env.MUX_TOKEN_ID;
const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

if (!muxTokenId || !muxTokenSecret) {
  console.error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET environment variables");
}

const mux = new Mux({
  tokenId: muxTokenId || '',
  tokenSecret: muxTokenSecret || '',
});

export async function POST(req: NextRequest) {
  try {
    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Create direct upload on Mux
    const upload = await mux.video.uploads.create({
      cors_origin: req.headers.get("origin") || "*",
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "standard",
      },
    });

    // Return the upload details to the client
    return NextResponse.json({
      id: upload.id,
      url: upload.url,
      assetId: upload.asset_id,
      status: upload.status,
    });
  } catch (error) {
    console.error("Error creating direct upload:", error);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the asset ID from query parameters
    const { searchParams } = new URL(req.url);
    const assetId = searchParams.get('assetId');
    
    if (!assetId) {
      return NextResponse.json(
        { error: "Missing assetId parameter" },
        { status: 400 }
      );
    }
    
    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(" ")[1];
    
    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }
    
    // Get asset details from Mux
    const asset = await mux.video.assets.retrieve(assetId);
    
    return NextResponse.json({
      id: asset.id,
      status: asset.status,
      playbackIds: asset.playback_ids,
      aspectRatio: asset.aspect_ratio,
      duration: asset.duration,
      maxResolution: asset.max_stored_resolution
    });
  } catch (error) {
    console.error("Error retrieving asset:", error);
    return NextResponse.json(
      { error: "Failed to retrieve asset" },
      { status: 500 }
    );
  }
}
