const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        
        // Verificar que exista el correo
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msj: 'Usuario / Password incorrecto - correo'
            });
        }

        // Verificar si el usuario esta activo en la BD -> estado: true
        if(!usuario.estado){
            return res.status(400).json({
                msj: 'Usuario / Password incorrecto - estado: false'
            });
        }

        // Verificar que la pass coincida con la pass de la DB
        const validPassword = bcryptjs.compareSync( password, usuario.password );  //compareSync() compara ambas contraseñas y devuelve un boolean
        if(!validPassword){
            return res.status(400).json({
                msj: 'Usuario / Password incorrecto - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error. Contactar al admin'
        })
    }

}

const googleSignIn = async( req, res= response ) => {

    const { id_token } = req.body;

    try {

        const { nombre, correo, img } = await googleVerify( id_token );

        //busco en la DB por correo:
        let usuario = await Usuario.findOne({ correo });

        //1. Que sea un usuario nuevo y hay que crearlo:
        if(!usuario){

            const data = {
                nombre,
                correo,
                password: 'cualquiercosa',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        //2. Que este inactivo en la DB (estado: false)
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Contacte al admin. estado: false'
            })
        }

        // Generar un JWT para ese usuario
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        
        res.status(400).json({
            ok: false,
            msg:'No se pudo verificar el token'
        })
    }

    
}


const renovarJWT = async( req, res = response) => {

    const { usuario } = req;

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renovarJWT
}