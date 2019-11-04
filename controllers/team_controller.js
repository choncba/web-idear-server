'use strict'

var TeamMember = require('../models/team_model');  // Cargo el modelo de Team de la BD
var fs = require('fs');             // Librería para el manejo de archivos de node
var path = require('path');         // método de node que permite acceder a rutas físicas de archivos

var TeamController = {
    getTeam: function(req,res){
        var memberID = req.params.id;
        //console.log(memberID);

        if(memberID == null){ // Si es null solicito todos los miembros
            // sort({slider_order:1}) ordena el array y los devuelve en el orden correcto en que se
            // tienen que visualizar en el slider                                
            TeamMember.find({}).sort({slider_order: 1}).exec((err, team_members)=>{
                if(err) return res.status(500).send({message: 'Error al devolver los datos'});

                if(!team_members) return res.status(404).send({message: 'No hay Miembros para mostrar'});

                return res.status(200).send({team_members}); // Envio los miembros
            });
        }
        else{
            TeamMember.findById(memberID, (err,team_member)=>{
                if(err) return res.status(500).send({message: 'Error al buscar los datos'});

                if(!team_member) return res.status(404).send({message: 'El ID no existe'});

                return res.status(200).send({team_member});
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
        var member = new TeamMember();
        var params = req.body;

        member.name = params.name;
        member.position = params.position;
        member.description = params.description;
        member.picture = null; // La asigno en el método uploadTeamMemberImage
        member.slider_order = params.slider_order;
        member.show = params.show;

        member.save((err, TeamMemberStored) => {
            if(err) return status(500).send({message:"Error al guardar el nuevo Miembro"});

            if(!TeamMemberStored) return res.status(404).send({message:"No se pudo guardar el nuevo miembro"});

            return res.status(200).send({member: TeamMemberStored});
        });
    },
    uploadTeamMemberImage: function(req,res){
                
        var TeamMemberID = req.params.id;
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

                                TeamMember.findByIdAndUpdate(TeamMemberID, {picture: fileName}, {new: true}, (err, memberUpdated) => {
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
        var memberID = req.params.id;  // Capturo el ID a actualizar
        var update = req.body;          // Capturo todo el body enviado desde la web

        TeamMember.findByIdAndUpdate(memberID, update, {new:true}, (err, memberUpdated) => { // {new: true} es para que devuelva el proyecto actualizado y no el anterior

            if(err) return res.status(500).send({message: 'Error al actualizar'});

            if(!memberUpdated) return res.status(404).send({message: 'No existe el Miembro'});

            return res.status(200).send({project: memberUpdated});
        });
    },
    // Metodo para eliminar un proyecto
    // Envío un DELETE a http://localhost:3700/api/delete-project/5d812c99f191e22018038323
    deleteMember: function(req,res){
        var memberID = req.params.id;

        TeamMember.findById

        TeamMember.findByIdAndDelete(memberID, (err, memberDeleted) => {

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

module.exports = TeamController;