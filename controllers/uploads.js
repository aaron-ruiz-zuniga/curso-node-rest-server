const path = require('path');
const fs = require('fs'); 

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );


const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');



const cargarArchivo = async( req, res = response ) => {

  
  // if ( !req.files || Object.keys(req.files).length === 0 ||  !req.files.archivo ) {
  //   res.status(400).json({msg:'No hay archivos que subir.'});
  //   return;
  // }

  
  try {

    
    //txt md
    //const nombre = await subirArchivo( req.files , ['txt','md'], 'textos');

    //imagenes
    const nombre = await subirArchivo( req.files , undefined, 'imgs');
    res.json({ nombre });  

  } catch (msg) {
      res.status(400).json({msg});
  }
  
  

}

const actualizarImagen = async ( req, res = response) => {


  // if ( !req.files || Object.keys(req.files).length === 0 ||  !req.files.archivo ) {
  //   res.status(400).json({msg:'No hay archivos que subir.'});
  //   return;
  // }
  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }

      
      break;

   case 'productos':
      modelo = await Producto.findById(id);
      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        });
      }

      
      break;
    default:
      return res.status(500).json({ msg: 'Metodo no implementado'});
  }

  //limpiar imagenes previas
  if( modelo.img ){
    //hay que borrar la imagen
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
    if( fs.existsSync( pathImagen )){
      fs.unlinkSync( pathImagen );
    }
  }


    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json({ modelo });

}

const mostrarImagen =  async (req, res = response ) => {
  
  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }

      
      break;

   case 'productos':
      modelo = await Producto.findById(id);
      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        });
      }

      
      break;
    default:
      return res.status(500).json({ msg: 'Metodo no implementado'});
  }

  //
  if( modelo.img ){
    
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
    if( fs.existsSync( pathImagen )){
       return res.sendFile( pathImagen );
    }
  }

  const pathNoImagen = path.join ( __dirname, '../assets/no-image.jpg');
  if( fs.existsSync( pathNoImagen )){
    return res.sendFile( pathNoImagen );
 }
  
}

const actualizarImagenCloudinary = async ( req, res = response) => {


  
  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }

      
      break;

   case 'productos':
      modelo = await Producto.findById(id);
      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        });
      }

      
      break;
    default:
      return res.status(500).json({ msg: 'Metodo no implementado'});
  }

  //limpiar imagenes previas
  if( modelo.img ){
    //hay que borrar la imagen de Cloudinary
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length - 1 ];
    const [ public_id ] = nombre.split('.');

    cloudinary.uploader.destroy( public_id );


  }

  

  const { tempFilePath } = req.files.archivo;
  const { secure_url }= await cloudinary.uploader.upload( tempFilePath );

  modelo.img = secure_url;

  await modelo.save();

   res.json({ modelo });

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}