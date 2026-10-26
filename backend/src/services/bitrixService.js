export async function crearNegociacionBitrix(empresa){


    const response = await fetch(

        process.env.BITRIX_WEBHOOK +
        "crm.deal.add.json",

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                fields:{


                    TITLE:
                    `Afiliación ${empresa.razonSocial}`,


                    CATEGORY_ID:145,


                    STAGE_ID:"C145:NEW",


                    COMMENTS:
                    `
                    NIT: ${empresa.nit}
                    Empresa: ${empresa.razonSocial}
                    Email: ${empresa.email || ""}
                    Teléfono: ${empresa.telefono || ""}
                    Ciudad: ${empresa.ciudad || ""}
                    `

                }

            })

        }

    );



    const data =
    await response.json();



    console.log(
        "Respuesta Bitrix:",
        data
    );



    if(!data.result){

        throw new Error(
            data.error_description ||
            "No se pudo crear negociación"
        );

    }



    return data.result;


}