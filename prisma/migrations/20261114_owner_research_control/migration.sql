-- Standalone Headquarters only. Pause affects future research requests.
CREATE TABLE "SystemControl" (
    "id" TEXT NOT NULL,
    "researchPaused" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SystemControl_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SystemAudit" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "actor" TEXT NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SystemAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SystemAudit_createdAt_idx" ON "SystemAudit"("createdAt");
