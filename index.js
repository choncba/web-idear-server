'use strict'

// Conexión a MongoDB
var mongoose = require('mongoose'); // Variable con la accedo a la BD

var app = require('./app'); // importamos desde app.js
var port = 3700;            // definimos el puerto del servidor

// Conexión a base de datos
var dataBaseName = "web_idear";
var dataBaseURL = "localhost";
var dataBasePort = "27017";
var dataBaseUser = "";
var dataBasePassword = "";

mongoose.Promise = global.Promise;  // Creo un objeto promesa
// Inicio la conexión con connect(url, parametros) indicando la url de la bd y el nombre de la misma
// los parametros indicados son por compatibilidad
mongoose.connect('mongodb://' + dataBaseURL + ':' + dataBasePort + '/' + dataBaseName , { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{
            console.log("Conexión a la BD establecida!");

            // Creamos el servidor
            app.listen(port, () => {
                console.log('Servidor Iniciado OK en http://' + dataBaseURL + ':' + port);
            });
        })
        .catch(err => console.log(err));