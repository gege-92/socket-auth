const { response } = require('express'); 
const { request } = require('express');
const { Categoria } = require('../models');

//obtenerCategorias - paginado - total de categorias - populate
const obtenerCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado:true }
    
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre') 
            .skip(desde)
            .limit(limite)
    ]);

    res.status(200).json({
        msg:'CategoriasGet OK!',
        total,
        categorias
    });

}

//obtenerCategoria - populate - me devuelve el objeto
const obtenerCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id );

    //middleware personalizado -> helpers/db-validators.js    :  existeCategoriaPorId

    res.status(200).json({
        categoria
    })
}


const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); // mayuscula para hacer facilitar el filtro en una busqueda

    //Verifico que no exista esa categoria
    const categoriaDB = await Categoria.findOne({ nombre });

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria: ${ categoriaDB.nombre }, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id   
    }

    const categoria = new Categoria ( data );
    
    //Guardo en la DB
    await categoria.save();

    res.status(201).json({
        msg:'crearCategoria OK!',
        categoria
    });

}

//actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    data.nombre  = data.nombre.toUpperCase();  
    data.usuario = req.usuario._id; 
    

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });  // { new: true } tambien se actualiza la res

    res.json( categoria );

}

//borrarCategoria - estado:false
const borrarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado:false })

    res.json({
        categoria
    })

}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}