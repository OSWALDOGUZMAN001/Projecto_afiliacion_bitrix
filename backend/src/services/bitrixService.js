import axios from "axios";


// URL del webhook entrante.
// Ejemplo: https://comfacundi.bitrix24.es/rest/USUARIO/TOKEN/
// Temporal: pegar aqui la URL real SOLO en la copia local.
// El repositorio es publico: no hacer commit con el token real.
// Si existe BITRIX_WEBHOOK en .env, tiene prioridad.

const BITRIX_WEBHOOK = "PEGAR_AQUI_URL_WEBHOOK";


function urlBitrix(metodo){

    const webhook = process.env.BITRIX_WEBHOOK || BITRIX_WEBHOOK;

    if(!webhook.startsWith("https://")){

        throw new Error(
            "Falta la URL del webhook de Bitrix en backend/src/services/bitrixService.js"
        );

    }

    return webhook.replace(/\/?$/, "/") + metodo;

}




// Opciones de los campos tipo lista: { codigo: [{ ID, VALUE }] }

export async function obtenerOpcionesListas(codigos){

    const response = await axios.get(
        urlBitrix("crm.deal.fields.json")
    );


    const campos = response.data.result || {};

    const opciones = {};


    for(const codigo of codigos){
        opciones[codigo] = campos[codigo]?.items || [];
    }


    return opciones;

}




export async function crearNegociacionBitrix(fields){


    console.log(
        "========== DATOS ENVIADOS BITRIX =========="
    );

    console.log(
        JSON.stringify(fields, null, 2)
    );


    try{

        const response = await axios.post(

            urlBitrix("crm.deal.add.json"),

            { fields }

        );


        if(!response.data.result){

            throw new Error(
                response.data.error_description ||
                "No se pudo crear negociación"
            );

        }


        return response.data.result;

    }
    catch(error){

        const detalle =
            error.response?.data?.error_description ||
            error.response?.data?.error ||
            error.message;


        console.error(
            "ERROR BITRIX",
            error.response?.data || error.message
        );


        throw new Error(detalle);

    }

}
