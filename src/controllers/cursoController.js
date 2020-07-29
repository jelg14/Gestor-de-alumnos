'user strict'

var Curso = require('../models/curso')
var Maestro = require('../models/user')
    // -----------------------------------------------FUNCIONES PARA CONTROL CURSOS DE MAESTRO
function addCurso(req, res) {
    var curso = new Curso()
    var params = req.body

    if (params.nombre) {
        curso.nombre = params.nombre,
            curso.Alumnos = {
                agregados: 0,
                alumnosInscritos: []
            };
        curso.profesor = req.user.nombre;
        console.log(req.user)
        if (req.user.rol == 'ROLE_MAESTRO') {
            
            curso.save((err, cursoGuardado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de Curso' })
                if (!cursoGuardado) res.status(404).send({ message: 'Error al agregar Curso' })

                return res.status(200).send({ CursoNuevo: cursoGuardado })
            })
        } else {
            return res.status(500).send({ message: 'No posee permisos para crear un curso' })
        }
    } else {
        res.status(200).send({ message: 'Rellene todos los datos necesarios' })
    }
}

function getCurso(req, res) {
    if (req.user.rol === 'ROLE_MAESTRO') {
        Curso.find().populate('maestro').exec((err, cursos) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de Encuesta' })
            if (!cursos) res.status(404).send({ message: 'Error al listar las encuestas' })

            return res.status(200).send({ Cursos_disponibles: cursos })
        })
    } else {
        return res.status(500).send({ message: 'No posee permisos para ver los cursos' })

    }

}

function editarCurso(req, res) {
    var cursoId = req.params.Id
    var params = req.body

    if (req.user.rol = 'ROLE_MAESTRO') {

        Curso.findByIdAndUpdate(cursoId, params, { new: true }, (err, cursoActualizado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!cursoActualizado) return res.status(404).send({ message: 'El curso no esta disponible' })

            return res.status(200).send({ curso: cursoActualizado })
        })
    } else {
        return res.status(500).send({ message: 'No tiene autorizado para editar el curso' })
    }

}

function eliminarCurso(req,res) {
    var idCurso = req.params.id

    if (req.user.rol == 'ROLE_MAESTRO') {
        Curso.findByIdAndDelete(idCurso, (err, cursoEliminado) =>{
            console.log(idCurso)
            if(err) return res.status(500).send({message: 'error en la peticion'})
            if (!cursoEliminado) return res.status(404).send({message:'no se ha podido eliminar el curso'})

            return res.status(200).send({Curso_eliminado: cursoEliminado})
        })
    } else {
        return res.status(500).send({ message: 'No tiene autorizado para eliminar el curso' })

    }
}

/*function eliminarCurso(req, res) {
    if (req.user.rol = 'ROLE_MAESTRO') {

        Curso.findByIdAndDelete(req.params.cursoId, (err, cursoEliminado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!cursoEliminado) return res.status(404).send({ message: 'no se ha podido eliminar el curso' })
    
            return res.status(200).send({ cursoYaEliminado: cursoEliminado })
    
        })
    } else {
        return res.status(500).send({ message: 'No tiene autorizado para eliminar el curso' })
    }

} */
//------------------------------------------FUNCIONES PARA CONTROL DE INSCRIPCIONES DE ALUMNOS//
function Alumno(req, res, numero = '') {
    var cursoId = req.params.id;
    var alumnoInscrito = true;
    var alumnoNum = `alumno.${numero}`;

    Curso.findById(cursoId, (err, cursoEncontrado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!cursoEncontrado) res.status(404).send({ message: 'Error al listar los Cursos' })

        for (let x = 0;  cursoEncontrado.alumnos.alumnosInscritos.length >= x ; x++) {
            if (cursoEncontrado.alumnos.alumnosInscritos[x] === req.user.id) {
                alumnoInscrito = false;
                return res.status(500).send({ message: 'Ya esta inscrito en el curso' })
            }
        }

        if (alumnoInscrito == true) {
            Curso.findByIdAndUpdate(cursoId, {
                $inc: {
                    [alumnoNum]: 1
                }
            }, { new: true }, (err, cursoActualizado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                if (!cursoActualizado) return res.status(404).send({ message: 'Error al realizar la inscripcion' })
                cursoActualizado.alumnos.alumnosInscritos.push(req.user);
                cursoActualizado.save();

                return res.status(200).send({ Alumno: cursoEncontrado })
            })
        }
    })
}

function agregarAlumno(req, res) {
    var params = req.body
    var opinion = 'si'
    if (opinion == 'si') {
        Alumno(req, res, opinion)
    }
}


module.exports = {
    addCurso,
    getCurso,
    agregarAlumno,
    editarCurso,
    eliminarCurso,

}