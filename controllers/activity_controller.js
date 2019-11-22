'use strict'

var Activity = require('../models/activity_model');  // Cargo el modelo de Activities de la BD
var fs = require('fs');             // Librería para el manejo de archivos de node
var path = require('path');         // método de node que permite acceder a rutas físicas de archivos

var ActivityController = {
    getActivity: function(req,res){
        var activityID = req.params.id;
        //console.log(activityID);

        if(activityID == null){ // Si es null solicito todas las actividades
            Activity.find({}).exec((err, activities)=>{
                if(err) return res.status(500).send({message: 'Error al devolver los datos'});

                if(!activities) return res.status(404).send({message: 'No hay Actividades para mostrar'});

                return res.status(200).send({activities}); // Envio las actividades
            });
        }
        else{
            Activity.findById(activityID, (err,activity)=>{
                if(err) return res.status(500).send({message: 'Error al buscar los datos'});

                if(!activity) return res.status(404).send({message: 'El ID no existe'});

                return res.status(200).send({activity});
            });
        }
    },
    // Método para enviar un archivo de imágen al front-end
    getImageFile: function(req, res){
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
    saveMember: function(req,res){
        var member = new Activity();
        var params = req.body;

        member.name = params.name;
        member.position = params.position;
        member.description = params.description;
        member.picture = null; // La asigno en el método uploadActivityImage
        member.slider_order = params.slider_order;
        member.show = params.show;

        member.save((err, ActivityStored) => {
            if(err) return status(500).send({message:"Error al guardar el nuevo Miembro"});

            if(!ActivityStored) return res.status(404).send({message:"No se pudo guardar el nuevo miembro"});

            return res.status(200).send({member: ActivityStored});
        });
    },
    uploadActivityImage: function(req,res){
                
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
    // Método para actualizar un proyecto de la BD
    // Envío un PUT http://localhost:3700/api/update-project/5d812c99f191e22018038323
    // Con los datos a actualizar en body
    updateMember: function(req,res){
        var activityID = req.params.id;  // Capturo el ID a actualizar
        var update = req.body;          // Capturo todo el body enviado desde la web

        Activity.findByIdAndUpdate(activityID, update, {new:true}, (err, memberUpdated) => { // {new: true} es para que devuelva el proyecto actualizado y no el anterior

            if(err) return res.status(500).send({message: 'Error al actualizar'});

            if(!memberUpdated) return res.status(404).send({message: 'No existe el Miembro'});

            return res.status(200).send({member: memberUpdated});
        });
    },
    // Metodo para eliminar un proyecto
    // Envío un DELETE a http://localhost:3700/api/delete-project/5d812c99f191e22018038323
    deleteMember: function(req,res){
        var activityID = req.params.id;

        Activity.findById

        Activity.findByIdAndDelete(activityID, (err, memberDeleted) => {

            var deleteFile = 'uploads\\equipo\\' + memberDeleted.picture;

            fs.unlink(deleteFile, (error) => {
                console.log(err);
            });

            if(err) return res.status(500).send({message: 'No se ha podido Borar'});

            if(!memberDeleted) return res.status(404).send({message: 'No existe el Miembro'});

            return res.status(200).send({member: memberDeleted});
        });
    }
}

module.exports = ActivityController;