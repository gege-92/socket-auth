//const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();


const socketController = async( socket, io ) => {

    //evaluar el JWT enviado por socket
    const token = socket.handshake.headers['x-token'];

    //de este token necesito el usuario
    const usuario = await comprobarJWT( token );

    if(!usuario){
        return socket.disconnect();
    }

    console.log('Se conecto: ' + usuario.nombre);

    //Primero hay que agregar al usuario conectado
    chatMensajes.conectarUsuario( usuario );

    //Conectar al usuario a una sala especial
    socket.join(usuario.id); // Cada usuario que se conecte tendra 3 salas:  global, socket.id, usuario.id

    //Y luego lo mostramos
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    socket.emit('recibir-mensajes', chatMensajes.ultimos10 );  //cada vez que un cliente se conecta le muestro SOLO a ese cliente los mensajes que hay (los ultimos10)

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        console.log('Se desconecto: ' + usuario.nombre);
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr ); // actualizo la lista de los usuarios que estan conectados
    })

    //Pongo a la escucha a mi server cuando se envia un mensaje
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if(uid){
            //Mensaje privado
            
            socket.to( uid ).emit( 'mensaje-privado', {from: usuario.nombre, mensaje: mensaje} );

        } else {

            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );

            //y lo emito a todos
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );

        }
        
        

    })

}


module.exports = {
    socketController
}