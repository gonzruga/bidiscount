-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'NEGOTIATION', 'ACCEPTED', 'REJECTED', 'RETRACTED');

-- CreateEnum
CREATE TYPE "FulfillmentMethod" AS ENUM ('PICKUP', 'DELIVERY', 'BOTH');

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "fulfillmentMethod" "FulfillmentMethod" NOT NULL DEFAULT 'PICKUP',
    "remarks" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
