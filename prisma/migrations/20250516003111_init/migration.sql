-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "muxUploadId" TEXT NOT NULL,
    "muxAssetId" TEXT,
    "muxPlaybackId" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_muxUploadId_key" ON "Video"("muxUploadId");
