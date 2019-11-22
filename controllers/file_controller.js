'use strict'

var Activity = require('../models/activity_model');  // Cargo el modelo de Activities de la BD
var fs = require('fs');             // Librería para el manejo de archivos de node
var path = require('path');         // método de node que permite acceder a rutas físicas de archivos

var FileController = {
    // Método para enviar un archivo de imágen al front-end
    getImage: function(req, res){
        var file = req.params.image;
        var path_file = './uploads/equipo/'+file;
        console.log(file);

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }
            else{
                return res.status(200).send({message: "No existe la imagen..."});
            }
        });
    },
    uploadImage: function(req,res){
                
        var ActivityID = req.params.id;
        var filePath = req.files.image.path;
        var originalName = "";
        originalName = req.files.image.name;
        var fileName = "No hay imágen!";
        var fileExtension = "";
        var extensions = ['png','jpg','jpeg','bmp','png'];
        var validExtension = false;

        if(req.files){
            fileName = req.files.image.path.split('\equipo\\')[1];
            fileExtension = fileName.split('.')[1].toLowerCase();

            console.log("originalName: " + originalName);
            console.log("filePath: " + filePath);
            console.log("fileName: " + fileName);
            console.log("fileExtension: " + fileExtension + " Type: " + typeof fileExtension);
            
            for(var i in extensions){
                if(fileExtension == extensions[i])
                {
                    validExtension = true;
                }
            }

            if(validExtension){
                var newPath = 'uploads\\equipo\\' + originalName;
                fs.exists(newPath, (exists) => {
                    if(exists){
                        //console.log('El archivo ' + newPath + ' ya existe!');
                    }
                    else{
                        fs.rename(filePath, newPath, (err) => {
                            if(err){
                                //console.log('No se pudo cambiar el nombre, se mantiene ' + fileName);
                                //console.log(err);
                            }
                            else{
                                //console.log("Original: " + fileName);
                                fileName = originalName;
                                //console.log("Nuevo: " + fileName);

                                Activity.findByIdAndUpdate(ActivityID, {picture: fileName}, {new: true}, (err, memberUpdated) => {
                                    //console.log("Miembro Actualizado:");
                                    //console.log(memberUpdated);
                                    
                                    if(err) return res.status(500).send({message: 'No se pudo guardar la imagen!'});
                    
                                    if(!memberUpdated) return res.status(404).send({message: 'No se encuentra el ID!'});
                    
                                    return res.status(200).send({member: memberUpdated});
                                });
                            }
                        });
                    }
                });
            }
            else{
                fs.unlink(filePath, (err) => {  // fs.unlink Borra el archivo subido y envia respuesta
                    return res.status(200).send({message: 'La extensión no es válida'});
                });
            }
        }
        else{
            return res.status(200).send({message: 'No se subió el archivo!'});
        }
    },
    deleteImage: function(req,res){

    }
}

module.exports = ActivityController;