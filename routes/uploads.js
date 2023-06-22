var express = require('express');
var router = express.Router();
const multer = require('multer');
const uploadController = require('../controller/uploadController');

// processamento dos dados de formulário enviados pelo cliente (pdfs)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'views/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage })


/* Rota inicial de uploads, renderiza o formulario de envio de arquivos */
router.get('/', function (req, res) {
    res.render('uploads');
});

router.get('/:pasta/:pdf', ( req, res ) =>  {
    let pasta = req.params.pasta;
    let pdf = req.params.pdf;
    pdf.replace('.pdf', '.html')
    res.sendFile(`D:/Recursos/GeradorIframe2/views/uploads/${pasta}/iframe.html`);
})


/* Cria diretorios para cada pdf e Envia os pdfs para dentro do projeto */
router.post('/pdfupload', upload.single('pdfFile'), uploadController.criarDiretoriosPdfs );

module.exports = router;
