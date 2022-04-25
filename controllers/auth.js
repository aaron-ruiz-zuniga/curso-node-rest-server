const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async ( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        //verifcar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            });
        }

        //Verifcar si el usuario esta activo en BD
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado: false'
            });
        }

        //Verificar la contraseña
        const validPassword =  bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            });
            
        }
        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token        
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error: Hable con el administrador'
        });
    }

    
}

const googleSignIn = async (req, res = response ) =>{

    const { id_token }= req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        // console.log('nombre',nombre);
        // console.log('img',img);
        // console.log('correo',correo);
        
        let usuario = await Usuario.findOne({ correo });

        console.log('usuario_g:', usuario)

        if( !usuario ){
            //Si no existe el usuario, hay que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario= new Usuario( data );
            await usuario.save();
        }

        //Si el usuario esta inacitvo en DB
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            //msg:'Todo bien en el BACKEND!',
           usuario,
           token
        })        
        
    } catch (error) {
         console.log(error);
         res.status(400).json({
             ok: false,
             msg: 'Token de Google no es válido'
         })
    }

    

}

const renovarToken = async ( req, res = response) => {
    const { usuario } = req;

    //Generar JWT--renovar token
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}
