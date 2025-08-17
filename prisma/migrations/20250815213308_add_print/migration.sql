-- CreateTable
CREATE TABLE "Print" (
    "id" TEXT NOT NULL,
    "pictureUrl" TEXT NOT NULL,
    "flyboothId" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Print_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Print" ADD CONSTRAINT "Print_flyboothId_fkey" FOREIGN KEY ("flyboothId") REFERENCES "Flybooth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
