const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');
const { default: mongoose } = require('mongoose');

const usuarioCrear = async(req, res = response) => {
    const { name, email, password } = req.body;
    console.log('usuarioCrear:', name, email, password);

    try {
        // verificar email
        const usuario = await Usuario.findOne({ email });
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese email'
            });
        }

        // crear usuario
        const usuarioDDBB = new Usuario( req.body );
     
        // hash password
        const salt =  bcrypt.genSaltSync();
        usuarioDDBB.password =  bcrypt.hashSync( password, salt );

        // generar jwt
        const token = await generarJWT( usuarioDDBB.id, name );

        // crear usuario en DDBB
        await usuarioDDBB.save();

        // respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: usuarioDDBB.id,
            name,
            email,
            msg: 'Usuario creado',
            token
        });
    
    } catch (error) {
        console.log('usuarioCrear (error):', error);
        return res.status(500).json({
            ok: false,
            msg: 'Se ha producio un error interno, pongase en contacto con el administrador'
        });
    }
};

const usuarioLogin = async(req, res = response) => {
    const { email, password } = req.body;
    console.log('usuarioLogin:', email, password);
    
    try {
        const usuarioDDBB = await Usuario.findOne({ email });
        
        if ( !usuarioDDBB ) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales inválidas (email)'
            });
        }

        // confirmar password
        const passwordOk = bcrypt.compareSync( password, usuarioDDBB.password );
        if ( !passwordOk ) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales inválidas (pass)'
            });
        }

        // genera JWT
        const token = await generarJWT( usuarioDDBB.id, usuarioDDBB.name );

        // respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: usuarioDDBB.id,
            name: usuarioDDBB.name,
            email: usuarioDDBB.email,
            msg: 'Usuario logeado',
            token
        });

    } catch (error) {
        console.log('usuarioLogin (error):', error);
        return res.status(500).json({
            ok: false,
            msg: 'Se ha producio un error interno, pongase en contacto con el administrador'
        });
    }
};

const usuarioRevalidarToken = async(req, res = response) => {
    console.log('usuarioRevalidarToken:');
    const { uid } = req;
    
    // recupera el usuario de DDBB
    const usuarioDDBB = await Usuario.findById( uid );
    
    // regenera jwt
    const token = await generarJWT( uid, usuarioDDBB.name );

    return res.json({
        ok: true,
        uid,
        name: usuarioDDBB.name,
        email: usuarioDDBB.email,
        token
    });
}

module.exports = {
    usuarioCrear,
    usuarioLogin,
    usuarioRevalidarToken
}