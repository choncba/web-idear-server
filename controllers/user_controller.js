'use strict'

var User = require('../models/user_model');  // Cargo el modelo de User de la BD
var fs = require('fs');             // Librería para el manejo de archivos de node
var path = require('path');         // método de node que permite acceder a rutas físicas de archivos

var userOK = {
    valid: false,
    profile: 0
};

var UserController = {
    checkUser: function(req,res){
        var data = req.body;
        console.log('Recibido desde el Front-End -> Usuario: ' + data.user + ' Password: ' + data.password);

        userOK.valid = false;
        userOK.profile = 0;

        // Busco toda la lista de usuarios en la BD
        User.find({},(err, user)=>{
            if(err) return res.status(500).send({message: 'Error al buscar los datos'});

            if(!user) return res.status(404).send({message: 'No hay usuarios registrados'});

            console.log('Usuarios en la BD:');
            console.log(user);
            
            // recorro los usuarios de la BD verificando usuario y pass recibido del front-end
            user.forEach(element => {
                if(element.user == data.user && element.password == data.password){
                    // Si coinciden respondo con true y el id
                    userOK.valid = true;
                    userOK.profile = element.profile;
                    console.log('Usuario válido: ' + element.user + ' Password: ' + element.password + ' nivel: ' + element.profile);
                    return res.status(200).send({ 
                                                    logged: true,
                                                    id: element._id
                                                });
                }
            });
            
            if(!userOK.valid){
                return res.status(200).send({ 
                    logged: false,
                    id: ""
                });
            }
            
        });
    },
    updateUser: function(req,res){
        return res.status(200).send({message: "funcion updateUser"});
    },
    saveUser: function(req,res){
        return res.status(200).send({message: "funcion saveUser"});
    },
    updateUser: function(req,res){
        return res.status(200).send({message: "funcion deleteUser"});
    }
}

module.exports = UserController, userOK;
//module.exports = userOK;