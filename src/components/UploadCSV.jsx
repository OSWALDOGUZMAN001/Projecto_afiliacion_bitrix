import { useState } from "react";

import Papa from "papaparse";


const API_URL = "http://localhost:3000/api/companies";


export default function UploadCSV() {


    const [archivo, setArchivo] = useState(null);

    const [empresas, setEmpresas] = useState([]);

    const [asesorId, setAsesorId] = useState("");

    const [resultado, setResultado] = useState(null);

    const [procesando, setProcesando] = useState(false);



    // ==================================
    // LIMPIAR TEXTO CSV
    // ==================================

    function limpiarTexto(valor){

        if(!valor)
            return "";

        return String(valor)
            .replace(/�/g,"")
            .trim();

    }





    // ==================================
    // LEER CSV
    // Papaparse detecta ";" o "," y respeta comillas
    // ==================================

    function leerCSV(file){


        Papa.parse(file,{

            header:true,

            skipEmptyLines:"greedy",

            encoding:"UTF-8",

            transformHeader:(header)=>
                limpiarTexto(header.replace(/^﻿/, "")),

            transform:(valor)=>
                limpiarTexto(valor),


            complete:(results)=>{


                console.log(
                    "SEPARADOR DETECTADO:",
                    results.meta.delimiter
                );


                console.log(
                    "DATOS LEIDOS:",
                    results.data
                );


                setEmpresas(results.data);

            }

        });


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

        setEmpresas([]);

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

                API_URL,

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


                        // Se usa solo si el CSV no trae columna de asesor
                        asesorId:
                        asesorId || null,


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
Importa un archivo CSV para crear negociaciones de afiliación en Bitrix24.
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

({empresas.length} registros)

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





<label className="asesor-field">

ID asesor (solo si el CSV no trae columna "asesor")

<input

type="number"

value={asesorId}

onChange={e=>setAsesorId(e.target.value)}

placeholder="Ej: 1"

/>

</label>





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
Resultado de la importación
</h3>



{

resultado.success

?

<ResumenCarga resultado={resultado.resultado} />

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









// ==================================
// RESUMEN DE LA CARGA
// ==================================

function ResumenCarga({ resultado }){


    const { resumen } = resultado;


    return (

<>


<div className="result-grid">


<div className="result-item">
<span>Creados</span>
<strong>{resumen.creados}</strong>
</div>


<div className="result-item">
<span>Omitidos (Identificación en trámite)</span>
<strong>{resumen.omitidos}</strong>
</div>


<div className="result-item">
<span>Duplicados</span>
<strong>{resumen.duplicados}</strong>
</div>


<div className="result-item">
<span>Errores</span>
<strong>{resumen.errores}</strong>
</div>


</div>




<TablaDetalle

titulo="Duplicados (no se creó negociación)"

filas={resultado.duplicados}

columnas={[
    ["fila","Fila"],
    ["nit","NIT"],
    ["razonSocial","Razón social"],
    ["asesor","Asesor"],
    ["mensaje","Mensaje"]
]}

/>



<TablaDetalle

titulo="Omitidos"

filas={resultado.omitidos}

columnas={[
    ["fila","Fila"],
    ["nit","NIT"],
    ["razonSocial","Razón social"],
    ["motivo","Motivo"]
]}

/>



<TablaDetalle

titulo="Errores"

filas={resultado.errores}

columnas={[
    ["fila","Fila"],
    ["nit","NIT"],
    ["razonSocial","Razón social"],
    ["motivo","Motivo"]
]}

/>



<TablaDetalle

titulo="Creados en Bitrix"

filas={resultado.creados}

columnas={[
    ["fila","Fila"],
    ["nit","NIT"],
    ["razonSocial","Razón social"],
    ["asesor","Asesor"],
    ["bitrixId","ID negociación"]
]}

/>



<TablaDetalle

titulo="Columnas del CSV sin mapear"

filas={resultado.columnas.noMapeadas}

columnas={[
    ["columna","Columna"],
    ["motivo","Motivo"]
]}

/>


</>

    );

}




function TablaDetalle({ titulo, filas, columnas }){


    if(!filas || filas.length === 0)
        return null;


    return (

<div className="detalle-carga">


<h4>
{titulo} ({filas.length})
</h4>


<div className="table-container">

<table>

<thead>
<tr>
{
columnas.map(([clave,nombre])=>(
<th key={clave}>{nombre}</th>
))
}
</tr>
</thead>


<tbody>
{
filas.map((fila,index)=>(
<tr key={index}>
{
columnas.map(([clave])=>(
<td key={clave}>{fila[clave]}</td>
))
}
</tr>
))
}
</tbody>

</table>

</div>


</div>

    );

}
