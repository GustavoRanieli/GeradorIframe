
const path = require('path');
const fs = require('fs');

class UploadController{

    criarDiretoriosPdfs(req, res){
    const nomeArquivo = req.file.originalname;
    const nomePasta = nomeArquivo.replace('.pdf', '');
    const pastaDestino = path.join(__dirname, '..', 'views', 'uploads', nomePasta);
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
    <script>
        function copiarIframe() {
            var iframeTag = "<iframe src='/uploads/${nomePasta}/${nomeArquivo}' width='100%' height='1000px' type='application/pdf'></iframe>";
        
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
                        <iframe src="/uploads/${nomePasta}/${nomeArquivo}" width="100%" height="1000px" type="application/pdf">
                    </xmp>
                </code>
            </pre>
            <button onclick="copiarIframe()">Copiar Livro</button>
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

    res.send('Arquivo enviado com sucesso!')
    }

}

module.exports = new UploadController;