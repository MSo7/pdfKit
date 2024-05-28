const { generatePdf, generateMultiplePdf } = require("./src/create");
const { generateMergedPdf } = require("./src/merge");

async function create(file,option){
    if(Array.isArray(file))
        return generateMultiplePdf(file, option)
    else
        return generatePdf(file, option)
}
async function mergePdfAsync(files,option){
    if(Array.isArray(files))
        return generateMergedPdf(files, option)
    else throw  new Error('File must be array')
}


module.exports = { create,mergePdfAsync }