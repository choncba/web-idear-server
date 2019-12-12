'use strict'

var Activity = require('../models/activity_model');  // Cargo el modelo de Activities de la BD

var ActivityController = {
    // getActivitu Busca una o varias actividades en la BD
    // GET a http://localhost:3700/api/get-activity -> Todas las actividades
    // Respuesta - Array de actividades:
    // {
    //     "activities": [
    //         {
    //             "pictures": [
    //                 "asdasdasd",
    //                 "dfsadfsdfsd",
    //                 "dfsdfsdfsdf"
    //             ],
    //             "_id": "5ddff3f70fa400101c32f5cf",
    //             "name": "Actividad 10",
    //             "description": "Descripcion de la Actividad 1",
    //             "front_picture": 0,
    //             "date": "2019-11-28T16:21:11.276Z",
    //             "date_activity": "2019-03-17",
    //             "__v": 0
    //         },
    //         {
    //             "pictures": [
    //                 "asdasdasd",
    //                 "dfsadfsdfsd",
    //                 "dfsdfsdfsdf"
    //             ],
    //             "_id": "5ddff4130fa400101c32f5d0",
    //             "name": "Actividad 115",
    //             "description": "Descripcion de la Actividad 15",
    //             "front_picture": 0,
    //             "date": "2019-11-28T16:21:39.410Z",
    //             "date_activity": "2015-10-08",
    //             "__v": 0
    //         }
    //     ]
    // }
    // GET a http://localhost:3700/api/get-activity/5ddfeabf9b2d361f782e296d -> Una sola actividad al pasar el ID
    // Respuesta:
    // {
    //     "activity": {
    //         "pictures": [
    //             "asdasdasd",
    //             "dfsadfsdfsd",
    //             "dfsdfsdfsdf"
    //         ],
    //         "_id": "5ddff4130fa400101c32f5d0",
    //         "name": "Actividad 115",
    //         "description": "Descripcion de la Actividad 15",
    //         "front_picture": 0,
    //         "date": "2019-11-28T16:21:39.410Z",
    //         "date_activity": "2015-10-08",
    //         "__v": 0
    //     }
    // }
    getActivity: function(req,res){
        var activityID = req.params.id;

        if(activityID == null){ // Si es null solicito todas las actividades
            Activity.find({}).exec((err, activities)=>{
                if(err) return res.status(500).send({message: 'Error al devolver los datos'});

                if(!activities) return res.status(404).send({message: 'No hay Actividades para mostrar'});

                return res.status(200).send({activities}); // Envio las actividades
            });
        }
        else{
            Activity.findById(activityID, (err,activityFound)=>{
                if(err) return res.status(500).send({message: 'Error al buscar los datos'});

                if(!activityFound) return res.status(404).send({message: 'El ID no existe'});

                return res.status(200).send({activity: activityFound});
            });
        }
    },
    // saveActivity - Guardo una nueva actividad en la BD
    // Con Postman envío un POST a http://localhost:3700/api/save-activity
    // Con los datos en BODY (x-www-form-urlencoded)
    // Key              value
    // name             nombre de la actividad
    // description      Descripcion de la actividad
    // pictures         ["asdasd","sdasdasda","asdsdasd"] -> Array JSON con los ID de las imagenes en la BD
    // front_picture    0 -> Número de orden en el array de la imagen correspondiente a la portada de la actividad
    // Almacenado en la BD:
    // {
    //     "_id" : ObjectId("5ddff3d20fa400101c32f5ce"),
    //     "pictures" : [ 
    //         "asdasdasd", 
    //         "dfsadfsdfsd", 
    //         "dfsdfsdfsdf"
    //     ],
    //     "name" : "Actividad 10",
    //     "description" : "Descripcion de la Actividad 1",
    //     "front_picture" : 0,
    //     "date" : ISODate("2019-11-28T16:20:34.150Z"),
    //     "date_activity" : "2019-03-17",
    //     "__v" : 0
    // }
    saveActivity: function(req,res){
        var activity = new Activity();
        var params = req.body;
        //console.log(params);   
        activity.name = params.name;
        activity.description = params.description;
        console.log("params.pictures: " + params.pictures);
        try{ activity.pictures = JSON.parse(params.pictures); }   // Verifico sea un JSON válido
        catch(e){ activity.pictures = null; }
        console.log("activity.pictures: " + activity.pictures);
        activity.front_picture = params.front_picture;
        activity.date = Date.now();
        activity.date_activity = params.date_activity;
        activity.save((err, ActivityStored) => {
            if(err) return status(500).send({message:"Error al guardar el nuevo Miembro"});

            if(!ActivityStored) return res.status(404).send({message:"No se pudo guardar el nuevo miembro"});

            return res.status(200).send({activity: ActivityStored});
        });
    },
    // Método para actualizar un proyecto de la BD
    updateActivity: function(req,res){
        
        var activityUpdate = req.body;
        var activityID = req.params.id;
        
        try{ activityUpdate.pictures = JSON.parse(activityUpdate.pictures); }  // Verifico sea un JSON válido
        catch(e){ activityUpdate.pictures = null; }      
        
        Activity.findByIdAndUpdate(activityID, activityUpdate, {new:true}, (err, activityUpdated) => { // {new: true} es para que devuelva el proyecto actualizado y no el anterior

            if(err) return res.status(500).send({message: 'Error al actualizar'});

            if(!activityUpdated) return res.status(404).send({message: 'No existe la Actividad'});

            return res.status(200).send({activity: activityUpdated});
        });
    },
    // Metodo para eliminar una actividad
    deleteActivity: function(req,res){
        var activityID = req.params.id;

        Activity.findByIdAndDelete(activityID, (err, activityDeleted) => {

            if(err) return res.status(500).send({message: 'No se ha podido Borrar'});

            if(!activityDeleted) return res.status(404).send({message: 'No existe la Actividad'});

            return res.status(200).send({activity: activityDeleted});
        });
    }
}

module.exports = ActivityController;