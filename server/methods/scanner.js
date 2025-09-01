
/* import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

Meteor.methods({
  convertToPDF(imagePath) {
    const pdfPath = `${process.env.PWD}/.meteor/local/build/programs/server/tmp/doc_${Date.now()}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(createWriteStream(pdfPath));
    doc.image(imagePath, 0, 0, { fit: [600, 800] });
    doc.end();

    return pdfPath;
  }
});
 */