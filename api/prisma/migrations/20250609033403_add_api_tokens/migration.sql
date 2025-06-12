-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiToken" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ultimaModificacion" TIMESTAMP(3) NOT NULL,
    "fechaConfiguracion" TIMESTAMP(3) NOT NULL,
    "ultimaVerificacion" TIMESTAMP(3) NOT NULL,
    "apiKey" TEXT NOT NULL,
    "serverUrl" TEXT,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_nombre_key" ON "Service"("nombre");

-- AddForeignKey
ALTER TABLE "ApiToken" ADD CONSTRAINT "ApiToken_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
