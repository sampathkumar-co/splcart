-- Owner-optional code-generated daily Reels. No external API keys or auto publishing.
ALTER TABLE "ReelJob" ADD COLUMN "scheduleDate" TEXT;
CREATE UNIQUE INDEX "ReelJob_assetId_scheduleDate_key" ON "ReelJob"("assetId","scheduleDate");

CREATE TABLE "CreativeSchedule" (
  "id" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "dailyTarget" INTEGER NOT NULL DEFAULT 2,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreativeSchedule_pkey" PRIMARY KEY ("id")
);
