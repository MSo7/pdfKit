const { PDFDocument } = require("pdf-lib");
const { generatePdf } = require("./create");
const { options } = require("./option");

async function generateMergedPdf(files,option) {
    const promises=files.map(({file,options})=>generatePdf(file,options,true));
   let pdfData=await Promise.all(promises);
   const pdf= await PDFDocument.create();
     for(let i=0;i<pdfData.length;i++){
       const pdfBytes=await PDFDocument.load(pdfData[i]);
       const copiedPages=await pdf.copyPages(pdfBytes,pdfBytes.getPageIndices());
       copiedPages.forEach((page)=>pdf.addPage(page));
     }
     let pdfBytes=await pdf.save();
     if(option.watermark||option.indexing){
       pdfBytes=await options(pdfBytes, option);
     }
     return pdfBytes;
   }
   module.exports.generateMergedPdf = generateMergedPdf;