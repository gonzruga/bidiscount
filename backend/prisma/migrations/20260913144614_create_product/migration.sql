-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'NOT_AVAILABLE');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "itemName" TEXT NOT NULL,
    "description" TEXT,
    "shop" TEXT NOT NULL,
    "originalPrice" DECIMAL(12,2) NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
