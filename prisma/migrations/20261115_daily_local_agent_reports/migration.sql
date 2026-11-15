-- HQ-only daily offline evidence; default DISABLED, no platform or phone calls.
CREATE TABLE "AgentSchedule" (
  "id" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "lastRunDate" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AgentSchedule_pkey" PRIMARY KEY ("id")
);
