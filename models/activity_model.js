'use strict'

var mongoose = require('mongoose'); // Cargo mongoose para interactuar con la BD
mongoose.pluralize(null);           // evita que mongoose pluralice con s la colección
var Schema = mongoose.Schema;       // Defino un modelo de Schema

// Modelo para team member en la BD
var ActivitySchema = Schema({
    name: String,
    position: String,
    description: String,
    picture: String,
    slider_order: Number,
    show: Boolean
});

module.exports = mongoose.model('activity', ActivitySchema); // Asocia a la coleccion 'Activities' en la BD