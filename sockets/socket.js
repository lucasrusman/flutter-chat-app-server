const { comprobarJwt } = require("../helpers/jwt");
const { io } = require("../index");
const {
  usuarioConectado,
  usuarioDesconectado,
  guardarMensaje,
} = require("../controllers/socket");

//mensajes de sockets
io.on("connection", (client) => {
  const token = client.handshake.headers["x-token"];
  const [valido, uid] = comprobarJwt(token);

  //verificar autenticacion
  if (!valido) {
    return client.disconnect();
  }
  //cliente autenticado
  usuarioConectado(uid);
  //conectar al usuario a una sala especifica
  //sala global (io.emit)
  //mensaje privado client.id pero lo vamos a unir a una sala
  client.join(uid);
  // escuchar del cliente el 'mensaje-personal'
  client.on("mensaje-personal", async(payload) => {
    await guardarMensaje(payload)
    io.to(payload.para).emit("mensaje-personal", payload);
  });

  client.on("disconnect", () => {
    usuarioDesconectado(uid);   
  });
});
