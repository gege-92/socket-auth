const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

//Middlewares personalizados
const { verificarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares'); //como en html, va a llamar al index.js

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

//Importo mis funciones
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios.controller');


//GET
router.get('/', usuariosGet ); 

//PUT
router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    verificarCampos
], usuariosPut);

//POST
router.post('/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste), // middleware personalizado
    check('password','El password debe contener mas de 6 caracteres').isLength({min: 6}),
    check('rol').custom(esRoleValido),
    verificarCampos  //SIEMPRE ejecutar al final porque es la que va a revisar cada uno de los checks
], usuariosPost);

//DELETE
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    verificarCampos
], usuariosDelete);

//PATCH
router.patch('/', usuariosPatch);



module.exports = router;