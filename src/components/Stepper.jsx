import { motion } from "framer-motion";


export default function Stepper({step}){


const steps=[
"Subir CSV",
"Validar datos",
"Procesar Bitrix"
];


return (

<div className="
flex
justify-between
mb-8
relative
">


{
steps.map((item,index)=>{


const number=index+1;

const active=number<=step;


return (

<div
key={item}
className="
flex
flex-col
items-center
z-10
"
>


<motion.div

animate={{
scale: active ? 1.1 : 1
}}

className={`
w-10
h-10
rounded-full
flex
items-center
justify-center
font-bold

${
active
?
"bg-blue-600 text-white"
:
"bg-slate-700 text-gray-400"
}

`}

>

{number}

</motion.div>


<p className="
text-sm
mt-2
">

{item}

</p>


</div>

)


})

}


</div>

)

}