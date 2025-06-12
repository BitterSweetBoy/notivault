-- 1) Crear el tipo enum TokenEstado
CREATE TYPE "TokenEstado" AS ENUM ('conectado', 'desconectado');

-- 2) Agregar la columna activo (soft-delete)
ALTER TABLE "ApiToken"
ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;

-- 3) Convertir la columna estado al nuevo enum
--    a) Primero, cambiar el nombre de la columna actual
ALTER TABLE "ApiToken"
RENAME COLUMN "estado" TO "estado_old";

--    b) Agregar la nueva columna con el type enum
ALTER TABLE "ApiToken"
ADD COLUMN "estado" "TokenEstado" NOT NULL DEFAULT 'conectado';

--    c) Copiar los datos de la columna vieja a la nueva
UPDATE "ApiToken"
SET "estado" = estado_old::text::"TokenEstado";

--    d) Eliminar la columna vieja
ALTER TABLE "ApiToken"
DROP COLUMN "estado_old";
