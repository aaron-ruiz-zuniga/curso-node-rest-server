

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, esEmailValido, existeUsuarioPorId } = require('../helpers/db-validators');


const { usuariosGet, 
        usuariosPost,
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
] , usuariosPut );

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe tener una longitud de 6 o mas letras').isLength( { min: 6 } ),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( esEmailValido ),
        //check('rol', 'No es un Rol válSido').isIn(['ADMIN_ROLE','USER_ROLE'])
        check('rol').custom( esRoleValido ),
        validarCampos            //aqui valida, si no esta ok no ejecuta el controlador   
], usuariosPost );  // para definir un middleware, es el segundo argumento, ojo, los dos
                                        //los dos primeros se consideran que son middlware, y se maneja
                                        //como un array de middlewares
  
router.patch('/', usuariosPatch  );

router.delete('/:id',[
      check('id','No es un ID válido').isMongoId(),
      check('id').custom( existeUsuarioPorId ),
      validarCampos            //aqui valida, si no esta ok no ejecuta el controlador   
], usuariosDelete ); 


module.exports = router;