const { io } = require("../index");
const Band = require("../models/band");
const Bands = require("../models/bands");
const bands = new Bands();
bands.addBand(new Band("Queen"));
bands.addBand(new Band("Bon Jovi"));
bands.addBand(new Band("Heroes del silencio"));
bands.addBand(new Band("Ricardo Iorio"));

//mensajes de sockets
io.on("connection", (client) => {
  console.log("cliente conectado");
  client.on("disconnect", () => {
    console.log("cliente desconectado");
  });
  client.on("mensaje", (payload) => {
    console.log("Mensaje!!", payload);
    io.emit("mensaje", { admin: "Nuevo mensaje" });
  });
  client.on("vote-band", (payload) => {
    bands.voteBand(payload.id);
    io.emit("active-bands", bands.getBands());
  });
  client.on("add-band", (payload) => {
    const newBand = new Band(payload.name);
    bands.addBand(newBand);
    io.emit("active-bands", bands.getBands());
  });
  client.on("delete-band", (payload) => {
    bands.deleteBand(payload.id);
    io.emit("active-bands", bands.getBands());
  });
  client.emit("active-bands", bands.getBands());
});
