const { response } = require('express');
const { request } = require('express');

const bcrypjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response)=> {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado:true};    

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req = request, res = response)=> {

    const { id } = req.params; 
    const { _id, password, google, correo, ...resto } = req.body; 

    //Validacion del password contra base de datos
    if (password){ //si existe  se quiere actualizar la pass
        //Encryptar la password
        const salt = bcrypjs.genSaltSync(); 
        resto.password = bcrypjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto); //modelo de usuario

    res.json({
        msg: 'get PUT - controller',
        usuario
    });
}

const usuariosPost = async(req, res = response)=> {
    //middlewares personalidao -> verificar-campos.js

    const { nombre, correo, password, rol } = req.body; 
    const usuario = new Usuario({nombre, correo, password, rol}); 

    //Verificar si existe el email -> middleware personalizado -> helpers/db-validators.js

    //Encryptar la password
    const salt = bcrypjs.genSaltSync(); 
    usuario.password = bcrypjs.hashSync(password, salt);

    //Guardar usuario en DB    
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res = response)=> {

    const { id } = req.params;

    //Borrar fisicamente el usuario. NO RECOMENDADO
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}); // recibe dos paramentros, el id y el estado que quiero actualizar

    res.json({
        msg: 'get DELETE - controller',
        usuario
    });
}

const usuariosPatch = (req, res = response)=> {
    res.json({
        msg: 'get PATCH - controller'
    });
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}