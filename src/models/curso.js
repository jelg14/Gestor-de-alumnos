'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var CursoSchema = Schema({
    nombre: String,
    alumnos: {
        agregados: Number,
        alumnosInscritos: []
    },
    profesor: String

})

module.exports = mongoose.model('curso', CursoSchema)