import { procesarEmpresas } from "../src/services/uploadService.js";


export default async function companiesRoutes(app){


    app.post("/", async(request)=>{


        try {


            const {
                nombreArchivo,
                empresas
            } = request.body;



            const resultado =
                await procesarEmpresas(
                    nombreArchivo,
                    empresas
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