// creo una constante en la cual voy a definir mis middlewares para exportar
const verificarCampos = require('../middlewares/verificar-campos');
const validarJWT      = require('../middlewares/validar-jwt');
const validarRoles    = require('../middlewares/validar-roles');
const validarArchivo  = require('../middlewares/validar-archivo');


module.exports = {
    ...verificarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo
}