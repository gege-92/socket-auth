const path = require('path');
const { v4: uuidv4 } = require('uuid'); //'1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


const subirArchivo = ( files, extensionesPermitidas = ['img', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise ( (resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];


        //Valido que el archivo tenga una extension permitida
        if( !extensionesPermitidas.includes(extension) ){
            return reject( `La extension '${ extension }' no esta permitida. Verifique que sea: ${ extensionesPermitidas }` );
        }

        //Renombro los files para que sean unicos usando uuid
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp); 

        // Use the mv() method to place the file somewhere on your server
        archivo.mv( uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve ( nombreTemp );
    });

    } )

}


module.exports = {
    subirArchivo
}