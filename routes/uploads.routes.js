//Router = configuracion de las rutas
const { Router } = require('express');
const { check } = require('express-validator');


const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');

const { verificarCampos, validarArchivoSubir } = require('../middlewares');


const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);


router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    verificarCampos
], actualizarImagenCloudinary );
//], actualizarImagen ); 


router.get('/:coleccion/:id', [
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    verificarCampos
], mostrarImagen)


module.exports = router;