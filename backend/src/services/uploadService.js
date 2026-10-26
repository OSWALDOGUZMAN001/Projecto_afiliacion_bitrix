import axios from "axios";
import prisma from "../utils/prisma.js";


const BITRIX_URL =
"https://comfacundi.bitrix24.es/rest/216459/7hkgspq9r2fbthll";



function limpiar(valor){

    if(valor === undefined || valor === null){
        return "";
    }

    return String(valor).trim();

}





async function crearNegociacionBitrix(empresa){


    const deal = {


        TITLE:
        `AFILIACIÓN - ${empresa.razonSocial} - ${empresa.nit}`,


        CATEGORY_ID:145,


        STAGE_ID:"C145:NEW",



        /*
        CAMPOS NEGOCIACION
        */


        // Trabajadores
        UF_CRM_1727966365:
        Number(empresa.trabajadores) || 0,



        // Barrio
        UF_CRM_1626966414:
        empresa.barrio || "",



        // Localidad
        // IMPORTANTE:
        // Este campo es lista desplegable.
        // Pendiente colocar ID interno.
        UF_CRM_1765812845:
        "",



        // Celular empresa 1
        UF_CRM_1743690121:
        empresa.celular1 || "",



        // Celular empresa 2
        UF_CRM_1743690139:
        empresa.celular2 || "",



        // Celular empresa 3
        UF_CRM_1743690158:
        empresa.celular3 || "",




        // Correo
        UF_CRM_1743690187:
        empresa.email || "",




        // Código CIIU
        // Es texto, no número
        UF_CRM_689A7012E6340:
        empresa.codigoCiiu || "",



        // Base datos
        UF_CRM_1741961954:
        empresa.baseDatos || "",




        // Representante legal
        // Si existe campo en negociación agregar ID correcto

    };




    console.log(
        "========== DATOS ENVIADOS BITRIX =========="
    );


    console.log(
        JSON.stringify(
            deal,
            null,
            2
        )
    );




    try{


        const response = await axios.post(

            `${BITRIX_URL}/crm.deal.add.json`,

            {
                fields:deal
            }

        );


        console.log(
            "RESPUESTA BITRIX",
            response.data
        );


        return response.data.result;



    }
    catch(error){


        console.error(
            "ERROR BITRIX",
            error.response?.data ||
            error.message
        );


        throw error;

    }


}









export async function procesarEmpresas(

    nombreArchivo,

    empresas

){



    let creados = 0;

    let duplicados = 0;

    let errores = 0;





    const carga = await prisma.carga.create({

        data:{

            nombreArchivo,

            totalRegistros:
            empresas.length

        }

    });








    for(const empresa of empresas){



        try{



            const datos = {



                nit:
                limpiar(
                    empresa.nit
                ),



                nombreEmpresa:
                limpiar(
                    empresa.razonSocial
                ),



                direccion:
                limpiar(
                    empresa.direccion
                ),



                barrio:
                limpiar(
                    empresa.barrio
                ),



                localidad:
                limpiar(
                    empresa.localidad
                ),



                celular1:
                limpiar(
                    empresa.celular1
                ),



                celular2:
                limpiar(
                    empresa.celular2
                ),



                celular3:
                limpiar(
                    empresa.celular3
                ),



                telefono:
                limpiar(
                    empresa.telefono
                ),



                email:
                limpiar(
                    empresa.email
                ),



                codigoCiiu:
                limpiar(
                    empresa.codigoCiiu
                ),



                baseDatos:
                limpiar(
                    empresa.baseDatos
                ),



                representanteLegal:
                limpiar(
                    empresa.representanteLegal
                ),



                trabajadores:
                limpiar(
                    empresa.trabajadores
                )

            };




            console.log(
                "DATOS NORMALIZADOS",
                datos
            );





            if(
                !datos.nit ||
                !datos.nombreEmpresa
            ){

                errores++;

                continue;

            }








            const existe =
            await prisma.empresa.findUnique({

                where:{

                    nit:
                    datos.nit

                }

            });





            if(existe){

                duplicados++;

                continue;

            }








            const empresaBD =
            await prisma.empresa.create({

                data:{


                    nit:
                    datos.nit,


                    razonSocial:
                    datos.nombreEmpresa,


                    email:
                    datos.email,


                    telefono:
                    datos.telefono,


                    estado:
                    "PENDIENTE"

                }

            });









            const bitrixId =
            await crearNegociacionBitrix(datos);








            await prisma.empresa.update({

                where:{

                    id:
                    empresaBD.id

                },


                data:{


                    bitrixId:
                    String(bitrixId),


                    estado:
                    "CREADO"

                }

            });




            creados++;



        }
        catch(error){



            console.error(

                "ERROR EMPRESA",

                error.response?.data ||
                error.message

            );



            errores++;


        }


    }








    await prisma.carga.update({

        where:{

            id:
            carga.id

        },


        data:{


            creados,

            duplicados,

            errores

        }


    });








    return {


        cargaId:
        carga.id,


        total:
        empresas.length,


        creados,


        duplicados,


        errores


    };



}