import {
CheckCircle,
AlertTriangle,
XCircle
} from "lucide-react";


export default function ValidationResult({
result
}){


if(!result)
return null;



return (

<div className="
mt-6
bg-slate-950
rounded-xl
p-6
">


<h3 className="
text-xl
font-bold
mb-4
">
Resultado análisis
</h3>



<div className="
grid
grid-cols-3
gap-4
">


<div className="
bg-blue-900/30
p-4
rounded-lg
">

<p>
Registros
</p>

<h2 className="text-3xl font-bold">
{result.total}
</h2>

</div>




<div className="
bg-yellow-900/30
p-4
rounded-lg
">

<AlertTriangle/>

<p>
Advertencias
</p>

<h2 className="text-3xl font-bold">
{result.warnings.length}
</h2>


</div>





<div className="
bg-red-900/30
p-4
rounded-lg
">

<XCircle/>

<p>
Errores
</p>

<h2 className="text-3xl font-bold">
{result.errors.length}
</h2>


</div>



</div>



{
result.valid ?

<div className="
mt-5
flex
items-center
gap-2
text-green-400
">

<CheckCircle/>

Archivo listo para procesar

</div>


:

<div className="
mt-5
text-red-400
">

Archivo con errores

</div>

}



</div>

)

}