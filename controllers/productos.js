const { response } = require("express");
const { Producto } = require('../models');


const crearProducto = async ( req, res = response) => {

    //const nombre = req.body.nombre.toUpperCase();
    const { estado, usuario, ...body} = req.body;

    const productoDB = await  Producto.findOne( { nombre: body.nombre });

    if ( productoDB ){
         return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
         });
    }

    //Generar la data a guardar
    // const data = {
    //     nombre,
    //     usuario: req.usuario._id,
    //     precio:  req.body.precio,
    //     categoria: req.body.categoria._id,
    //     descripcion: req.body.descripcion,
    //     disponible: req.body.disponible
    // }
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    //Guardar DB
    await producto.save();

    res.status(201).json(producto); 

}

// obtenerProductos - paginado - total - populate
const obtenerProductos = async( req = request, res = response ) => {

   
    const { limite =  5, desde = 0 } = req.query;
    const query = { estado: true };
  
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
          .skip(Number(desde))
          .limit(Number(limite))
           .populate('usuario','nombre')
           .populate('categoria','nombre')
      ]);
                    
      res.json({
        total,
        productos
      });
    }

    // obtenerProductoPorId - populate
const obtenerProductoPorId = async( req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findById( id )
                            .populate('usuario','nombre')
                            .populate('categoria','nombre')
  
    res.json( producto );

}

// actualizarProducto
const actualizarProducto = async (req, res = response ) => {

    
    const { estado, usuario, ...data }= req.body;

    if( data.nombre ){
         data.nombre = data.nombre.toUpperCase();
    } 
     
    data.usuario = req.usuario._id;

    const nombre = data.nombre;

    // const productoDB = await  Producto.findOne( { nombre });

    // if ( productoDB ){
    //      return res.status(400).json({
    //         msg: `El Producto ${ productoDB.nombre }, ya existe`
    //      });
    // }

    const { id }= req.params;
   
    const producto = await Producto.findByIdAndUpdate( id , data, { new: true } )
                             .populate('usuario','nombre');
    res.json( producto );
  }

// borrarProducto - estado: false
const borrarProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id , {estado:false}, {new:true}  )
                            .populate('usuario','name');
  
    res.json( producto );

}

    module.exports = {
        crearProducto,
        obtenerProductos,
        obtenerProductoPorId,
        actualizarProducto,
        borrarProducto
   }