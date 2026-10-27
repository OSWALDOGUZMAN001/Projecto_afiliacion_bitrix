import prisma from "../src/utils/prisma.js";


export default async function asesoresRoutes(app){


    // Listar asesores

    app.get("/", async()=>{

        return prisma.asesor.findMany({
            orderBy:{ id:"asc" }
        });

    });




    /*
    Crear o actualizar asesores.
    Acepta un objeto o una lista:
    { "id": 1, "nombre": "Paola Garcia", "bitrixResponsableId": 216459 }
    bitrixResponsableId es opcional (se puede asignar despues).
    */

    app.post("/", async(request, reply)=>{


        const lista = Array.isArray(request.body)
            ? request.body
            : [request.body];


        const guardados = [];


        for(const item of lista){


            const id = Number(item?.id);

            const nombre = String(item?.nombre ?? "").trim();

            const bitrixResponsableId =
                item?.bitrixResponsableId == null
                    ? undefined
                    : Number(item.bitrixResponsableId);


            if(
                !Number.isInteger(id) ||
                !nombre ||
                (bitrixResponsableId !== undefined && !Number.isInteger(bitrixResponsableId))
            ){

                return reply.code(400).send({
                    success:false,
                    error:"Cada asesor necesita id y nombre; bitrixResponsableId debe ser número entero",
                    item
                });

            }


            guardados.push(

                await prisma.asesor.upsert({

                    where:{ id },

                    update:{ nombre, bitrixResponsableId },

                    create:{ id, nombre, bitrixResponsableId }

                })

            );

        }


        return {
            success:true,
            asesores:guardados
        };


    });


}
