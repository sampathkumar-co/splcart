-- HQ records owner-reported external posting and observed performance only.
-- No Instagram/YouTube credentials, APIs, browsing, or automatic publishing.
CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM','YOUTUBE');
CREATE TABLE "SocialPublication" (
 "id" TEXT NOT NULL, "reelJobId" TEXT NOT NULL,
 "platform" "SocialPlatform" NOT NULL, "postUrl" TEXT NOT NULL,
 "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "sourceLabel" TEXT NOT NULL DEFAULT 'OWNER_REPORTED',
 CONSTRAINT "SocialPublication_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "SocialMetric" (
 "id" TEXT NOT NULL, "publicationId" TEXT NOT NULL,
 "views" INTEGER, "likes" INTEGER, "enquiries" INTEGER,
 "evidenceUrl" TEXT NOT NULL,
 "sourceLabel" TEXT NOT NULL DEFAULT 'OWNER_REPORTED',
 "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "SocialMetric_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SocialPublication_postUrl_key" ON "SocialPublication"("postUrl");
CREATE UNIQUE INDEX "SocialPublication_reelJobId_platform_key" ON "SocialPublication"("reelJobId","platform");
CREATE INDEX "SocialPublication_platform_recordedAt_idx" ON "SocialPublication"("platform","recordedAt");
CREATE INDEX "SocialMetric_publicationId_observedAt_idx" ON "SocialMetric"("publicationId","observedAt");
ALTER TABLE "SocialPublication" ADD CONSTRAINT "SocialPublication_reelJobId_fkey" FOREIGN KEY ("reelJobId") REFERENCES "ReelJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SocialMetric" ADD CONSTRAINT "SocialMetric_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "SocialPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
