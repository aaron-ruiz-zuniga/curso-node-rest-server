const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


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

module.exports = {
    login
}
