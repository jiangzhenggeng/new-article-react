
var indexTpl
if( process.env.NODE_ENV !== 'production'){
	indexTpl = require('./index.html')
}else{
	indexTpl = require('raw-loader!./index.php3')
}


module.exports = indexTpl




