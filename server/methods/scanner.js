
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
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs';
import path from 'path';

Meteor.methods({
  /**
   * scan.saveImage(dataURL)
   * - dataURL: string "data:image/jpeg;base64,..."
   * Returns { url: "/uploads/filename.jpg", name, size }
   */
  'scan.saveImage'(dataURL) {
    check(dataURL, String);

    // Optionnel : contrôle d'auth si nécessaire
    // if (!this.userId) throw new Meteor.Error('not-authorized');

    // Validation basique
    const matches = dataURL.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
    if (!matches) {
      throw new Meteor.Error('invalid-data', 'Format de l\'image non supporté.');
    }

    const mime = matches[1]; // ex: image/jpeg
    const ext = mime.includes('png') ? 'png' : 'jpg';
    const base64Data = matches[3];
    const buffer = Buffer.from(base64Data, 'base64');

    // Limite la taille (ex: 10MB)
    const MAX_BYTES = 10 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      throw new Meteor.Error('file-too-large', 'Fichier trop volumineux.');
    }

    // Prépare le dossier public/uploads (doit exister ou on le crée)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}_${Random.id(6)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Écriture synchrone (simple). Pour plus de robustesse, utiliser writeFile (async).
    try {
      fs.writeFileSync(filePath, buffer);
    } catch (e) {
      throw new Meteor.Error('write-failed', 'Impossible d\'écrire le fichier: ' + e.message);
    }

    // URL publique (Meteor sert tout ce qui est dans /public)
    const publicUrl = Meteor.absoluteUrl(`uploads/${filename}`);

    return {
      url: publicUrl,
      name: filename,
      size: buffer.length
    };
  },

  /**
   * Optionnel : méthode pour convertir en PDF ou lancer OCR.
   * Exemple commenté ci-dessous (activer seulement si tu installes les packages nécessaires).
   */
  // 'scan.convertToPdf'(imageRelativePath) { ... }
});
