const fs = require('fs');
const path = require('path');

class IframeController {
    listarDiretorios(caminho) {
        const conteudoDiretorio = fs.readdirSync(caminho);
        const diretorios = conteudoDiretorio.filter(item => fs.statSync(path.join(caminho, item)).isDirectory());
        return diretorios;
    }

    diretorios(req, res){
    const caminhoUpdate = path.join(__dirname, '.', 'views', 'uploads');

    const listaDiretorios = listarDiretorios(caminhoUpdate);
    console.log(listaDiretorios);

    res.render('iframes', { listaDiretorios });
    } 
}

module.exports = new IframeController;