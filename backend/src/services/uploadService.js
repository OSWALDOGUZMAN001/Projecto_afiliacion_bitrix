import prisma from "../utils/prisma.js";

import { crearNegociacionBitrix } from "./bitrixService.js";

import {
    resolverColumnas,
    mapearFila,
    tieneExclusion,
    limpiar,
    CAMPO_NOMBRE_ASESOR
} from "./mapeoService.js";


const CATEGORY_ID = 145;

const STAGE_ID = "C145:NEW";




function armarNegociacion(datos, camposBitrix, asesor){

    return {

        TITLE:
        `AFILIACIÓN - ${datos.razonSocial || "SIN RAZÓN SOCIAL"} - ${datos.nit}`,

        CATEGORY_ID,

        STAGE_ID,

        // Responsable de la negociacion
        ASSIGNED_BY_ID:
        asesor.bitrixResponsableId,

        ...camposBitrix,

        [CAMPO_NOMBRE_ASESOR]:
        asesor.nombre

    };

}




function numeroEntero(valor){

    const numero = parseInt(String(valor).replace(/\D/g, ""), 10);

    return Number.isFinite(numero) ? numero : null;

}




/*
empresas:  filas del CSV tal como vienen (columna -> valor)
asesorId:  asesor por defecto para filas sin columna de asesor
*/

export async function procesarEmpresas(

    nombreArchivo,

    empresas,

    asesorIdPorDefecto

){


    const creados = [];

    const omitidos = [];

    const duplicados = [];

    const errores = [];



    const columnas = Object.keys(empresas[0] || {});

    const { mapeadas, noMapeadas } = resolverColumnas(columnas);



    const asesores = new Map(
        (await prisma.asesor.findMany({ where:{ activo:true } })).map(a=>[a.id, a])
    );



    const carga = await prisma.carga.create({

        data:{

            nombreArchivo,

            totalRegistros:
            empresas.length

        }

    });




    for(const [index, fila] of empresas.entries()){


        // Fila 1 del CSV son los encabezados
        const numeroFila = index + 2;

        const { datos, camposBitrix } = mapearFila(fila, mapeadas);

        const registro = {
            fila:numeroFila,
            nit:datos.nit || "",
            razonSocial:datos.razonSocial || ""
        };


        try{


            // 1. Identificacion en tramite: no se sube

            if(tieneExclusion(fila)){

                omitidos.push({
                    ...registro,
                    nit:datos.nitOriginal || "",
                    motivo:"Identificación en trámite"
                });

                continue;

            }



            // 2. NIT obligatorio

            if(!datos.nit){

                errores.push({
                    ...registro,
                    motivo:"Registro sin NIT"
                });

                continue;

            }



            // 3. Asesor asignado

            const asesorId = numeroEntero(
                datos.asesorId ?? limpiar(asesorIdPorDefecto)
            );

            const asesor = asesores.get(asesorId);


            if(!asesor){

                errores.push({
                    ...registro,
                    motivo: asesorId === null
                        ? "Registro sin asesor asignado"
                        : `El asesor ${asesorId} no está registrado`
                });

                continue;

            }



            // 4. NIT ya cargado anteriormente

            const existe = await prisma.empresa.findUnique({

                where:{ nit:datos.nit },

                include:{ asesor:true }

            });


            if(existe){

                const nombreAsesor =
                    existe.asesor?.nombre || "Sin asesor registrado";

                duplicados.push({
                    ...registro,
                    asesor:nombreAsesor,
                    mensaje:`El documento ya ha sido cargado - Asesor: ${nombreAsesor}`
                });

                continue;

            }



            // 5. Crear negociacion en Bitrix

            const bitrixId = await crearNegociacionBitrix(
                armarNegociacion(datos, camposBitrix, asesor)
            );



            // 6. Guardar localmente solo si Bitrix la creo

            await prisma.empresa.create({

                data:{

                    nit:datos.nit,

                    razonSocial:datos.razonSocial || "",

                    direccion:datos.direccion,

                    barrio:datos.barrio,

                    localidad:datos.localidad,

                    celular1:datos.celular1,

                    celular2:datos.celular2,

                    celular3:datos.celular3,

                    telefono:datos.telefono,

                    email:datos.email,

                    codigoCiiu:datos.codigoCiiu,

                    baseDatos:datos.baseDatos,

                    representanteLegal:datos.representanteLegal,

                    trabajadores:
                    datos.trabajadores ? numeroEntero(datos.trabajadores) : null,

                    asesorId:asesor.id,

                    estado:"CREADO",

                    bitrixId:String(bitrixId),

                    fechaBitrix:new Date()

                }

            });


            creados.push({
                ...registro,
                asesor:asesor.nombre,
                bitrixId:String(bitrixId)
            });


        }
        catch(error){

            console.error(
                "ERROR EMPRESA",
                error.message
            );

            errores.push({
                ...registro,
                motivo:error.message
            });

        }

    }




    await prisma.carga.update({

        where:{ id:carga.id },

        data:{

            creados:creados.length,

            omitidos:omitidos.length,

            duplicados:duplicados.length,

            errores:errores.length

        }

    });




    return {

        cargaId:carga.id,

        total:empresas.length,

        resumen:{

            creados:creados.length,

            omitidos:omitidos.length,

            duplicados:duplicados.length,

            errores:errores.length

        },

        creados,

        omitidos,

        duplicados,

        errores,

        columnas:{

            mapeadas:Object.entries(mapeadas).map(
                ([columna, destino])=>({
                    columna,
                    campo:destino.clave,
                    bitrix:destino.bitrix
                })
            ),

            noMapeadas

        }

    };

}
