'use strict'

var File = require('../models/file_model');

var fs = require('fs');             // Librería para el manejo de archivos de node
var path = require('path');         // método de node que permite acceder a rutas físicas de archivos

var opt = require('../globals');

var FileController = {
    // Busca una imágen por su ID en la BD y devuelve la misma
    getFile: function(req, res){
        var fileID = req.params.id;
        
        // Si no se pasa el ID se devuelve un JSON con el listado de todas las imágenes en la carpeta UPLOADS
        if(fileID == null){
            File.find({}).exec((err, files) => {
                if(err) return res.status(500).send({message: 'Error al devolver los datos'});

                if(!files) return res.status(404).send({message: 'No hay Filenes para mostrar'});

                return res.status(200).send({files}); // Envio el json con las filenes
            });
        }
        else{
            File.findById(fileID, (err, file) => {
                if(err){ return res.status(404).send({message: "No existe el archivo..."}); }
                
                //console.log(file);
                if(file){
                    var filePath = opt.UPLOAD_PATH + '\\' + file.filename;
                    //var filePath = opt.UPLOAD_PATH + '/' + file.filename; // Para el server de produccion
                    //console.log(filePath);
                    fs.exists(filePath, (exists) => {
                        if(exists){
                            console.log("Enviando el archivo...");
                            return res.sendFile(path.resolve(filePath));
                        }
                        else{
                            console.log("Archivo NO encontrado");
                            return res.status(200).send({message: "No existe el Archivo..."});
                        }
                    });
                }
                else{
                    return res.status(404).send({message: "No existe el archivo..."});
                }
            });
        }
    },
    uploadFile: function(req,res){
        console.log(req.files);
        var files = req.files.file;
        if(Array.isArray(files)){               // Si es un array, son Multiples Archivos
            var uploads = new Array();
            files.forEach((element, i) => {
                    var newFile = new File();
                    newFile.filename = element.path.split(opt.UPLOAD_PATH + '\\')[1];
                    //newFile.filename = element.path.split(opt.UPLOAD_PATH + '/')[1]; // Para el server de produccion
                    newFile.originalName = element.originalFilename;
                    newFile.created = Date.now();
                    newFile.save((err, FileStored) => {
                        if(err) console.log(err);
                    });
                    uploads[i] = newFile;
            });
            if(!uploads) return FileController.sendResponse(res, 404, "No se pudieron guardar los archivos", null);
            //console.log(uploads);
            return FileController.sendResponse(res, 200, "Subidos " + uploads.length + " archivos!", uploads);
        }
        else{               // Un solo archivo
            var newFile = new File();
            newFile.filename = files.path.split(opt.UPLOAD_PATH + '\\')[1];
            //newFile.filename = files.path.split(opt.UPLOAD_PATH + '/')[1]; // Para el server de produccion
            newFile.originalName = files.originalFilename;
            newFile.created = Date.now();
            newFile.save((err, FileStored) => {
                if(!FileStored || err) return FileController.sendResponse(res, 404, "No se pudo guardar el archivo", null);
                return FileController.sendResponse(res, 200, "Subido!", FileStored);
            });
        }
    },
    deleteFile: function(req,res){
        var fileID = req.params.id;

        File.findByIdAndDelete(fileID, (err, fileDeleted) => {
            //console.log(fileDeleted);
            if(err) return res.status(500).send({message: 'No se ha podido Borar de la BD'});
            if(!fileDeleted){
                return res.status(404).send({message: 'No existe el archivo en la BD'});
            } 
            else{
                var deleteFile = opt.UPLOAD_PATH + '\\' + fileDeleted.filename;
                //var deleteFile = opt.UPLOAD_PATH + '/' + fileDeleted.filename; // Para el server de produccion
                fs.exists(deleteFile, (exists) => {
                    if(exists){
                        fs.unlink(deleteFile, (error) => {
                            if(error) return res.status(500).send({message: 'Error al borrar en el servidor'});
                            else return res.status(200).send({file: fileDeleted});
                        });
                    }
                    else return res.status(404).send({message: 'No existe el archivo en el servidor'});
                });
            }
        });
    },
    sendResponse(response, number, msg, files){
        var rsp = {
            message: msg,
            files: files
        };

        response.status(number).send(rsp);  
    }
}

module.exports = FileController;