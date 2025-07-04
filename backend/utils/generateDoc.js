const docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require("path")


const generate = async(req,res)=>{

    if(!req.body.entiteAdmin || !req.body.date || !req.body.items || req.body.decharge == undefined || req.body.decharge == null)
        return res.status(403).send("all fields required");

const dechrgeTemplatePath = path.resolve(__dirname,'../public/DECHARGE.docx');
const repriseTemplatePath = path.resolve(__dirname,'../public/REPRISE.docx');
const content = fs.readFileSync(req.body.decharge?dechrgeTemplatePath:repriseTemplatePath, 'binary');


const zip = new PizZip(content);


const doc = new docxtemplater(zip, { paragraphLoop: true });


const data = {
    entiteAdministrative: req.body.entiteAdmin,
    date : req.body.date.replaceAll('-','/'),
    items: req.body.items
};

doc.setData(data);

try {
    doc.render();
} catch (error) {
    console.log(error);
}

const buf = doc.getZip().generate({ type: 'nodebuffer' });


res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
res.setHeader('Content-Disposition', 'attachment; filename=generated_document.docx');


res.send(buf);
}

module.exports = generate