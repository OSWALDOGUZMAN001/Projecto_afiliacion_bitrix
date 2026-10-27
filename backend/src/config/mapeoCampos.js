/*
MAPEO COLUMNAS EXCEL/CSV -> CAMPOS NEGOCIACION BITRIX
Fuente: listado "CAMPOS CAMARA DE COMERCIO" (columna EXCEL -> BITRIX)

clave:   nombre interno usado en el backend
alias:   nombres de columna aceptados
         (se comparan sin tildes, mayusculas ni signos)
bitrix:  codigo del campo en Negociaciones (camposNegociacion.json)
         null = no se envia como campo personalizado
*/


export const MAPEO_CAMPOS = [

    {
        clave:"nit",
        alias:[ "identificacion", "nit" ],
        // (AFI) Nit Empresa
        bitrix:"UF_CRM_1743689404"
    },

    {
        clave:"razonSocial",
        alias:[ "razon social" ],
        // Nombre de la negociacion (TITLE)
        bitrix:null
    },

    {
        clave:"direccion",
        alias:[ "direccion" ],
        // (AFI) Dirección Principal
        bitrix:"UF_CRM_689A6EA8628FD"
    },

    {
        clave:"ciudad",
        alias:[ "ciudad o municipio", "ciudad", "municipio" ],
        // (AFI) Municipios Cundinamarca (lista)
        bitrix:"UF_CRM_1765813289"
    },

    {
        clave:"celular",
        alias:[ "celular" ],
        // (AFI) Celular representante legal
        bitrix:"UF_CRM_689A6F60D4741"
    },

    {
        clave:"telefono1",
        alias:[ "telefono1", "telefono 1" ],
        // (AFI) Teléfono Principal
        bitrix:"UF_CRM_689A6EBCED65C"
    },

    {
        clave:"telefono2",
        alias:[ "telefono2", "telefono 2" ],
        // (AFI) Teléfono de contacto
        bitrix:"UF_CRM_1724949638"
    },

    {
        clave:"email",
        alias:[ "correo electronico", "correo", "email" ],
        // AF- Correo electrónico
        bitrix:"UF_CRM_1724949520"
    },

    {
        clave:"codigoCiiu",
        alias:[ "ciiu", "codigo ciiu" ],
        // (AFI) Código CIIU
        bitrix:"UF_CRM_1792446026"
    },

    {
        clave:"actividadEconomica",
        alias:[ "actividad economica" ],
        // (AFI) Actividad económica
        bitrix:"UF_CRM_1792511026"
    },

    {
        clave:"trabajadores",
        alias:[ "cantidad personal", "trabajadores" ],
        // (AFI) # Trabajadores
        bitrix:"UF_CRM_1743689782"
    },

    {
        clave:"tipoDocumentoRepLegal",
        alias:[ "tipo identificacion rep legal" ],
        // (AFI) Tipo de documento del representante legal (lista)
        bitrix:"UF_CRM_689A6F23A4B57"
    },

    {
        clave:"documentoRepLegal",
        alias:[ "numero identificacion rep legal" ],
        // AF- Cédula del representante legal
        bitrix:"UF_CRM_1729290001"
    },

    {
        clave:"representanteLegal",
        alias:[ "representante legal" ],
        // (AFI) Nombre de representante legal
        bitrix:"UF_CRM_689A6F0F28F61"
    },

    {
        clave:"asesor",
        alias:[ "asesor", "id asesor", "codigo asesor" ],
        // Nombre o ID del asesor: define el responsable en Bitrix
        bitrix:null
    }

];


// Columnas marcadas "NO" en el listado: se leen pero no se envian a Bitrix
export const COLUMNAS_NO_ENVIAR = [
    "matricula",
    "tipo de identificacion",
    "digito de verificacion",
    "organizacion juridica",
    "categoria",
    "estado matricula",
    "fecha constitucion",
    "fecha matricula",
    "ano matricula",
    "fecha ultima renovacion",
    "ano ultima renovacion",
    "clasificacion",
    "activo total",
    "capital pagado",
    "origen empresa",
    "fecha entrega",
    "fecha actualizacion nit",
    "estado nit"
];


// Abreviaturas de documento -> textos con los que pueden aparecer en la lista de Bitrix
export const SINONIMOS_LISTAS = {
    "c c":[ "cedula de ciudadania", "cedula", "cc" ],
    "c e":[ "cedula de extranjeria", "ce" ],
    "p p":[ "pasaporte", "pp" ],
    "t i":[ "tarjeta de identidad", "ti" ],
    "n i t":[ "nit" ],
    "p e p":[ "permiso especial de permanencia", "pep" ],
    "p p t":[ "permiso por proteccion temporal", "ppt" ]
};


// (AFI) Asesor: se llena con el nombre del asesor asignado
export const CAMPO_NOMBRE_ASESOR = "UF_CRM_66D62A1EDD402";


// Un registro se excluye si la Identificacion dice "en tramite"
// o si cualquier columna dice "identificacion en tramite"
export const TEXTO_EXCLUSION = "identificacion en tramite";

export const TEXTO_EXCLUSION_NIT = "tramite";
