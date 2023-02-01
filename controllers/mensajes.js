const { response } = require("express");
const Mensaje = require("../models/mensaje");

const getMensajes = async (req, res = response, next) => {
  const miiD = req.uid;
  const mensajeDe = req.params.de;
  const ultimos30Mnesajes = await Mensaje.find({
    _$or: [{ de:miiD, para: mensajeDe }, {de: mensajeDe, para: miiD}],
  }).sort({createdAt : 'desc'}).limit(30);
  res.json({
    ok: true,
    mensajes:ultimos30Mnesajes,
    msg: "getMensajes",
  });
};

module.exports = {
    getMensajes,
};
