export function validateCompanies(data){

const errors=[];
const warnings=[];


const requiredColumns=[
"NIT",
"RAZON_SOCIAL"
];


// Validar columnas

requiredColumns.forEach(column=>{

if(!Object.keys(data[0]).includes(column)){

errors.push(
`Falta columna obligatoria: ${column}`
);

}

});


// Validar NIT repetidos

const nits=data.map(
item=>item.NIT
);


const repeated=nits.filter(
(nit,index)=>nits.indexOf(nit)!==index
);


if(repeated.length){

warnings.push(
`${repeated.length} NIT repetidos encontrados`
);

}


// Empresas sin correo

const withoutEmail=data.filter(
item=>!item.EMAIL
);


if(withoutEmail.length){

warnings.push(
`${withoutEmail.length} empresas sin correo`
);

}


return {

valid: errors.length===0,

errors,

warnings,

total:data.length

};


}