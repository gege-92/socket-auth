const { Role, Usuario, Categoria, Producto } = require('../models');

// Validamos el rol contra una base de datos
const esRoleValido = async(rol = '') => { 
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);  
    }
}

//Verificar si existe el email
const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`Ese email ${correo} ya esta registrado en la BD`);
    }
}

//Verificar si existe usuario por ID
const existeUsuarioPorId = async(id) => {
    
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`No existe el id: ${id}`);
    }
}


/**
 *  Validacion de Categorias contra DB
 */


//Verificar si existe la categoria por el ID
const existeCategoriaPorId = async(id) => {

    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`No existe la categoria con el id: ${id}`);
    }
}



/**
 *  Validacion de Productos contra DB
 */


//Verificar si existe la categoria por el ID
const existeProductoPorId = async(id) => {

    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`No existe el producto con el id: ${id}`);
    }
}



/**
 *  Validar colecciones permitidas para actualizar
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if(!incluida){
        throw new Error (`Esa coleccion ${ coleccion } no esta permitida. Las colecciones permitidas son: ${ colecciones }`);
    }

    return true;  //regreso un true por el custom de mi route
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}