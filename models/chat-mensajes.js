//modelo para el manejo de mensajes y usuarios conectados

class Mensaje{

    constructor( uid, nombre, mensaje){

        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;

    }

}

class ChatMensajes {

    constructor(){

        this.mensajes = [];
        this.usuarios = {};

    }

    //ultimos 10 mensajes
    get ultimos10(){

        this.mensajes = this.mensajes.splice(0, 10); //corto los ultimos 10 mensajes que quiero mostrar
        return this.mensajes;

    }

    //quiero un getter para manejar a mis usuarios como un array
    get usuariosArr(){

        return Object.values(this.usuarios); // esto retornara:  [ {}, {}, {} ]

    }

    enviarMensaje( uid, nombre, mensaje){

        this.mensajes.push( new Mensaje( uid, nombre, mensaje ) ) //unshift agrego al ppio
    }

    conectarUsuario( usuario ){
        //como this.usuarios es un objeto le ponemos un identificador a su llave por el id
        this.usuarios[usuario.id] = usuario;

    }

    desconectarUsuario( id ){

        delete this.usuarios[id]; //delete propiedades del objeto
    }

}


module.exports = ChatMensajes;