//para manejar el mensaje como una instancia independiente y privada
class Mensaje {
    constructor( uid, nombre, mensaje ) {
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }

}
//para manejas mensajes y los usuarios conectados
class ChatMensajes {
    constructor() {
        this.mensajes = []; // arreglo de mensajes
        this.usuarios = {}; // arreglo de usuarios como objetos {id: usuario}
    }

    //regresa los ultimos 10 mensajes
    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10); //se cortan los ultimos, siempre los ultmos 10
        return this.mensajes;
    }

    //regresa un arreglo de usuarios como objeto
    get usuariosArr(){
        return Object.values ( this.usuarios ); // asi va lo retornar --> [ {}, {}, {} ]
    }

    //uid el id de la persona que manda el mensaje
    //nombre el nombre de la persona que manda el mensaje
    //mensaje, el mensaje que se mande
    enviarMensaje( uid , nombre, mensaje ){
        //se inserta al inicio - unshit
        this.mensajes.unshift(
            //instancia de un mensaje
            new Mensaje( uid, nombre, mensaje )
        );
    }

    //agregar un usuario (modelo)
    conectarUsuario( usuario ){
        //como identificador de la llave el id del usario
        this.usuarios[usuario.id]= usuario;
    }

    //cuando un usuario se desconecte
    desconectarUsuario( id ) {
        //se borra la propiedad del objeto
        delete this.usuarios[id];
    }
}

module.exports = ChatMensajes;