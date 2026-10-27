import { procesarEmpresas } from "../src/services/uploadService.js";


export default async function companiesRoutes(app){


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