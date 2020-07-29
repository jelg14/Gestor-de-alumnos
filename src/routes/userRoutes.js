'use strict'

var express = require("express")
var UserController = require("../controllers/userController")
var md_auth = require('../middlewares/authenticated')

//RUTAS TRAZADAS

var api = express.Router();
api.post('/registrar', UserController.registrar)
api.post('/login', UserController.login)
api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario)
api.delete('/eliminar-usuario/:id', md_auth.ensureAuth, UserController.eliminarUsuario)
api.get('/mostrar-usuario/:id',md_auth.ensureAuth, UserController.obtenerUnUsuario)
module.exports = api;