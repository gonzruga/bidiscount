-- AlterTable
ALTER TABLE "OfferEvent" ADD COLUMN     "respondsToEventId" TEXT;

-- AddForeignKey
ALTER TABLE "OfferEvent" ADD CONSTRAINT "OfferEvent_respondsToEventId_fkey" FOREIGN KEY ("respondsToEventId") REFERENCES "OfferEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
