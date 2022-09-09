const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.ENV_MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true
        });

        console.log('DDBB online');

    } catch (error) {
        console.log( error );
        throw new Error('Error en inicialización de DDBB');
    }

}

module.exports = {
    dbConnection
}