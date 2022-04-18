
const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


const esRoleValido = async ( rol = '' ) =>{
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
            throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const esEmailValido = async ( correo = '') =>{
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){    
        throw new Error(`El email  ${ correo } ya está registrado en la BD`);
    }

}

const existeUsuarioPorId = async ( id ) =>{
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){    
        throw new Error(`El id ${ id } no existe`);
    }

}

const existeCategoriaPorNombre = async ( nombre='' ) =>{
    const existeCategoria = await Categoria.findOne( { nombre });
    if( !existeCategoria ){    
        throw new Error(`La categoria ${ nombre } no existe`);
    }

}

const existeCategoriaPorId = async ( id ) =>{
    const existeCategoria = await Categoria.findById( id);
    if( !existeCategoria ){    
        throw new Error(`El id ${ id } no existe`);
    }

}

const existeProductPorId = async ( id ) =>{
    const existeProducto = await Producto.findById( id);
    if( !existeProducto ){    
        throw new Error(`El id ${ id } no existe`);
    }

}

const coleccionesPermitidas = ( coleccion = '' , colecciones =[] ) =>{

    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`La colección ${ coleccion } no es permitida - ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    esEmailValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeCategoriaPorNombre,
    existeProductPorId,
    coleccionesPermitidas
}