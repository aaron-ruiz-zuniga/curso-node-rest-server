

const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://curso-node-rest-server-aaron.herokuapp.com/api/auth/'; 

let usuario = null;
let socket = null;

const txtUid      = document.querySelector('#txtUid');
const txtMensaje  = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir    = document.querySelector('#btnSalir');

//Validar el tokek de LocalStorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || ''; // si no viene, se maneja como string vacio
    
    if( token.length <= 10 ){
        window.location = 'index.html'; //direcciona al index.html
        throw new Error('No hay token en el servidor');
    }

    const resp= await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB );
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
};

const conectarSocket = async () => {
    //establece nuestra comunicacion con el backend server
    socket = io( {
        'extraHeaders' : {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online | escuchando..connect');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline | escuchando..disconnect');
    });

    socket.on('recibir-mensajes', dibujarMensajes );

    //escuchar cuando cada usuario se conecte    
    socket.on('usuarios-activos', dibujarUsuarios);

   //escuchar cuando ALGUIEN ME mande mensaje privado   
   socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:' , payload );
    });    





}

const dibujarUsuarios = ( usuarios = [] ) => {

        let usersHtml = '';
        usuarios.forEach( ({ nombre, uid })  => {

            usersHtml += `
                <li>
                    <p>
                        <h5 class="text-success">  ${ nombre } </h5>
                        <span class="fs-6 text-muted">${ uid }</span>
                    </p>
                </li>
            `;

        });

        ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHtml = '';
    mensajes.forEach( ({ nombre, mensaje })  => {

        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">  ${ nombre }: </span>
                    <span class="">${ mensaje }</span>
                </p>
            </li>
        `;

    });

    ulMensajes.innerHTML = mensajesHtml;

}
    
txtMensaje.addEventListener('keyup',( {keyCode} ) =>{
   
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;


    if ( keyCode !== 13 ) { return; }
    if ( mensaje.length === 0 ) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid } );
    
    txtMensaje.value = '';
   
})

const main = async() => {
    //validar JWt
    await validarJWT();
}

main();


//validar antes de conectar
//const socket = io();
