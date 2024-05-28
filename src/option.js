const { PDFDocument,rgb } = require("pdf-lib");
const fs=require("fs");

async function options(pdf,{watermark,indexing}) {
    const pdfDoc=await PDFDocument.load(pdf);
    let watermarkImage
    if(watermark?.src||watermark?.imageBuffer){
      if(watermark?.src)watermark.imageBuffer=fs.readFileSync(watermark.src);
        watermarkImage=await pdfDoc.embedPng(watermark.imageBuffer);
    }
   for(let i=0;i<pdfDoc.getPageCount();i++){
    const pageCount=i+1;
    const page=pdfDoc.getPage(i);
    if(watermark?.imageBuffer||watermark?.text){
    if(watermarkImage){
      page.drawImage(watermarkImage, {x:watermark.xAxis||50, y:watermark.yAxis||200, width:watermark.width||200, height:watermark.height||100,opacity:watermark.opacity||0.5});
    }
    if(watermark.text){
      page.drawText(watermark.text, {x:watermark.xAxis||50, y:watermark.yAxis||200, size:watermark.size||200, opacity:watermark.opacity||0.5,color:rgb(watermark?.color?.r||0,watermark?.color?.g||0,watermark?.color?.b||0)});
    }
  }
      if(indexing&&!indexing.exclude.includes(pageCount)){
        page.drawText(indexing.text.replace("pageCount",pageCount), {x:indexing.xAxis||250, y:indexing.yAxis||20, size:indexing.fontSize||10, color:rgb(indexing?.color?.r||0, indexing?.color?.g||0,indexing?.color?.b||0)});
      }
    }
  
    let pdfBuf=await pdfDoc.save()
    return Buffer.from(pdfBuf);
  }

  module.exports.options = options;