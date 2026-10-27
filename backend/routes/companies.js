import { procesarEmpresas } from "../src/services/uploadService.js";
import prisma from "../src/utils/prisma.js";


export default async function companiesRoutes(app){


    // Resumen de la ultima carga + total historico de empresas creadas

    app.get("/resumen", async()=>{

        const [ultimaCarga, totalCreadas] = await Promise.all([

            prisma.carga.findFirst({
                orderBy:{ id:"desc" }
            }),

            prisma.empresa.count({
                where:{ estado:"CREADO" }
            })

        ]);

        return { ultimaCarga, totalCreadas };

    });



    app.post("/", async(request)=>{


        try {


            const {
                nombreArchivo,
                empresas,
                asesorId
            } = request.body;



            if(!Array.isArray(empresas) || empresas.length === 0){

                return {
                    success:false,
                    error:"El archivo no tiene registros"
                };

            }



            const resultado =
                await procesarEmpresas(
                    nombreArchivo,
                    empresas,
                    asesorId
                );



            return {

                success:true,

                resultado

            };



        } catch(error){


            console.error(error);


            return {

                success:false,

                error:error.message

            };


        }


    });


}