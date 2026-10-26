-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "cargaId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Empresa" ADD CONSTRAINT "Empresa_cargaId_fkey" FOREIGN KEY ("cargaId") REFERENCES "public"."Carga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
