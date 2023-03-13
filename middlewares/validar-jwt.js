const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {

        return res.status(401).json({  
            msg:'No existe token en la peticion'
        });
    }


    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById( uid );

        //Verificar si existe el uid del usuario que quiere borrar
        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido - no existe el usuario'
            });
        }

        //Verificar si el uid tiene estado: true
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado:false'
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}


module.exports = {
    validarJWT
}