const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const hb = require('handlebars');
const { PDFDocument } = require('pdf-lib');




async function generatePdf(file, options,multiGenerator) {

  let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];
  if(options?.args) {
    args = options.args;
    delete options.args;
  }

  const browser = await puppeteer.launch({
    args: args
  });
  const page = await browser.newPage();

  if(file.content) {
    const template = hb.compile(file.content, { strict: true });
    const result = template(file.content);
    await page.setContent(result, {
      waitUntil: 'networkidle0', 
    });
  } else {
    await page.goto(file.url, {
      waitUntil:[ 'load', 'networkidle0'], 
    });
  }

  let pdfBytes=await Promise.props(page.pdf(options))
    .then(async function(data) {
       await browser.close();
       return Buffer.from(Object.values(data));
    })
  if((options.watermark||options.indexing)&&multiGenerator){
    pdfBytes=await options(pdfBytes, options);
  }
  return pdfBytes;
}

async function generateMultiplePdf(files,option) {
 const promises=files.map(({file,options})=>generatePdf(file,options,true));
let pdfData=await Promise.all(promises);
let optionPromise
for(let i=0;i<pdfData.length;i++){
  if(option.watermark||option.indexing){
     optionPromise(options(pdfData[i], option));
  }
  return await Promise.all(optionPromise);
}

}

module.exports.generatePdf = generatePdf;
module.exports.generateMultiplePdf = generateMultiplePdf;

