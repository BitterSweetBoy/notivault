/*
  Warnings:

  - A unique constraint covering the columns `[sessionKey]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isSessionExpired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "logoutAt" TIMESTAMP(3),
ADD COLUMN     "revokedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sessionKey" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ticketData" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionKey_key" ON "Session"("sessionKey");
