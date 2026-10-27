/*
MAPEO COLUMNAS CSV -> CAMPOS NEGOCIACION BITRIX

clave:   nombre interno usado en el backend
alias:   nombres de columna aceptados en el CSV
         (se comparan sin tildes, mayusculas ni signos)
bitrix:  codigo del campo en Negociaciones
         (tomado de camposNegociacion.json, null = no se envia como campo)
*/


export const MAPEO_CAMPOS = [

    {
        clave:"nit",
        alias:[
            "nit",
            "nit empresa",
            "afi nit empresa",
            "nit o cedula",
            "numero de identificacion",
            "numero identificacion",
            "identificacion",
            "documento",
            "numero documento"
        ],
        // (AFI) Nit Empresa
        bitrix:"UF_CRM_1743689404"
    },

    {
        clave:"razonSocial",
        alias:[
            "razon social",
            "razonsocial",
            "nombre empresa",
            "nombre de la empresa",
            "empresa"
        ],
        // Va en el titulo de la negociacion
        bitrix:null
    },

    {
        clave:"direccion",
        alias:[
            "direccion",
            "direccion empresa",
            "direccion de la empresa"
        ],
        // Dirección de la empresa
        bitrix:"UF_CRM_1627051144"
    },

    {
        clave:"barrio",
        alias:[
            "barrio",
            "barrio o vereda",
            "afi barrio o vereda"
        ],
        // (AFI)Barrio o vereda
        bitrix:"UF_CRM_1626966414"
    },

    {
        clave:"localidad",
        alias:[
            "localidad"
        ],
        // Localidad (texto). (AFI) Localidades Bogotá es lista y requiere IDs.
        bitrix:"UF_CRM_1626966710"
    },

    {
        clave:"celular1",
        alias:[
            "celular1",
            "celular 1",
            "celular",
            "celular empresa no1",
            "celular empresa 1"
        ],
        // Celular Empresa No.1
        bitrix:"UF_CRM_1743690121"
    },

    {
        clave:"celular2",
        alias:[
            "celular2",
            "celular 2",
            "celular empresa no2",
            "celular empresa 2"
        ],
        // Celular Empresa No.2
        bitrix:"UF_CRM_1743690139"
    },

    {
        clave:"celular3",
        alias:[
            "celular3",
            "celular 3",
            "celular empresa no3",
            "celular empresa 3"
        ],
        // Celular Empresa No.3
        bitrix:"UF_CRM_1743690158"
    },

    {
        clave:"telefono",
        alias:[
            "telefono",
            "telefono afiliacion",
            "telefono empresa"
        ],
        // Telefono - afiliacion
        bitrix:"UF_CRM_1743690051"
    },

    {
        clave:"email",
        alias:[
            "email",
            "correo",
            "correo electronico",
            "correo electronico empresa",
            "e mail"
        ],
        // Correo Electronico Empresa
        bitrix:"UF_CRM_1743690187"
    },

    {
        clave:"codigoCiiu",
        alias:[
            "codigociiu",
            "codigo ciiu",
            "ciiu",
            "afi codigo ciiu"
        ],
        // (AFI) Código CIIU
        bitrix:"UF_CRM_1792446026"
    },

    {
        clave:"actividadEconomica",
        alias:[
            "actividad economica",
            "afi actividad economica"
        ],
        // (AFI) Actividad económica
        bitrix:"UF_CRM_1792511026"
    },

    {
        clave:"baseDatos",
        alias:[
            "basedatos",
            "base datos",
            "base de datos",
            "base de datos afiliacion"
        ],
        // Base de datos - Afiliacion
        bitrix:"UF_CRM_1743690427"
    },

    {
        clave:"representanteLegal",
        alias:[
            "representantelegal",
            "representante legal",
            "nombre representante legal",
            "nombre representante legal afiliacion"
        ],
        // Nombre Representante legal Afiliacion
        bitrix:"UF_CRM_1743689988"
    },

    {
        clave:"trabajadores",
        alias:[
            "trabajadores",
            "numero trabajadores",
            "numero de trabajadores",
            "afi trabajadores"
        ],
        // (AFI) # Trabajadores
        bitrix:"UF_CRM_1743689782"
    },

    {
        clave:"comentario",
        alias:[
            "comentario",
            "comentarios",
            "observaciones",
            "comentario empresa afiliacion"
        ],
        // Comentario Empresa -Afiliacion
        bitrix:"UF_CRM_1743690289"
    },

    {
        clave:"asesorId",
        alias:[
            "asesor",
            "asesorid",
            "id asesor",
            "codigo asesor",
            "numero asesor"
        ],
        // Se usa para buscar el asesor y su responsable en Bitrix
        bitrix:null
    }

];


// (AFI) Asesor: se llena con el nombre del asesor asignado
export const CAMPO_NOMBRE_ASESOR = "UF_CRM_66D62A1EDD402";


// Texto que excluye un registro de la carga
export const TEXTO_EXCLUSION = "identificacion en tramite";
