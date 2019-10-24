// Configuración de Express
'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

// Archivos de Rutas
var project_routes = require('./routes'); 

// Middlewares - Métodos previos a la ejecución de un controlador
app.use(bodyparser.urlencoded({extended:false}));   // Convierto cualquier request entrante (Post, Put, etc)
app.use(bodyparser.json());                         // en un objeto JSON

// CORS https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS
// https://victorroblesweb.es/2018/01/31/configurar-acceso-cors-en-nodejs/
// Cuando hacemos peticiones AJAX con jQuery o Angular a un backend o un API REST es normal que tengamos 
// problemas con el acceso CORS en NodeJS y nos fallen las peticiones.
// Para eso podemos crear un middleware como este:
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Aca en lugar de * podríamos elegir los orígenes permitidos
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api', project_routes);    // '/api se antepone a las rutas quedando /api/home, /api/test, etc. Podemos omitirlo

// Exportamos el módulo
module.exports = app;