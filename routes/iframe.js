var express = require (express);
var router = express.router();

router.get('/iframe', function(req, res){
    res.render('iframes')
})

module.exports = router