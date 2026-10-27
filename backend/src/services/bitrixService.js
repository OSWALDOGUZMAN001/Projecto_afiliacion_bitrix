import axios from "axios";


// URL del webhook entrante, terminada en "/".
// Ejemplo: https://comfacundi.bitrix24.es/rest/USUARIO/TOKEN/
// Se configura en backend/.env, nunca en el codigo.

function urlBitrix(metodo){

    const webhook = process.env.BITRIX_WEBHOOK;

    if(!webhook){

        throw new Error(
            "Falta BITRIX_WEBHOOK en backend/.env"
        );

    }

    return webhook.replace(/\/?$/, "/") + metodo;

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
