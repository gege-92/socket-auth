const { response } = require('express');
const { request } = require('express');

const { Producto } = require('../models');

//obtenerProducto - paginado - total de productos - populate
const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado:true }
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.status(200).json({
        msg:'ProductosGet OK!',
        total,
        productos
    });
}

//obtenerProducto - populate - me devuelve el objeto
const obtenerProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById( id );

    //middleware personalizado -> helpers/db-validators.js    :  existeCategoriaPorId

    res.status(200).json({
        producto
    })
}

//crearProducto
const crearProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    //Verifico que no exista ese producto
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if(productoDB){
        return res.status(400).json({
            msg: `El producto: ${ productoDB.nombre }, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id

    }

    const producto = new Producto ( data );
    
    //Guardo en la DB
    await producto.save();

    res.status(201).json({
        msg:'crearProducto OK!',
        producto
    });

}

//actualizarProducto
const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const { usuario, estado, nombre, categoria, ...body } = req.body;

    data = {
        ...body,
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new:true });

    res.json({
        msg: 'Producto actualizado!',
        producto
    })
}

//borrarProducto - estado:false
const borrarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado:false }, { new: true });

    res.json({
        msg: 'Producto borrado (estado:false)',
        producto
    })

}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}