const { response } = require("express")


const validarArchivoSubir = ( req, res = response, next) => {

    //Verifico que haya un archivo en req.files. Tambien verifico que venga el nombre del archivo: req.files.archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({ msg: 'No hay archivos para subi - validarArchivoSubir'});
    }

    next();

}


module.exports = {
    validarArchivoSubir
}