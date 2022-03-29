const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('correo','El correo es oblitatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token','id_token es requerido').not().isEmpty(),
    validarCampos
],googleSignIn);

module.exports = router;

