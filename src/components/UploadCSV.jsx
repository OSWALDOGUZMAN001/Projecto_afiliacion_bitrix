import { useState } from "react";


export default function UploadCSV() {


    const [archivo, setArchivo] = useState(null);

    const [empresas, setEmpresas] = useState([]);

    const [resultado, setResultado] = useState(null);

    const [procesando, setProcesando] = useState(false);



    // ==================================
    // LIMPIAR TEXTO CSV
    // ==================================

    function limpiarTexto(valor){

        if(!valor)
            return "";

        return valor
            .replace(/�/g,"")
            .trim();

    }





    // ==================================
    // LEER CSV
    // ==================================

    function leerCSV(file){


        const reader = new FileReader();



        reader.onload = (e)=>{


            let texto = e.target.result;



            texto = texto.replace(/^\uFEFF/, "");



            const lineas = texto

                .split(/\r?\n/)

                .filter(
                    linea=>linea.trim()
                );




            if(lineas.length === 0)
                return;




            // Detectar separador

            const separador = 
                lineas[0].includes(";")
                ?
                ";"
                :
                ",";





            console.log(
                "SEPARADOR DETECTADO:",
                separador
            );




            const headers = lineas[0]

                .split(separador)

                .map(
                    h=>limpiarTexto(h)
                );




            console.log(
                "COLUMNAS CSV:",
                headers
            );





            const datos = lineas

            .slice(1)

            .map(linea=>{


                const valores = linea

                    .split(separador)

                    .map(
                        v=>limpiarTexto(v)
                    );



                let objeto = {};



                headers.forEach(
                    (header,index)=>{


                        objeto[header] =
                            valores[index] || "";

                    }

                );



                return objeto;


            });





            console.log(
                "DATOS LEIDOS:",
                datos
            );



            setEmpresas(datos);


        };




        reader.readAsText(
            file,
            "UTF-8"
        );


    }







    // ==================================
    // SELECCIONAR ARCHIVO
    // ==================================

    function seleccionarArchivo(e){


        const file =
            e.target.files[0];



        if(!file)
            return;



        setArchivo(file);

        leerCSV(file);

        setResultado(null);


    }








    // ==================================
    // ENVIAR BACKEND
    // ==================================

    async function procesarArchivo(){



        if(
            !archivo ||
            empresas.length===0
        ){

            alert(
                "Debe seleccionar un archivo CSV"
            );

            return;

        }





        try{


            setProcesando(true);




            const response =

            await fetch(

                "http://localhost:3000/api/companies",

                {

                    method:"POST",


                    headers:{

                        "Content-Type":
                        "application/json"

                    },


                    body:

                    JSON.stringify({

                        nombreArchivo:
                        archivo.name,


                        empresas

                    })

                }

            );






            const data =
                await response.json();





            console.log(
                "RESPUESTA BACKEND:",
                data
            );



            setResultado(data);



        }

        catch(error){



            console.error(
                error
            );



            setResultado({

                success:false,

                error:
                "No se pudo conectar con el servidor"

            });



        }


        finally{

            setProcesando(false);

        }


    }









    return (


<div className="upload-card">



<h2>
Carga de afiliaciones
</h2>



<p>
Importa un archivo CSV para validar empresas y procesarlas en Bitrix24.
</p>





<div className="upload-zone">



<input

type="file"

accept=".csv"

onChange={seleccionarArchivo}

/>



<div>

⬆️

<h3>
Arrastra tu archivo CSV aquí
</h3>


<span>
o haz clic para seleccionar uno
</span>


</div>


</div>








{

archivo &&


<div className="file-success">

✅ Archivo seleccionado:

<b>
{archivo.name}
</b>


</div>


}








{

empresas.length > 0 &&


<>


<h3>
Vista previa
</h3>



<div className="table-container">


<table>


<thead>


<tr>


{

Object.keys(empresas[0])

.map(campo=>(

<th key={campo}>
{campo}
</th>

))


}


</tr>


</thead>




<tbody>


{

empresas

.slice(0,5)

.map(

(empresa,index)=>(


<tr key={index}>


{

Object.values(empresa)

.map(

(valor,i)=>(


<td key={i}>

{valor}

</td>


)

)


}


</tr>


)

)


}



</tbody>


</table>



</div>







<button

onClick={procesarArchivo}

disabled={procesando}


>


{

procesando

?

"⏳ Procesando..."

:

"Procesar afiliaciones"


}



</button>



</>


}









{

resultado &&


<div className="result-card">


<h3>
Resultado servidor
</h3>



{

resultado.success

?

<pre>

{

JSON.stringify(

resultado.resultado,

null,

2

)

}


</pre>


:

<p>

❌ {resultado.error}

</p>


}


</div>


}




</div>



);


}