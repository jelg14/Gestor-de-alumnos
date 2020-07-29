'use strict'
var express = require("express")
var md_auth = require('../middlewares/authenticated')
var cursoController = require('../controllers/cursoController')

//RUTAS TRAZADAS
var api = express.Router();
api.post('/agregar-curso', md_auth.ensureAuth, cursoController.addCurso)
api.get('/encuestas', md_auth.ensureAuth, cursoController.getCurso)
api.put('/editar-curso/:Id', md_auth.ensureAuth, cursoController.editarCurso)
api.delete('/eliminar-curso/:idCurso', md_auth.ensureAuth, cursoController.eliminarCurso)
api.put('/agregar-alumno/:id', md_auth.ensureAuth, cursoController.agregarAlumno)
module.exports = api;