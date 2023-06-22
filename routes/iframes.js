var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');


/* GET home page. */
// Rota para renderizar a visualização "iframes"
router.get('/', function (req, res) {

    function listarDiretorios(caminho) {
        const conteudoDiretorio = fs.readdirSync(caminho);
        const diretorios = conteudoDiretorio.filter(item => fs.statSync(path.join(caminho, item)).isDirectory());
        return diretorios;
    }

    const caminhoPublic = './views';
    const caminhoUpdate = path.join(caminhoPublic, 'uploads');

    const listaDiretorios = listarDiretorios(caminhoUpdate);
    console.log(listaDiretorios);

    res.render('iframes', { listaDiretorios });
});


module.exports = router;
