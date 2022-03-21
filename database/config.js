const mongoose = require('mongoose');

const dbConnection = async() => {

    try{

        mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            // useCreateIndex: true,
            // useFindAndModify: false

        });

        console.log('Base de datos','ONLINE');


    }catch (error){
        console.log(error);
        throw new Error('Error al iniciar la base de datos.');
    }

}


module.exports = {
    dbConnection
}