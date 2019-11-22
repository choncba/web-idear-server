// Rutas del controlador
'use strict'

var express = require('express');
var UserController = require('./controllers/user_controller');
var TeamController = require('./controllers/team_controller');
var ActivityController = require('./controllers/activity_controller');

var router = express.Router();

// Agrego el módulo multiparty para gestionar la carga de archivos
var multipart = require('connect-multiparty');
var TeamUploads = multipart({uploadDir: './uploads/equipo'});  // Defino el directorio donde se agregan los archivos subidos

router.post('/login', UserController.checkUser);        // Verifico usuario/contraseña: POST a localhost:3700/api/login
                                                        // Headers- key: Content-Type value:application/json
                                                        // Body:    {
                                                        // 	            "user": "chon",
                                                        // 	            "password": "chon2185"
                                                        //          }
// Rutas para Team
router.get('/get-team', TeamController.getTeam);        // Obtengo todos los miembros: GET a localhost:3700/api/get-team
router.get('/get-team/:id', TeamController.getTeam);    // Obtengo un miembro por id: GET a localhost:3700/api/get-team/5daa097f6392d44a7b8fc3ff
router.get('/get-image/:image', TeamController.getImageFile);    // Ruta para solicitar imagenes al backend
router.post('/save-member', TeamController.saveMember);
router.put('/update-member/:id', TeamController.updateMember);
router.post('/upload-image/:id', TeamUploads, TeamController.uploadTeamMemberImage);
router.delete('/delete-member/:id', TeamController.deleteMember);
// Rutas para Activities
router.get('/get-activities', ActivityController.getActivity);  // Obtengo todas las actividades: GET a localhost:3700/api/get-activities
router.get('/get-activity/:id', ActivityController.getActivity);// Obtengo una actividad por id: GET a localhost:3700/api/get-activity/ID
router.get('/get-image/:image', TeamController.getImageFile);    // Ruta para solicitar imagenes al backend
router.post('/save-activity', TeamController.saveMember);
router.put('/update-activity/:id', TeamController.updateMember);
router.post('/upload-image/:id', TeamUploads, TeamController.uploadTeamMemberImage);
router.delete('/delete-member/:id', TeamController.deleteMember);


module.exports = router;