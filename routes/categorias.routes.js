//Router = configuracion de las rutas
const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerCategorias, crearCategoria, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { verificarCampos, validarJWT, esAdminRole } = require('../middlewares');


const router = Router();

/**
 *  {{url}}/api/categorias
 */


// Obtener todas las categorias - Publico
router.get('/', obtenerCategorias);

// Obtener categorias por id - Publico
router.get('/:id', [
    check('id','No es un ID valido de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    verificarCampos
], obtenerCategoria);

// Crear nueva categoria - Privado - Cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    verificarCampos
],
crearCategoria);

// Actualizar categoria por id - Privado - Cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    verificarCampos
],actualizarCategoria);

// Borrar categoria - Privado - Solo el ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    verificarCampos
] ,borrarCategoria);



module.exports = router;