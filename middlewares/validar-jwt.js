const { response } = require('express');
const { request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            msg: 'Token is missing'
        });
    }

    try {
        
        const { uid }= jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        //validar si el usuario existe
        if ( !usuario ) {
            return res.status(401).json({
                msg:'Token no válido - Usuario no existe DB'
            })
        }

        //Verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg:'Token no válido - Usuario con estado:false'
            })
        }
                                
        req.usuario= usuario;        
        //console.log( uid );
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

    

    



}

module.exports = {
    validarJWT
}