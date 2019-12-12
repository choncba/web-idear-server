'use strict'

// Conexión a MongoDB
var mongoose = require('mongoose'); // Variable con la accedo a la BD
mongoose.set('useFindAndModify', false);

var app = require('./app'); // importamos desde app.js

var opt = require('./globals');

mongoose.Promise = global.Promise;  // Creo un objeto promesa
// Inicio la conexión con connect(url, parametros) indicando la url de la bd y el nombre de la misma
// los parametros indicados son por compatibilidad
mongoose.connect('mongodb://' + opt.dataBaseURL + ':' + opt.dataBasePort + '/' + opt.dataBaseName , { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{
            console.log("Conexión a la BD establecida!");

            // Creamos el servidor
            app.listen(opt.serverPort, () => {
                console.log('Servidor Iniciado OK en http://' + opt.dataBaseURL + ':' + opt.serverPort);
            });
        })
        .catch(err => console.log(err));