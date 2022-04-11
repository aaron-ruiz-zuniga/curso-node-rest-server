const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
//const { exists } = require('../models/categoria');

//const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

/*
{{url}}/api/categorias
*/

//obtener todas las categorias - publico
router.get('/', obtenerCategorias );

//obtener una categoria por id - publico
router.get('/:id', 
[
   check('id','No es un ID válido').isMongoId(),
   check('id').custom( existeCategoriaPorId ), 
   validarCampos
], 
obtenerCategoriaPorId );

//crear categoria por id - privado- cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    //check('usuario','El usuario es requerido'),
    validarCampos
], crearCategoria);

//actualizar categoria por id - privado- cualquier persona con un token valido
router.put('/:id',
 [
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre','El nombre es requerido').not().isEmpty(), 
    validarCampos
 ], actualizarCategoria );

//Borrar una categoria - Admin
router.delete('/:id', 
    [
      validarJWT,
      //esAdminRole,  
      tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
      check('id','No es un ID válido').isMongoId(),
      check('id').custom( existeCategoriaPorId ),
      validarCampos       
    ],
    borrarCategoria );

module.exports = router;

