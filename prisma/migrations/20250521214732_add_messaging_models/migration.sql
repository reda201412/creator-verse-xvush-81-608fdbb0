-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('processing', 'ready', 'error');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('standard', 'teaser', 'premium', 'vip');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "profile_image_url" TEXT,
    "cover_image_url" TEXT,
    "is_creator" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followers" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assetId" TEXT,
    "uploadId" TEXT,
    "playbackId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "duration" DOUBLE PRECISION,
    "aspectRatio" TEXT,
    "thumbnailUrl" TEXT,
    "videoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_metadata" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "filename" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "frameRate" DOUBLE PRECISION,
    "bitrate" INTEGER,
    "originalUrl" TEXT,
    "uploadStatus" TEXT,
    "error" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "video_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "video_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "video_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_views" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "video_id" INTEGER NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "isGated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "last_read_at" TIMESTAMPTZ,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "metadata" JSONB,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_user_username" ON "users"("username");

-- CreateIndex
CREATE INDEX "idx_follower_id" ON "followers"("follower_id");

-- CreateIndex
CREATE INDEX "idx_following_id" ON "followers"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "followers_follower_id_following_id_key" ON "followers"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "videos_assetId_key" ON "videos"("assetId");

-- CreateIndex
CREATE INDEX "idx_videos_user_id" ON "videos"("user_id");

-- CreateIndex
CREATE INDEX "idx_videos_status" ON "videos"("status");

-- CreateIndex
CREATE INDEX "idx_videos_created_at" ON "videos"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "video_metadata_videoId_key" ON "video_metadata"("videoId");

-- CreateIndex
CREATE INDEX "idx_comments_user_id" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "idx_comments_video_id" ON "comments"("video_id");

-- CreateIndex
CREATE INDEX "idx_like_user_id" ON "likes"("user_id");

-- CreateIndex
CREATE INDEX "idx_like_video_id" ON "likes"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_video_id_key" ON "likes"("user_id", "video_id");

-- CreateIndex
CREATE INDEX "idx_videoview_user_id" ON "video_views"("user_id");

-- CreateIndex
CREATE INDEX "idx_videoview_video_id" ON "video_views"("video_id");

-- CreateIndex
CREATE INDEX "idx_videoview_created_at" ON "video_views"("created_at");

-- CreateIndex
CREATE INDEX "idx_conversation_updated_at" ON "conversations"("updated_at");

-- CreateIndex
CREATE INDEX "idx_participant_user_id" ON "participants"("user_id");

-- CreateIndex
CREATE INDEX "idx_participant_conversation_id" ON "participants"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_user_id_conversation_id_key" ON "participants"("user_id", "conversation_id");

-- CreateIndex
CREATE INDEX "idx_message_conversation_id" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "idx_message_sender_id" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_message_created_at" ON "messages"("created_at");

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_metadata" ADD CONSTRAINT "video_metadata_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
