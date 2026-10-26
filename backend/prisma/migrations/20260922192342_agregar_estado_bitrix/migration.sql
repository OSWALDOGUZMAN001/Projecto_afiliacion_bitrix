/*
  Warnings:

  - You are about to drop the column `cargaId` on the `Empresa` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Empresa" DROP CONSTRAINT "Empresa_cargaId_fkey";

-- AlterTable
ALTER TABLE "public"."Empresa" DROP COLUMN "cargaId",
ADD COLUMN     "errorBitrix" TEXT,
ADD COLUMN     "intentosBitrix" INTEGER NOT NULL DEFAULT 0;
