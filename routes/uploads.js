var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Array de listagem
const listArray = []


function obterListaNovamente(){
    const updatePath = path.join(__dirname, '..', 'public', 'uploads')

    // função que lê toda a pasta uploads e para cada pasta adiciona ao array
   fs.readdir(updatePath, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error('Erro ao ler as pastas:', err);
          return;
        }
        const pastas = files.filter(file => file.isDirectory()).map(file => {
            listArray.push({name: file.name, url: `/uploads/${file.name}/${file.name}.pdf`})
        });
    })
    console.log('Lista Recuperada!')
}

// Rota de recuperação da lista
router.get('/RecuperarLista', ( req, res ) => {
    obterListaNovamente()
    res.send('Lista Recuperada')
})

router.get('/lista', ( req, res ) => {
    res.render('listaPDFs')
})

// Função que adiciona um novo pdf a lista
function listPDF(pasta, nome){
    const caminho = path.join(__dirname, '..', 'views', 'listaPDFs.ejs')


    // Envia novo pdf para a lista
    listArray.push({name: nome, url: `/uploads/${pasta}/${nome}`})

    // Adiciona o novo pdf na estring com quebra de linha
    let pdfs = ''
    listArray.forEach((pdf) => {
        pdfs += `<li><a href="${pdf.url}">${pdf.name}</a></li>\n`
    });


    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Lista dos PDFs</title>
    </head>
    <body>
        <h1>Lista de Hiperlinks</h1>
        <ul>
            ${pdfs}
        </ul>
    </body>
    `
    // Reescreve o arquivo com as novas informações
    try{
        fs.writeFileSync(caminho, html); //Criar
        console.log('Lista criada!')
    } catch {
        console.log('Erro ao criar a lista')
    }
}


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

    // Adicionando a lista
    listPDF(nomePasta, nomeArquivo)

    res.send('Arquivo enviado com sucesso!');
});

module.exports = router;
