const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async (req, res = response) => {

    //validarArchivoSubir -> middleware personalizado validar-archivo.js

    // subirArchivo()  ->  movido a mis helpers/subir-archivo.js

    try {
        // txt, md
        //const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );

        //Imagenes
        const nombre = await subirArchivo( req.files, undefined, 'Imgs' );
        res.json({ nombre });
        
    } catch (msg) {
        res.status(400).json({ msg });
    }
    

}


const actualizarImagen = async(req, res = response) => {

    //validarArchivoSubir -> middleware personalizado validar-archivo.js

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${ id }`
                });
            }
        break;   
            
        default:
            res.status(500).json({msg: 'Falta hacer el codigo para esa coleccion'});
        break;
    }


    // Limpiar imagenes previas

    //1. Verificar que exista la propiedad img de mi modelo (modelo.img)
    if(modelo.img){
        //2. Borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img);

        if( fs.existsSync(pathImagen) ){  // existsSync() -> true/false si existe el path
            fs.unlinkSync(pathImagen); //borrar el archivo del path
        }
    }

    //subir el archivo
    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    //Guardar
    await modelo.save();

    res.json( modelo );

}


const actualizarImagenCloudinary = async(req, res = response) => {

    //validarArchivoSubir -> middleware personalizado validar-archivo.js

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${ id }`
                });
            }
        break;   
            
        default:
            res.status(500).json({msg: 'Falta hacer el codigo para esa coleccion'});
        break;
    }


    // Limpiar imagenes previas

    //1. Verificar que exista la propiedad img de mi modelo (modelo.img)
    if(modelo.img){
        //2. Borrar la imagen de cloudinary. Solo necesito el public_id que es el identificador de cada archivo
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        
        //Borrar
        cloudinary.uploader.destroy( public_id );
    }

    //Cloudinary
    //console.log(req.files.archivo); --> Solo me interesa el path temporal
    const { tempFilePath } = req.files.archivo;
    //const resp = await cloudinary.uploader.upload( tempFilePath ); // devuelve una promesa con informacion del archivo. Y lo que me interesa es el "secure_url"
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;   //actualizo la propiedad img de mi modelo

    //Guardar
    await modelo.save();

    res.json( modelo );

}



const mostrarImagen = async( req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${ id }`
                });
            }
        break;   
            
        default:
            res.status(500).json({msg: 'Falta hacer el codigo para esa coleccion'});
        break;
    }


    //1. Verificar que exista la propiedad img de mi modelo (modelo.img)
    if(modelo.img){
        //2. Borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img);

        if( fs.existsSync(pathImagen) ){  // existsSync() -> true/false si existe el path
            
            return res.sendFile( pathImagen ); 

        }
    }

    const pathImagenNotFound = path.join( __dirname, '../assets/no-image.jpg');
    
    res.sendFile( pathImagenNotFound );

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}