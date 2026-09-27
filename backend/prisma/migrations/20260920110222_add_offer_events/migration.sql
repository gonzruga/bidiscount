/*
  Warnings:

  - You are about to drop the `CounterOffer` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OfferEventType" AS ENUM ('ACCEPT', 'COUNTEROFFER', 'REJECT', 'RETRACT');

-- CreateEnum
CREATE TYPE "OfferActorRole" AS ENUM ('BUYER', 'SELLER');

-- DropTable
DROP TABLE "CounterOffer";

-- CreateTable
CREATE TABLE "OfferEvent" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "eventType" "OfferEventType" NOT NULL,
    "actorRole" "OfferActorRole" NOT NULL,
    "amount" DECIMAL(10,2),
    "endDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfferEvent_offerId_idx" ON "OfferEvent"("offerId");

-- CreateIndex
CREATE INDEX "Offer_productId_idx" ON "Offer"("productId");

-- AddForeignKey
ALTER TABLE "OfferEvent" ADD CONSTRAINT "OfferEvent_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
