//Router = configuracion de las rutas
const { Router } = require('express');
const { check } = require('express-validator');


const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { verificarCampos, validarJWT, esAdminRole} = require('../middlewares');


const router = Router();

/**
 *  {{url}}/api/productos
 */


// Obtener todos los productos - Publico
router.get('/', obtenerProductos)


// Obtener productos por id - Publico
router.get('/:id', [
    check('id', 'No es un ID valido de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    verificarCampos
], obtenerProducto)

// Crear nueva producto - Privado - Cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    verificarCampos
],
crearProducto);

// Actualizar producto por id - Privado - Cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un ID valido de Mongo para esa categoria').isMongoId(),  -> valido si existe la categoria a actualizar
    check('id').custom(existeProductoPorId),
    verificarCampos
], actualizarProducto)


// Borrar producto - Privado - Solo el ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    verificarCampos
], borrarProducto)



module.exports = router;