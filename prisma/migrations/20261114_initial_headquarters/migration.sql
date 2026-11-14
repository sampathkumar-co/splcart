-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('DISCOVERED', 'RESEARCHED', 'QUALIFIED', 'APPROVED', 'CONTACTED', 'INTERESTED', 'QUOTATION', 'NEGOTIATION', 'WON_REPORTED', 'WON_VERIFIED', 'LOST', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'APPROVED', 'VOID');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'BLOCKED');

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "businessSourceUrl" TEXT NOT NULL,
    "businessWebsiteUrl" TEXT,
    "businessHost" TEXT,
    "evidenceSummary" TEXT NOT NULL,
    "verifiedBusinessAt" TIMESTAMP(3),
    "verificationEvidenceText" TEXT,
    "verificationEvidenceUrl" TEXT,
    "wholesaleIntentNote" TEXT,
    "wholesaleIntentEvidenceUrl" TEXT,
    "contactConsentUrl" TEXT,
    "consentGrantedAt" TIMESTAMP(3),
    "independentSource" BOOLEAN NOT NULL DEFAULT false,
    "stage" "Stage" NOT NULL DEFAULT 'RESEARCHED',
    "decision" "Decision" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "splcartProductId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "pricePaise" INTEGER NOT NULL,
    "unitDescription" TEXT NOT NULL,
    "deliveredPricePaise" INTEGER,
    "ownerVerifiedAt" TIMESTAMP(3) NOT NULL,
    "verificationSource" TEXT NOT NULL DEFAULT 'OWNER_ATTESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMatch" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "equivalentMaterials" BOOLEAN NOT NULL DEFAULT false,
    "equivalentUnits" BOOLEAN NOT NULL DEFAULT false,
    "competitorPricePaise" INTEGER,
    "competitorDeliveredPricePaise" INTEGER,
    "competitorMaterial" TEXT,
    "competitorUnitDescription" TEXT,
    "competitorEvidenceUrl" TEXT,
    "competitorPriceCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "actor" TEXT NOT NULL DEFAULT 'OWNER',
    "evidenceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversion" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "orderReference" TEXT NOT NULL,
    "grossAmountPaise" INTEGER NOT NULL,
    "evidenceUrl" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "verificationNote" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchRun" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'PLAYWRIGHT',
    "sourceUrl" TEXT NOT NULL,
    "finalUrl" TEXT,
    "pageTitle" TEXT,
    "excerpt" TEXT,
    "evidenceJson" JSONB,
    "status" "RunStatus" NOT NULL DEFAULT 'RUNNING',
    "errorCode" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    CONSTRAINT "ResearchRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPricePaise" INTEGER NOT NULL,
    "deliveryPaise" INTEGER NOT NULL DEFAULT 0,
    "productTitleSnapshot" TEXT NOT NULL,
    "productUrlSnapshot" TEXT NOT NULL,
    "productSourceSnapshot" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedAt" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_businessHost_key" ON "Prospect"("businessHost");

-- CreateIndex
CREATE INDEX "Prospect_stage_updatedAt_idx" ON "Prospect"("stage", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_businessSourceUrl_name_key" ON "Prospect"("businessSourceUrl", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_splcartProductId_key" ON "Product"("splcartProductId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductMatch_prospectId_productId_key" ON "ProductMatch"("prospectId", "productId");

-- CreateIndex
CREATE INDEX "Activity_prospectId_createdAt_idx" ON "Activity"("prospectId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversion_prospectId_key" ON "Conversion"("prospectId");

-- CreateIndex
CREATE INDEX "ResearchRun_startedAt_idx" ON "ResearchRun"("startedAt");

-- CreateIndex
CREATE INDEX "Quote_prospectId_createdAt_idx" ON "Quote"("prospectId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProductMatch" ADD CONSTRAINT "ProductMatch_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMatch" ADD CONSTRAINT "ProductMatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
