import Fastify from "fastify";
import cors from "@fastify/cors";

import companiesRoutes from "../routes/companies.js";


const app = Fastify({
    logger:true
});


// permitir Astro

await app.register(cors,{
    origin:true
});


// rutas

app.register(
    companiesRoutes,
    {
        prefix:"/api/companies"
    }
);



app.get("/",async()=>{

return {
    status:"API funcionando",
    app:"Afiliaciones Bitrix"
}

});



app.listen({

port:3000,
host:"0.0.0.0"

})
.then(()=>{

console.log(
"Servidor backend activo puerto 3000"
);

});