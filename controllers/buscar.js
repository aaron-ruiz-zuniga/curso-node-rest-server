const { response } = require("express");
const { json } = require("express/lib/response");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'

]

//{ categoria: ObjectId('624fbdd179541edcec593d34') }
const buscarCategorias = async ( termino = '', res= response) =>{

    const esMongoID = ObjectId.isValid( termino ); //TRUE}

    if( esMongoID ){
        const categoria = await Categoria.findById( termino );
        return res.json({
            results:( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // la hacemos no case sensitive 

    const categorias = await Categoria.find({ nombre: regex, estado: true });
        //$or: [{nombre: regex, estado: true } ,{ correo: regex, estado: true  }]
        //$or: [{nombre: regex }],
        //$and: [{  estado: true }]
         //});

    return res.json({
        results: categorias
    });

}

const buscarProductos = async ( termino = '', res= response) =>{

    const esMongoID = ObjectId.isValid( termino ); //TRUE}

    if( esMongoID ){
        const producto = await Producto.findById( termino );
        return res.json({
            results:( producto) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // la hacemos no case sensitive 

    const productos = await Producto.find({ 
        //$or: [{nombre: regex, estado: true } ,{ correo: regex, estado: true  }]
        $or: [{nombre: regex },{ descripcion: regex }],
        $and: [{  estado: true }]
         });

    return res.json({
        results: productos
    });

}

const buscarUsuarios = async ( termino = '', res= response) =>{

    const esMongoID = ObjectId.isValid( termino ); //TRUE}

    if( esMongoID ){
        const usuario = await Usuario.findById( termino );
        return res.json({
            results:( usuario) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // la hacemos no case sensitive 

    const usuarios = await Usuario.find({ 
        //$or: [{nombre: regex, estado: true } ,{ correo: regex, estado: true  }]
        $or: [{nombre: regex },{ correo: regex }],
        $and: [{  estado: true }]
         });

    return res.json({
        results: usuarios
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion )){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias( termino, res );
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;            
        case 'usuarios':
            buscarUsuarios( termino, res );
            
            break;
        
        default:
            res.status(500).json({
                msg: `${ key } pendiente de implementar`
            })
            break;
    }

    // res.json({
    //     coleccion, termino
    // })
}


module.exports ={
    buscar
}