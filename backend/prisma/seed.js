import { readFileSync } from "node:fs";

import prisma from "../src/utils/prisma.js";


/*
Carga los asesores de prisma/asesores.json en la tabla Asesor.
Uso: npm run seed

- Si el asesor ya existe (mismo id) se actualiza el nombre.
- bitrixResponsableId solo se actualiza si en el JSON tiene valor,
  asi no se borra un ID que ya se haya cargado antes.
*/

const asesores = JSON.parse(
    readFileSync(
        new URL("./asesores.json", import.meta.url),
        "utf-8"
    )
);


for(const { id, nombre, bitrixResponsableId } of asesores){

    const responsable = bitrixResponsableId ?? undefined;

    await prisma.asesor.upsert({

        where:{ id },

        update:{ nombre, bitrixResponsableId:responsable },

        create:{ id, nombre, bitrixResponsableId:responsable }

    });

    console.log(
        `Asesor ${id} - ${nombre} - Bitrix: ${bitrixResponsableId ?? "pendiente"}`
    );

}


await prisma.$disconnect();
