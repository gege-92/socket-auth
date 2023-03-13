let url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://restserver-node-gg.herokuapp.com/api/auth/';


//cuando este conectado voy a llamar a estas variables
let usuario = null;
let socket = null;


//Referencias del HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const ulMensajesPrivados = document.querySelector('#ulMensajesPrivados');
const btnSalir   = document.querySelector('#btnSalir');


//Validar el JWT del localStorage donde esta almacenado
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '' ;

    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    //llamo a mi endpoint '/api/auth' que me devuelve el token
    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    //renombro
    const { usuario: userDB, token: tokenDB } = await resp.json();

    //renuevo el token guardandolo en el localStorage
    localStorage.setItem('token', tokenDB);

    usuario = userDB;

    document.title = usuario.nombre;

    await conectarSocket();

}


const conectarSocket = async() => {

    //dentro puedo mandarle la informacion para establecer la conexion, como el JWT. Esta conexion va a caer directamente a mi controlador socketController
    socket = io({ 
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    }); 

    socket.on('connect', () => {
        console.log('Sockets online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    });

    //aca voy a mostrar en mi html los mensajes
    socket.on('recibir-mensajes', dibujarMensajes);

    //aca voy a mostrar en mi html los usuarios conectados
    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', ( payload ) => {
        console.log( payload );
    });

}

// mostrar los usuarios conectados en el html
const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = '';

    //desestructuro de usuarios[]
    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted"> ${ uid } </span>
                </p>
            </li>
        `;
    })

    ulUsuarios.innerHTML = usersHtml;

}


// mostrar los mensajes en el html
const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHtml = '';

    //desestructuro de usuarios[]
    mensajes.forEach( ({ nombre, mensaje }) => {

            mensajesHtml += `
                <li>
                    <p>
                        <span class="text-primary"> ${ nombre }: </span>
                        <span class="fs-6 text-muted"> ${ mensaje } </span>
                    </p>
                </li>
            `;
        })

    

    ulMensajes.innerHTML = mensajesHtml;

}


txtMensaje.addEventListener('keyup', ev => {

    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    if( ev.keyCode !== 13 ) return;  //13 -> Enter
    if( mensaje.length = 0 ) return; //campo de mensaje vacio

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';

});


const main = async() => {

    //Validar JTW
    await validarJWT();

}


main();




