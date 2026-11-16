-- HQ-only local agent tasks, truthful status and zero paid model charges.
CREATE TYPE "AgentTaskStatus" AS ENUM ('RUNNING','COMPLETED','BLOCKED','FAILED');
CREATE TABLE "AgentTask" (
  "id" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "status" "AgentTaskStatus" NOT NULL DEFAULT 'RUNNING',
  "resultJson" JSONB,
  "errorCode" TEXT,
  "sourceUrls" JSONB,
  "modelCostPaise" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  CONSTRAINT "AgentTask_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AgentTask_roleId_createdAt_idx" ON "AgentTask"("roleId","createdAt");
CREATE INDEX "AgentTask_status_createdAt_idx" ON "AgentTask"("status","createdAt");
