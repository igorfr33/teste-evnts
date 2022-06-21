const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaRestaurantes = require('./routes/restaurantes');
const  rotaItems = require('./routes/items')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header', 
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Authorization'
        );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
        return res.status(200).send({});
    }

    next();
});

app.use('/restaurante', rotaRestaurantes);
app.use('/item', rotaItems)
app.use('/cadastrarestaurante', rotaRestaurantes)
app.use('/filtro', rotaRestaurantes)


app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); 
    return res.send({
        erro:{
            mensagem: error.message
        } 
    });
});

module.exports = app;