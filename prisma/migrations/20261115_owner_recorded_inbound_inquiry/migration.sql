-- Private independent HQ customer-initiated inbox, owner-recorded only.
CREATE TYPE "InquiryChannel" AS ENUM ('WHATSAPP','INSTAGRAM','WEBSITE','OTHER');
CREATE TYPE "InquiryStatus" AS ENUM ('OPEN','REPLIED_REPORTED','CLOSED');
CREATE TABLE "CustomerInquiry" (
  "id" TEXT NOT NULL,
  "channel" "InquiryChannel" NOT NULL,
  "customerAlias" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "InquiryStatus" NOT NULL DEFAULT 'OPEN',
  "sourceLabel" TEXT NOT NULL DEFAULT 'OWNER_RECORDED',
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "replyText" TEXT,
  "repliedAt" TIMESTAMP(3),
  "closeNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomerInquiry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CustomerInquiry_status_createdAt_idx" ON "CustomerInquiry"("status","createdAt");
