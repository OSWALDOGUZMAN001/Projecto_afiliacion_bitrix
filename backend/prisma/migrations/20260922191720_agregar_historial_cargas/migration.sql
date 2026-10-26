-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "cargaId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Carga" (
    "id" SERIAL NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "totalRegistros" INTEGER NOT NULL,
    "creados" INTEGER NOT NULL DEFAULT 0,
    "duplicados" INTEGER NOT NULL DEFAULT 0,
    "errores" INTEGER NOT NULL DEFAULT 0,
    "fechaCarga" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carga_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Empresa" ADD CONSTRAINT "Empresa_cargaId_fkey" FOREIGN KEY ("cargaId") REFERENCES "public"."Carga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
