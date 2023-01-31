const { validationResult } = require("express-validator");

const validarCampos = (req, res = response, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.json({
        ok: false,
        errores: errores.mapped(),
      });
    }
    next();
}

module.exports = {
    validarCampos
}