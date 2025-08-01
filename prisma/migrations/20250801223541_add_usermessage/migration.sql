-- CreateTable
CREATE TABLE "UserPrintMessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "flyboothId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPrintMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPrintMessage" ADD CONSTRAINT "UserPrintMessage_flyboothId_fkey" FOREIGN KEY ("flyboothId") REFERENCES "Flybooth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
