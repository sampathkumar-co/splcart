-- Independent HQ owner-photo + code-generated Reel pipeline; no store access.
CREATE TYPE "ReelStatus" AS ENUM ('QUEUED','RENDERING','RENDERED','APPROVED','FAILED','VOID');

CREATE TABLE "CreativeAsset" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "mime" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "byteSize" INTEGER NOT NULL,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CreativeAsset_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ReelJob" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "titleSnapshot" TEXT NOT NULL,
  "materialSnapshot" TEXT NOT NULL,
  "linkSnapshot" TEXT NOT NULL,
  "durationSeconds" INTEGER NOT NULL DEFAULT 20,
  "status" "ReelStatus" NOT NULL DEFAULT 'QUEUED',
  "outputFilename" TEXT,
  "errorCode" TEXT,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReelJob_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CreativeAsset_filename_key" ON "CreativeAsset"("filename");
CREATE INDEX "CreativeAsset_productId_createdAt_idx" ON "CreativeAsset"("productId","createdAt");
CREATE UNIQUE INDEX "ReelJob_outputFilename_key" ON "ReelJob"("outputFilename");
CREATE INDEX "ReelJob_status_createdAt_idx" ON "ReelJob"("status","createdAt");
CREATE INDEX "ReelJob_productId_createdAt_idx" ON "ReelJob"("productId","createdAt");
ALTER TABLE "CreativeAsset" ADD CONSTRAINT "CreativeAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReelJob" ADD CONSTRAINT "ReelJob_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReelJob" ADD CONSTRAINT "ReelJob_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "CreativeAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
