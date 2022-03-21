
const { Schema, model } = require('mongoose');

const RoleEschema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }

});


module.exports = model( 'Role', RoleEschema );