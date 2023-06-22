var express = require('express');
var router = express.Router();
const path = require('path')


router.get('/:link', function(req, res){
    const arquivos = req.params.link
    res.render(`uploads/${arquivos}/index`)
})

module.exports = router