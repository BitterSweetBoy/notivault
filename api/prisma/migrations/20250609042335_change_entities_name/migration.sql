/*
  Warnings:

  - You are about to drop the column `serviceId` on the `ApiToken` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `integrationServiceId` to the `ApiToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApiToken" DROP CONSTRAINT "ApiToken_serviceId_fkey";

-- AlterTable
ALTER TABLE "ApiToken" DROP COLUMN "serviceId",
ADD COLUMN     "integrationServiceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "IntegrationService" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,

    CONSTRAINT "IntegrationService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationService_nombre_key" ON "IntegrationService"("nombre");

-- AddForeignKey
ALTER TABLE "ApiToken" ADD CONSTRAINT "ApiToken_integrationServiceId_fkey" FOREIGN KEY ("integrationServiceId") REFERENCES "IntegrationService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
