'use strict'

var User = require('../models/team_model');  // Cargo el modelo de Team de la BD
var fs = require('fs');             // Librería para el manejo de archivos de node
var path = require('path');         // método de node que permite acceder a rutas físicas de archivos

var TeamController = {
    getTeam: function(req,res){
        var memberID = req.params.id;
        //console.log(memberID);

        if(memberID == null){ // Si es null solicito todos los miembros
            // sort({slider_order:1}) ordena el array y los devuelve en el orden correcto en que se
            // tienen que visualizar en el slider                                
            User.find({}).sort({slider_order: 1}).exec((err, team_members)=>{
                if(err) return res.status(500).send({message: 'Error al devolver los datos'});

                if(!team_members) return res.status(404).send({message: 'No hay Miembros para mostrar'});

                return res.status(200).send({team_members}); // Envio los miembros
            });
        }
        else{
            User.findById(memberID, (err,team_member)=>{
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
    }
}

module.exports = TeamController;