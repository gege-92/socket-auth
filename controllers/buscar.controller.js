const { response } = require("express");

const { ObjectId } = require('mongoose').Types;

const { Usuario, Producto, Categoria } = require('../models');


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async( termino = '', res = response ) => {

    //Valido que el termino(param id) sea un ID valido de Mongo 
    const esMongoID = ObjectId.isValid( termino )  // TRUE or FALSE

    if(esMongoID){
        const usuario = await Usuario.findById( termino );
        return res.json({ 
           results: ( usuario ) ? [ usuario ] : []
        })
    }

    //busqueda para expresiones regulares. Ej: '{{url}}/api/buscar/usuarios/gabriel'
    const regex = new RegExp( termino, 'i' ); //RegExp() RegularExpression.  'i' = insensible a las mayusculas y minusculas

    const usuarios = await Usuario.find({    //$or y $and propiedades del find de Node
        $or:  [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    })

}


const buscarCategorias = async( termino = '', res = response) => {

    //busqueda por ID
    const esMongoID = ObjectId.isValid( termino )  // TRUE or FALSE

    if(esMongoID){
        const categoria = await Categoria.findById( termino );
        return res.json({  
           results: ( categoria ) ? [ categoria ] : []
        })
    }

    //busqueda por una expresion regular(nombre)
    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ 
        $or:  [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: categorias
    })
}


const buscarProductos = async( termino = '', res = response) => {

    //Busqueda por ID
    const esMongoID = ObjectId.isValid( termino )  // TRUE or FALSE

    if(esMongoID){
        const producto = await Producto.findById( termino );
        return res.json({  
           results: ( producto ) ? [ producto ] : []
        })
    }

    //busqueda expresion regular
    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ 
        $or:  [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: productos
    })
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    //Verifico que la coleccion enviada como parametro este incluida en mis colecciones de Mongo (coleccionesPermitidas)
    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'usuarios': buscarUsuarios( termino, res );
        break;

        case 'categorias': buscarCategorias( termino, res );
        break;

        case 'productos': buscarProductos( termino, res );
        break;
    
        default:
            res.status(500).json({
                msg: 'Falta el codigo para la busqueda de esa coleccion'
            })
            break;
    }

}


module.exports = {
    buscar
}