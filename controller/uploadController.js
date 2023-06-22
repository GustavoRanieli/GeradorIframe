
const path = require('path');
const fs = require('fs');
const multer = require('multer')

class UploadController{
    criarDiretoriosPdfs(req, res){
        // Verifica se o arquivo enviado é um pdf
        if(req.file.mimetype === 'application/pdf'){
            // Retira os caracteres especiais com a exceção do ponto
            const nomeArquivo = req.file.originalname.replace(/[^a-zA-Z0-9\.]/g, '');
            // Coloca o mesmo nome na pasta e  define o caminho
            const nomePasta = nomeArquivo.replace('.pdf', '');
            const pastaDestino = path.join(__dirname, '..', 'views', 'uploads', nomePasta);
            const arquivoDestino = path.join(pastaDestino, nomeArquivo);

            // Verifica se já existe o pdf
            if(fs.existsSync(arquivoDestino)){
                res.render('pdfExistente')
            }else{
                console.log('Novo arquivo enviado')
            }
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
                <script>
                    function copiarIframe() {
                        var iframeTag = "<iframe src='http://localhost:3000/uploads/${nomePasta}/${nomeArquivo}' width='100%' height='1000px' type='application/pdf'></iframe>";
                    
                        navigator.clipboard.writeText(iframeTag)
                        .then(function() {
                            alert('A tag do iframe foi copiada para a área de transferência!');
                        })
                        .catch(function(error) {
                            console.error('Erro ao copiar a tag do iframe:', error);
                        });
                    }
                </script>
                <body>
                    <h1>Seu iframe:</h1>
                    <div>
                        <pre>
                            <code>
                                <xmp>
                                    <iframe src="http://localhost:3000/uploads/${nomePasta}/${nomeArquivo}" width="100%" height="1000px" type="application/pdf">
                                </xmp>
                            </code>
                        </pre>
                        <button onclick="copiarIframe()">Copiar Livro</button>
                        <a href="/"><button>Voltar ao inicio</button></a>
                    </div>
                    <iframe src="/uploads/${nomePasta}/${nomeArquivo}" width="100%" height="1000px" type="application/pdf">
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
                <!-- Flipbook StyleSheet -->
                <link href="/public/dflip/css/dflip.min.css" rel="stylesheet" type="text/css">
            
                <!-- Icons Stylesheet -->
                <link href="/public/dflip/css/themify-icons.min.css" rel="stylesheet" type="text/css">


                
                <body>

                <style>
                #overlay {
                position: fixed;
                display: block;
                width: 30%;
                height: 61%;
                top: 0;
                left: 0;
                right: 0;
                margin-left: 35%;
                bottom: 0;
                z-index: 2;
                cursor: pointer;
                }
            
                #text {
                position: absolute;
                top: 50%;
                left: 50%;
                font-size: 50px;
                color: white;
                transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                }
            </style>

                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12" style="padding-bottom:30px">
                            <!--Normal FLipbook-->
                            <div class="_df_book" height="600" webgl="true" 
                                    source="/views/uploads/${nomePasta}/${nomeArquivo}">
                            </div>
                            </div>
                        </div>
                    </div>
                </body>
                <script src="/public/dflip/js/libs/jquery.min.js" type="text/javascript"></script>
                <script src="/public/dflip/js/dflip.min.js" type="text/javascript"></script>
                </html>
            `;

            fs.writeFileSync(path.join(pastaDestino, 'index.ejs'), html);
            fs.writeFileSync(path.join(pastaDestino, 'iframe.html'), iframe);
            res.status(200).render('arquivoEnviado') 
        }else{
            // Retira os caracteres especiais com a exceção do ponto
            const nomeArquivo = req.file.originalname.replace(/[^a-zA-Z0-9]/g, '');
            // Apaga o arquivo que o multer moveu para o uploads
            setTimeout(() => {
                fs.unlink(path.join(__dirname, '..', 'views', 'uploads', nomeArquivo), (err) => {
                    if (err) {
                      console.error(err);
                    }
                    console.log('Arquivo excluído com sucesso!');
                });
            }, 1000)
            res.status(400).render('pdfInvalido');
        }
}}

module.exports = new UploadController;