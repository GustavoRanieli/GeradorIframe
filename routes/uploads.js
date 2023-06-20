var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/* GET home page. */
router.get('/', function (req, res) {
    res.render('uploads');
});

// Defina as rotas dentro do objeto 'router'
router.post('/teste', upload.single('pdfFile'), (req, res) => {
    const nomeArquivo = req.file.originalname;
    const nomePasta = nomeArquivo.replace('.pdf', '');
    const pastaDestino = path.join(__dirname, '..', 'public', 'uploads', nomePasta);
    const arquivoDestino = path.join(pastaDestino, nomeArquivo);

    // Cria a pasta com o nome do arquivo
    fs.mkdirSync(pastaDestino, { recursive: true });

    // Move o arquivo para a pasta
    fs.renameSync(req.file.path, arquivoDestino);

    // Cria o arquivo index.html com o embed do PDF
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Visualizar PDF</title>
        </head>
        <body>
            <embed src="/uploads/${nomePasta}/${nomeArquivo}" width="100%" height="1000px" type="application/pdf">
        </body>
        </html>
    `;

    // Cria o arquivo index.html com o embed do PDF
    const iframe = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Visualizar PDF</title>
        </head>
        <body>
            <embed src="/uploads/${nomePasta}/${nomeArquivo}" width="100%" height="1000px" type="application/pdf">
        </body>
        </html>
    `;

    fs.writeFileSync(path.join(pastaDestino, 'index.html'), html);
    fs.writeFileSync(path.join(pastaDestino, 'iframe.html'), iframe);

    res.send('Arquivo enviado com sucesso!');
});

module.exports = router;
