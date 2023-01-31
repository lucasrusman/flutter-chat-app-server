const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJwt } = require("../helpers/jwt");
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "el correo ya esta registrado",
      });
    }
    const usuario = new Usuario(req.body);
    //encriptar pass
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();
    //generar jwt
    const token = await generarJwt(usuario.id);
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const existUser = await Usuario.findOne({ email });
    console.log(existUser);
    if (!existUser) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }
    //comparar pass
    validPassword = bcrypt.compareSync(password, existUser.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Contrasena no valida",
      });
    }
    //generar jwt
    const token = await generarJwt(existUser.id);
    res.json({
      ok: true,
      usuario: existUser,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};
const renewToken = async (req, res = response) => {
  const uid = req.uid;
  try {
    const token = await generarJwt(uid);
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "no encontramos el usuarsio",
      });
    }
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
  res.json({
    ok: true,
    msg: "renew",
    uid: req.uid,
  });
};
module.exports = {
  crearUsuario,
  loginUsuario,
  renewToken,
};
