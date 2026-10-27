import prisma from "../utils/prisma.js";

import {
    crearNegociacionBitrix,
    obtenerOpcionesListas,
    urlNegociacion
} from "./bitrixService.js";

import {
    resolverColumnas,
    mapearFila,
    tieneExclusion,
    buscarOpcionLista,
    nombreCampo,
    normalizar,
    limpiar,
    CODIGOS_LISTA,
    CAMPO_NOMBRE_ASESOR
} from "./mapeoService.js";


const CATEGORY_ID = 145;

const STAGE_ID = "C145:NEW";




function armarNegociacion(datos, camposBitrix, asesor){

    return {

        // Razón Social -> Nombre de la negociacion
        TITLE:
        datos.razonSocial || `AFILIACIÓN - ${datos.nit}`,

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




// El asesor puede venir como ID ("3") o como nombre.
// En la tabla se guarda primer nombre y primer apellido ("Paola Garcia"),
// en el archivo puede venir completo ("Paola Marcela Garcia Lopez"):
// coincide si el primer nombre es igual y el apellido está entre las demás palabras.
// Devuelve { asesor } o { error }.

function buscarAsesor(valor, asesores){

    const texto = limpiar(valor);

    if(/^\d+$/.test(texto)){
        return { asesor:asesores.find(a=>a.id === Number(texto)) };
    }


    const exacto = asesores.find(a=>normalizar(a.nombre) === normalizar(texto));

    if(exacto){
        return { asesor:exacto };
    }


    const [primerNombre, ...resto] = normalizar(texto).split(" ");

    const candidatos = asesores.filter(a=>{

        const [nombre, ...apellidos] = normalizar(a.nombre).split(" ");

        return nombre === primerNombre &&
            apellidos.length > 0 &&
            apellidos.every(apellido=>resto.includes(apellido));

    });


    if(candidatos.length > 1){

        return {
            error:`El asesor "${texto}" coincide con varios: ${candidatos.map(a=>a.nombre).join(", ")}`
        };

    }


    return { asesor:candidatos[0] };

}




/*
empresas:          filas del archivo tal como vienen (columna -> valor)
asesorPorDefecto:  ID o nombre para filas sin columna de asesor
*/

export async function procesarEmpresas(

    nombreArchivo,

    empresas,

    asesorPorDefecto

){


    const creados = [];

    const omitidos = [];

    const duplicados = [];

    const errores = [];

    const advertencias = [];



    const columnas = Object.keys(empresas[0] || {});

    const { mapeadas, ignoradas, noMapeadas } = resolverColumnas(columnas);



    const asesores = await prisma.asesor.findMany({
        where:{ activo:true }
    });


    const opcionesListas = await obtenerOpcionesListas(CODIGOS_LISTA);



    const carga = await prisma.carga.create({

        data:{

            nombreArchivo,

            totalRegistros:
            empresas.length

        }

    });




    for(const [index, fila] of empresas.entries()){


        // Fila 1 del archivo son los encabezados
        const numeroFila = index + 2;

        const { datos, camposBitrix, valoresLista } = mapearFila(fila, mapeadas);

        const registro = {
            fila:numeroFila,
            nit:datos.nit || "",
            razonSocial:datos.razonSocial || ""
        };


        try{


            // 1. Identificacion en tramite: no se sube

            if(tieneExclusion(fila, datos)){

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
                    motivo:"Registro sin Identificación (NIT)"
                });

                continue;

            }



            // 3. NIT ya cargado anteriormente

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



            // 4. Asesor asignado

            const valorAsesor = datos.asesor ?? limpiar(asesorPorDefecto);

            const { asesor, error:errorAsesor } = buscarAsesor(valorAsesor, asesores);


            if(!asesor){

                errores.push({
                    ...registro,
                    motivo: errorAsesor || (valorAsesor
                        ? `El asesor "${valorAsesor}" no está registrado`
                        : "Registro sin asesor asignado")
                });

                continue;

            }


            if(!asesor.bitrixResponsableId){

                errores.push({
                    ...registro,
                    motivo:`El asesor ${asesor.nombre} no tiene ID de responsable en Bitrix`
                });

                continue;

            }



            // 5. Campos de lista: texto -> ID de la opcion en Bitrix

            for(const [codigo, valor] of Object.entries(valoresLista)){

                const id = buscarOpcionLista(valor, opcionesListas[codigo]);

                if(id){

                    camposBitrix[codigo] = id;

                }
                else{

                    advertencias.push({
                        ...registro,
                        campo:nombreCampo(codigo),
                        valor,
                        motivo:"No existe esa opción en la lista de Bitrix; el campo se dejó vacío"
                    });

                }

            }



            // 6. Crear negociacion en Bitrix

            const bitrixId = await crearNegociacionBitrix(
                armarNegociacion(datos, camposBitrix, asesor)
            );



            // 7. Guardar localmente solo si Bitrix la creo

            await prisma.empresa.create({

                data:{

                    nit:datos.nit,

                    razonSocial:datos.razonSocial || "",

                    direccion:datos.direccion,

                    localidad:datos.ciudad,

                    celular1:datos.celular,

                    telefono:datos.telefono1,

                    celular2:datos.telefono2,

                    email:datos.email,

                    codigoCiiu:datos.codigoCiiu,

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
                bitrixId:String(bitrixId),
                enlace:urlNegociacion(bitrixId)
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

        advertencias,

        columnas:{

            mapeadas:Object.entries(mapeadas).map(
                ([columna, destino])=>({
                    columna,
                    campo:destino.clave,
                    bitrix:destino.bitrix
                })
            ),

            ignoradas,

            noMapeadas

        }

    };

}
