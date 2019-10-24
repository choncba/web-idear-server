'use strict'

var mongoose = require('mongoose'); // Cargo mongoose para interactuar con la BD
var Schema = mongoose.Schema;       // Defino un modelo de Schema

// Modelo para usuario en la BD
var UserSchema = Schema({
    user: String,
    password: String,
    profile: Number     // Nivel de usuario - 1 Admin (permite crear/eliminar usuarios) - 2 Sólo Edición
});

// users es el nombre de la coleccion que contiene los usuarios en la BD
module.exports = mongoose.model('users', UserSchema);    