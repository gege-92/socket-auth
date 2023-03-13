const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socket.controller');


class Server{

    constructor(){
        this.app  = express();
        this.port = process.env.PORT;

        //Sockets
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')(this.server);

        this.authPath           = '/api/auth';
        this.buscarPath         = '/api/buscar';
        this.categoriasPath     = '/api/categorias';
        this.productosPath      = '/api/productos';
        this.usuariosPath       = '/api/usuarios';
        this.uploadsPath        = '/api/uploads';
        
        //Conectar a la DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
       
        //CORS
        this.app.use(cors());


        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

        //fileUpload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true  //crea una carpeta en el directorio especificado si no existe. Del metodo .mv
        }) );

    }

    routes(){

        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.buscarPath, require('../routes/buscar.routes'));
        this.app.use(this.categoriasPath, require('../routes/categorias.routes')); //    '/api/categorias' 
        this.app.use(this.productosPath, require('../routes/productos.routes')); //      '/api/productos' 
        this.app.use(this.usuariosPath, require('../routes/usuarios.routes')); //        '/api/usuarios' 
        this.app.use(this.uploadsPath, require('../routes/uploads.routes')); //           '/api/uploads' 
    }

    sockets(){

        this.io.on("connection", ( socket ) => socketController( socket, this.io ) );

    }

    listen(){
        //socket-server, NO el de express
        this.server.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
          })
    }

}


module.exports = Server;