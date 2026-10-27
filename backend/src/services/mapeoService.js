import { readFileSync } from "node:fs";

import {
    MAPEO_CAMPOS,
    COLUMNAS_NO_ENVIAR,
    SINONIMOS_LISTAS,
    CAMPO_NOMBRE_ASESOR,
    TEXTO_EXCLUSION,
    TEXTO_EXCLUSION_NIT
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




const MAPEO_POR_ALIAS = new Map();

for(const mapeo of MAPEO_CAMPOS){

    for(const alias of mapeo.alias){
        MAPEO_POR_ALIAS.set(normalizar(alias), mapeo);
    }

}


const NO_ENVIAR = new Set(COLUMNAS_NO_ENVIAR.map(normalizar));


export const CODIGOS_LISTA = MAPEO_CAMPOS
    .map(m=>m.bitrix)
    .filter(codigo=>codigo && CAMPOS_POR_CODIGO.get(codigo).tipo === "enumeration");




// ==================================
// RESOLVER COLUMNAS DEL ARCHIVO
// ==================================

export function resolverColumnas(columnas){

    const mapeadas = {};

    const ignoradas = [];

    const noMapeadas = [];


    for(const columna of columnas){

        const nombre = normalizar(columna);

        const mapeo = MAPEO_POR_ALIAS.get(nombre);


        if(mapeo){

            mapeadas[columna] = {
                clave:mapeo.clave,
                bitrix:mapeo.bitrix
            };

        }
        else if(NO_ENVIAR.has(nombre)){

            ignoradas.push(columna);

        }
        else{

            noMapeadas.push(columna);

        }

    }


    return { mapeadas, ignoradas, noMapeadas };

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

/*
datos:         valores por clave interna (para la base local)
camposBitrix:  campos listos para enviar
valoresLista:  campos de lista (codigo -> texto), se traducen a ID despues
*/

export function mapearFila(fila, columnasMapeadas){

    const datos = {};

    const camposBitrix = {};

    const valoresLista = {};


    for(const [columna, destino] of Object.entries(columnasMapeadas)){

        const valor = limpiar(fila[columna]);

        if(!valor){
            continue;
        }


        if(datos[destino.clave] === undefined){
            datos[destino.clave] = valor;
        }


        if(!destino.bitrix){
            continue;
        }


        const campo = CAMPOS_POR_CODIGO.get(destino.bitrix);


        if(campo.tipo === "enumeration"){

            valoresLista[destino.bitrix] ??= valor;

            continue;

        }


        if(camposBitrix[destino.bitrix] === undefined){

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


    return { datos, camposBitrix, valoresLista };

}




export function tieneExclusion(fila, datos){

    if(normalizar(datos.nitOriginal).includes(TEXTO_EXCLUSION_NIT)){
        return true;
    }

    return Object.values(fila).some(
        valor=>normalizar(valor).includes(TEXTO_EXCLUSION)
    );

}




// ==================================
// TEXTO -> ID DE OPCION EN LISTAS BITRIX
// ==================================

// "UBATE (CUNDINAMARCA)" -> "ubate", "BOGOTA D.C." -> "bogota"
function variantes(texto){

    const base = normalizar(texto);

    const sinParentesis = normalizar(String(texto).replace(/\(.*?\)/g, ""));

    const sinDc = sinParentesis.replace(/\bd c\b/g, "").trim();

    return [
        base,
        sinParentesis,
        sinDc,
        base.replace(/ /g, ""),
        ...(SINONIMOS_LISTAS[base] || [])
    ].filter(Boolean);

}


export function buscarOpcionLista(valor, opciones){

    const buscadas = new Set(variantes(valor));


    for(const opcion of opciones){

        if(variantes(opcion.VALUE).some(v=>buscadas.has(v))){
            return opcion.ID;
        }

    }


    return null;

}


export function nombreCampo(codigo){

    return CAMPOS_POR_CODIGO.get(codigo)?.nombre || codigo;

}


export { CAMPO_NOMBRE_ASESOR };
