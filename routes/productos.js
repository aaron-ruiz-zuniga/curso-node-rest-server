const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');


const router = Router();


//crear producto - privado- cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre del producto es requerido').not().isEmpty(),
    check('categoria','La categoría del producto es requerida').not().isEmpty(),
    check('categoria','ID categoria, No es un ID válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    check('descripcion','La descripcion del producto es requerida').not().isEmpty(),
    //check('usuario','El usuario es requerido'),
    validarCampos
], crearProducto);


//obtener todos los productos - publico
router.get('/', obtenerProductos );

//obtener un producto por id - publico
router.get('/:id', 
[
   check('id','No es un ID válido').isMongoId(),
   check('id').custom( existeProductPorId ), 
   validarCampos
], 
obtenerProductoPorId );


//actualizar producto por id - privado- cualquier persona con un token valido
router.put('/:id',
 [
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    //check('categoria','No es un ID válido').isMongoId(),
    check('id').custom( existeProductPorId ),
    //check('nombre','El nombre es requerido').not().isEmpty(), 
    validarCampos
 ], actualizarProducto );

 //Borrar un producto - Admin
router.delete('/:id', 
[
  validarJWT,
  //esAdminRole,  
  tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom( existeProductPorId ),
  validarCampos       
],
borrarProducto );


module.exports = router;