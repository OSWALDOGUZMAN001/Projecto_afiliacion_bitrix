import { readFileSync } from "node:fs";

import {
    MAPEO_CAMPOS,
    CAMPO_NOMBRE_ASESOR,
    TEXTO_EXCLUSION
} from "../config/mapeoCampos.js";


const CAMPOS_NEGOCIACION = JSON.parse(
    readFileSync(
        new URL("../config/camposNegociacion.json", import.meta.url),
        "utf-8"
    )
);


const CAMPOS_POR_CODIGO = new Map(
    CAMPOS_NEGOCIACION.map(campo=>[campo.codigo, campo])
);


// Tipos que se pueden enviar directamente desde texto del CSV
const TIPOS_DIRECTOS = ["string", "integer", "double", "date", "boolean"];




// ==================================
// VALIDAR QUE EL MAPEO USE CAMPOS REALES
// ==================================

for(const codigo of [
    ...MAPEO_CAMPOS.map(m=>m.bitrix).filter(Boolean),
    CAMPO_NOMBRE_ASESOR
]){

    if(!CAMPOS_POR_CODIGO.has(codigo)){

        throw new Error(
            `El campo ${codigo} no existe en Negociaciones (camposNegociacion.json)`
        );

    }

}




export function normalizar(texto){

    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

}


export function limpiar(valor){

    if(valor === undefined || valor === null){
        return "";
    }

    return String(valor).trim();

}


export function normalizarNit(valor){

    return limpiar(valor).replace(/[\s.]/g, "");

}




// Nombres visibles repetidos en Bitrix no se mapean (serian ambiguos)

const CAMPOS_POR_NOMBRE = new Map();

const NOMBRES_REPETIDOS = new Set();

for(const campo of CAMPOS_NEGOCIACION){

    const nombre = normalizar(campo.nombre);

    if(CAMPOS_POR_NOMBRE.has(nombre)){
        NOMBRES_REPETIDOS.add(nombre);
    }

    CAMPOS_POR_NOMBRE.set(nombre, campo);

}

for(const nombre of NOMBRES_REPETIDOS){
    CAMPOS_POR_NOMBRE.delete(nombre);
}


const MAPEO_POR_ALIAS = new Map();

for(const mapeo of MAPEO_CAMPOS){

    for(const alias of mapeo.alias){
        MAPEO_POR_ALIAS.set(normalizar(alias), mapeo);
    }

}




// ==================================
// RESOLVER COLUMNAS DEL CSV
// ==================================

/*
Orden de prioridad para cada columna:
1. Alias conocido (nit, razon social, celular 1...)
2. Codigo tecnico exacto de Bitrix (UF_CRM_...)
3. Nombre visible exacto de un campo de Negociaciones
*/

export function resolverColumnas(columnas){

    const mapeadas = {};

    const noMapeadas = [];


    for(const columna of columnas){

        const nombre = normalizar(columna);

        const mapeo = MAPEO_POR_ALIAS.get(nombre);


        if(mapeo){

            mapeadas[columna] = {
                clave:mapeo.clave,
                bitrix:mapeo.bitrix
            };

            continue;

        }


        const campo =
            CAMPOS_POR_CODIGO.get(limpiar(columna).toUpperCase()) ||
            CAMPOS_POR_NOMBRE.get(nombre);


        if(campo && TIPOS_DIRECTOS.includes(campo.tipo)){

            mapeadas[columna] = {
                clave:null,
                bitrix:campo.codigo
            };

            continue;

        }


        noMapeadas.push({
            columna,
            motivo: campo
                ? `Campo ${campo.codigo} es de tipo ${campo.tipo} y no se puede llenar desde texto`
                : "No coincide con ningún campo de Negociaciones"
        });

    }


    return { mapeadas, noMapeadas };

}




function convertirValor(valor, tipo){

    if(tipo === "integer" || tipo === "double"){

        const numero = Number(valor.replace(/[\s.,](?=\d{3}\b)/g, "").replace(",", "."));

        return Number.isFinite(numero) ? numero : null;

    }

    if(tipo === "boolean"){

        return ["si", "s", "y", "yes", "1", "true"].includes(normalizar(valor)) ? "Y" : "N";

    }

    return valor;

}




// ==================================
// MAPEAR UNA FILA
// ==================================

export function mapearFila(fila, columnasMapeadas){

    const datos = {};

    const camposBitrix = {};


    for(const [columna, destino] of Object.entries(columnasMapeadas)){

        const valor = limpiar(fila[columna]);

        if(!valor){
            continue;
        }


        if(destino.clave && datos[destino.clave] === undefined){
            datos[destino.clave] = valor;
        }


        if(destino.bitrix && camposBitrix[destino.bitrix] === undefined){

            const campo = CAMPOS_POR_CODIGO.get(destino.bitrix);

            const convertido = convertirValor(valor, campo.tipo);

            if(convertido !== null){
                camposBitrix[destino.bitrix] = convertido;
            }

        }

    }


    // NIT sin puntos ni espacios, igual en la base local y en Bitrix

    if(datos.nit){

        datos.nitOriginal = datos.nit;

        datos.nit = normalizarNit(datos.nit);

        const campoNit = MAPEO_CAMPOS.find(m=>m.clave === "nit").bitrix;

        camposBitrix[campoNit] = datos.nit;

    }


    return { datos, camposBitrix };

}




export function tieneExclusion(fila){

    return Object.values(fila).some(
        valor=>normalizar(valor).includes(TEXTO_EXCLUSION)
    );

}


export { CAMPO_NOMBRE_ASESOR };
