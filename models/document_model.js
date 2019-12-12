'use strict'

var mongoose = require('mongoose'); // Cargo mongoose para interactuar con la BD
mongoose.pluralize(null);           // evita que mongoose pluralice con s la colección
var Schema = mongoose.Schema;       // Defino un modelo de Schema

// Modelo para Documentos subidos a la BD
var DocumentSchema = Schema({
    filename: String,
    originalName: String,
    created: Date
});

module.exports = mongoose.model('document', DocumentSchema); // Asocia a la coleccion 'Activities' en la BD