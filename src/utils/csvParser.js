import Papa from "papaparse";


export function parseCSV(file){

return new Promise((resolve)=>{


Papa.parse(file,{

header:true,

skipEmptyLines:true,


complete:(results)=>{

resolve(results.data)

}


})


})


}