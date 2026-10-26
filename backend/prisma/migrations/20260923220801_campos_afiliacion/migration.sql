/*
  Warnings:

  - You are about to drop the column `cargaId` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `ciudad` on the `Empresa` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Empresa" DROP CONSTRAINT "Empresa_cargaId_fkey";

-- AlterTable
ALTER TABLE "public"."Empresa" DROP COLUMN "cargaId",
DROP COLUMN "ciudad",
ADD COLUMN     "barrio" TEXT,
ADD COLUMN     "baseDatos" TEXT,
ADD COLUMN     "celular1" TEXT,
ADD COLUMN     "celular2" TEXT,
ADD COLUMN     "celular3" TEXT,
ADD COLUMN     "codigoCiiu" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "fechaBitrix" TIMESTAMP(3),
ADD COLUMN     "localidad" TEXT,
ADD COLUMN     "representanteLegal" TEXT,
ADD COLUMN     "trabajadores" INTEGER;
