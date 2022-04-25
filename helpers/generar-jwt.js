const  jwt = require('jsonwebtoken');
const { Usuario } = require('../models');



//el paquete de jsonwebtoken de npm no regresa una promesa, si no un callback
//por lo que hay que convertir el callbacka a promesa por medio de un helper

//uid=identificador unico del usuario
const generarJWT = ( uid = '' ) => {
     
    return new Promise ( ( resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '4h'
        }, ( err, token) => {
            if ( err ) {
                console.log(err);
                reject( 'No fue posible generar el token')
            } else{
                resolve( token )
            }
        })
    })

}

const comprobarJWT = async ( token = '' ) => {

    try {
        if ( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if (usuario) {
            if (usuario.estado) {
                return usuario;    
            } else {
                return null;
            }            
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }

}

module.exports = {
    generarJWT,
    comprobarJWT
}