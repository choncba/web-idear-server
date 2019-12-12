'use strict'

var mongoose = require('mongoose'); // Cargo mongoose para interactuar con la BD
mongoose.pluralize(null);           // evita que mongoose pluralice con s la colección
var Schema = mongoose.Schema;       // Defino un modelo de Schema

// Modelo para Actividades en la BD
var ActivitySchema = Schema({
    name: String,               // Nombre de la actividad
    description: String,        // Descripcion
    date: Date,                 // Fecha de creación
    date_activity: String,      // Fecha de la actividad AAAA-MM-DD (Input Date HTML5)
    pictures: Array,            // Array con los ID de las imágenes
    front_picture: Number       // Orden de la Imagen principal en el array
});

module.exports = mongoose.model('activities', ActivitySchema); // Asocia a la coleccion 'Activities' en la BD