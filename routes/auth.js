//path: api/login
const { Router, response } = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  renewToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Ingrese un email correcto").isEmail(),
    check("password", "El pasword debe tener min 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);
router.post(
  "/",
  [
    check("email", "Ingrese un email correcto").isEmail(),
    check("password", "El pasword debe tener min 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);
router.get("/renew", validarJWT, renewToken);
module.exports = router;
