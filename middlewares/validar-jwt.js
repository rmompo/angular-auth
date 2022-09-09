const { response } = require("express");
const jsonwebtoken = require("jsonwebtoken");

const validaJWT = ( req, res = response, next ) => {

    const jwtSeed = process.env.ENV_SECRET_JWT_SEED;

    const xToken = req.header('x-token');
    console.log('usuarioRevalidarToken:', xToken);

    if ( !xToken ) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token (null)'
        });
    }

    try {
        const { uid, name } = jsonwebtoken.verify( xToken, jwtSeed );
        console.log('validaJWT:', uid, name);

        req.uid = uid;
        req.name = name;

        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token (invalid)'
        });
    }

    next();
}

module.exports = {
    validaJWT
}