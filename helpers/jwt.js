const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    const payload = { uid, name };
    const jwtSeed = process.env.ENV_SECRET_JWT_SEED;

    console.log ( payload );
    
    return new Promise( (resolve, reject) => {
        jwt.sign( payload, jwtSeed, {
            expiresIn: '24h',
        }, (err, token) => {
            if ( err ) {
                reject( err );
            } else {
                resolve( token );
            }
        });
    });

}

module.exports = {
    generarJWT
}