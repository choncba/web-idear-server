'use strict'

var mongoose = require('mongoose');
mongoose.pluralize(null);
var Schema = mongoose.Schema;

var FileSchema = Schema({
    filename: String,
    originalName: String,
    created: Date
});

module.exports = mongoose.model('files',FileSchema);