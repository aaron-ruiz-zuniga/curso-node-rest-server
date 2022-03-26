const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');




const usuariosGet = async( req = request, res = response ) => {

   
  const { limite =  5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total, usuarios ] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
                  
    res.json({
      total,
      usuarios
    });
  }

const usuariosPost = async (req, res = request) => {
    
    const { nombre, correo, password, rol }= req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );


    //ENCRIPTAR LA CONTRASEÑA
    const  salt = bcryptjs.genSaltSync();// 10 por defecto, vueltas de la encriptacion
    usuario.password = bcryptjs.hashSync(password,salt);

    //GUARDAR EN DB
    await usuario.save();


    res.json({
        msg: 'post API | usuariosPost',
        usuario
    });
  }

const usuariosPut = async (req, res = response ) => {

    const { id }= req.params;
    const { _id, password, google, correo, ...resto } = req.body; //descarto password, google y correo

    //TO DO - Validar contra base de datos
    if( password ) {
        //ENCRIPTAR LA CONTRASEÑA
      const  salt = bcryptjs.genSaltSync();// 10 por defecto, vueltas de la encriptacion
      resto.password = bcryptjs.hashSync( password , salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
  }

const usuariosPatch = (req, res = response ) => {
    res.json({
        msg: 'patch API | Controlador'
    });
  }

  const usuariosDelete = async (req, res = response ) => {
    const { id } = req.params;

    //const uid = req.uid;

    // Fiscamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    //Baja logica
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false} );

    //const usuarioAutenticado = req.usuario;
    //res.json({usuario, usuarioAutenticado} );
    res.json( usuario );
  }

  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosPatch,
      usuariosDelete
  }