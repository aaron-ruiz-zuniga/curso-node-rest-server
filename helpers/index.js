const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

//... los tres puntos en el module exports significa que seesparciendo todo su contenido
// osea exporta las funciones, variables, constantes etc con los ...
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}
