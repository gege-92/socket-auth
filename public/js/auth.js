let url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://restserver-node-gg.herokuapp.com/api/auth/';

/**
 * LOGIN MANUAL
 */

//Referencias del HTML
const miFormulario = document.querySelector('form');
    
miFormulario.addEventListener('submit', (evento) => {

    evento.preventDefault(); 
    const formData = {};  //esta es la data que quiero mandarle al server

    //leo todos los campos que tenga el form (input, input, button)
    for( var elementos of miFormulario.elements ){
        if(elementos.name.length > 0) //como solo los inputs tienen el name, el boton es ignorado
            formData[elementos.name] = elementos.value;
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
     })
    .then( resp => resp.json() )
    .then( ({msg, token}) => {

        if(msg){ 
            return console.error(msg);
        }

        localStorage.setItem('token', token);

        window.location = 'chat.html';

    }) 
    .catch( err => {
        console.log(err);
    })

})



/**
 * GOOGLE SIGN IN
 */

function handleCredentialResponse(response) {

   const body = {id_token : response.credential};


   fetch( url + "google", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( resp => resp.json())
    .then( ({ token, correo }) => { 

        // 1. guardo en el localStorage el correo (necesario para hacer el logout):
        localStorage.setItem('email', correo);
        localStorage.setItem('token', token);  // guardo en el localStorage el token

        //redirecciono al chat.html
        window.location = 'chat.html';
    })
    .catch(console.warn);
    
}

//Boton logout
const button = document.getElementById('google_signout');
button.onclick = () => {

    google.accounts.id.disableAutoSelect();

    // 2. Una vez que tengo en el localStorage el correo puedo hacer un revoke

    google.accounts.id.revoke( localStorage.getItem('email') , done => {

        localStorage.clear(); 
        location.reload();
    })
}