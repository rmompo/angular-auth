const { Router } = require('express');
const { check } = require('express-validator');

const { usuarioCrear, usuarioLogin, usuarioRevalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validaJWT } = require('../middlewares/validar-jwt');

const router = Router();

// crear un nuevo usuartio
router.post('/new', [
    check('name', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El email no es un email válido').isEmail(),
    check('password', 'La contraseña es demasiado corta').isLength({ min:6 }),
    validarCampos
], usuarioCrear);

// login de usuario
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], usuarioLogin);

// valida y revalida jwt
router.get('/renew', [
    validaJWT
], usuarioRevalidarToken);

module.exports = router;