const express = require('express');
const cors = require('cors');
const path = require('path')

const { dbConnection } = require('./db/config');
require('dotenv').config();

console.log( process.env );

// Crear el servidor/aplicacion de express
const app = express();

// Base de datos
dbConnection();

// Directorio publico
app.use( express.static('public') );

// CORS
app.use( cors() );

// Lectura y parse del body
app.use( express.json() );

// Rutas
app.use( '/api/auth', require('./routes/auth') );

// demas rutas
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html') );
});

app.listen(process.env.PORT || process.env.ENV_EXPRESS_PORT, () => {
    console.log(`Servidor express en puerto ${process.env.PORT || process.env.ENV_EXPRESS_PORT}`);
});

