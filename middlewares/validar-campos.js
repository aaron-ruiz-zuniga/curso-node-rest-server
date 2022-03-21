const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);  
    if( !errors.isEmpty()){
      return res.status(400).json(errors);
    }

    next(); //se manda llamar si esta ok, y sigue con el siguiente
    
}

module.exports = {
    validarCampos
}