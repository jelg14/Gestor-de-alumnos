'use strict'
//INPORTS
var bcrypt = require('bcrypt-nodejs')
var User = require('../models/user')
var jwt = require('../services/jwt')
var path = require('path')
var fs = require('fs')

function registrar(req, res) {
    var user = new User();
    var params= req.body

    if(params.nombre && params.password && params.email){
        user.nombre = params.nombre;
        user.usuario= params.usuario;
        user.email = params.email;
        user.rol= params.rol;

        User.find({ $or: [
            {usuario: user.usuario},
            {email: user.email}
        ]}).exec((err, users)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'})
            if(users && users.lenght >=1){
                return res.status(500).send({message: 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password, null, null,(err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el Usuario'})
                        if(usuarioGuardado){
                            res.status(200).send({user: usuarioGuardado})
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar el usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({message: 'Rellene todos los datos necesarios'})
    }

}

function login(req, res){
    var params = req.body

    User.findOne({email: params.email}, (err, usuario) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
    
        if(usuario){
            

            bcrypt.compare(params.password, usuario.password, (err, check)=> {
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(usuario) 
                        }
                        )
                    }else{
                        usuario.password = undefined;
                        return res.status(200).send({user: usuario});
                    }
                }else{
                    return res.status(400).send({message: 'el usuario no se ha podido identificar'})
                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'})
        }
    })
}

function editarUsuario(req, res){
    var userId= req.params.id
    var params = req.body;

    //BORRAR PROPIEDAD PASSWORD
    delete params.password

    User.findByIdAndUpdate(userId, params, {new: true}, (err, usuarioActualizar)=>{
        if(err)return res.status(500).send({message: 'Error en la peticion'})
        if(!usuarioActualizar)return res.status(404).send({message: 'no se ha podido editar el usuario'})

        return res.status(200).send({user: usuarioActualizar})
    })
}

function eliminarUsuario(req, res){
    var userId = req.params.id

    User.findByIdAndDelete(userId, (err, usuarioEliminar)=>{
        if(err)return res.status(500).send({message: 'Error en la peticion'})
        if(!usuarioEliminar)return res.status(404).send({message: 'no se ha podido eliminar el usuario'})

        return res.status(200).send({user: usuarioEliminar})

    }) 
}

function obtenerUnUsuario(req, res){
    var userId = req.params.id
    var params = req.body

    User.findById(userId, (err, mostrandoUsuario)=>{
        if(err) res.status(500).send({message: 'Error en la peticion'})
        if(!mostrandoUsuario) res.status(404).send({message: 'No se ha podido encontrar el usuario'})

        return res.status(200).send({user: mostrandoUsuario})
    } )
}


module.exports = {
    registrar,
    login,
    editarUsuario,
    eliminarUsuario,
    obtenerUnUsuario
}