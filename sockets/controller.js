const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io ) => {
    
    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );
    if( !usuario ){
        return socket.disconnect();
    }

    //console.log('Se conecto', usuario.nombre );  

    //io es para todos los usuarios

    //agregar al usuario conectado 
    chatMensajes.conectarUsuario( usuario );    
    //emitar aviso de usuario que se acaba de conectar
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    //al usuario que se conecta se le envia los uñtimos 10 mensajes
    socket.emit('recibir-mensajes', chatMensajes.ultimos10 );

    // cada usuario conectado tiene dos salas; global( io) y socket(id)
    //para mandar un mensaje privado no es conveniente usar el socket.id por que es volatil
    //para mandar el mensaje privado, sera creando una sala nueva con el id del usuario conectado
    //entonces ahora el usuario estara en tres salas: global( io), socket.id,  usuario.id
    
    //Conectarlo a una sala especial ( mediante su id )
    socket.join( usuario.id );

    //limpiar cuando alguien se desconecta
    socket.on('disconnect', ( ) => {
        console.log('Usuario desconectado', usuario.nombre );
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    });

    //escuhar enter, enviar mensaje
    socket.on('enviar-mensaje', ( { uid, mensaje } ) =>{
        
        //si viene el uid es un mensaje privado
        if ( uid ) {
            //Mensaje privado
            socket.to( uid ).emit('mensaje-privado',  {de: usuario.nombre, mensaje } );
        }else{
            //en caso contrario es un mensaje para todo el mundo
            chatMensajes.enviarMensaje( usuario.uid, usuario.nombre, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );
        }


        
    })
    
}


module.exports = {
    socketController
}