-- AlterTable
ALTER TABLE "public"."Carga" ADD COLUMN     "omitidos" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "asesorId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Asesor" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "bitrixResponsableId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asesor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Empresa" ADD CONSTRAINT "Empresa_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "public"."Asesor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

