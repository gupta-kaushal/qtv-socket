const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const fs = require('fs');
 
const app = express();
app.use(cors());

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  };
  
const server = http.createServer(options, app);
const io = new Server(server, { cors: { origin: "*" } });
 
app.use(express.static("public"));
 
app.get("/", (req, res) => {
  res.send("HIII");
});
 
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("user joined-->", roomId, userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.to(roomId).emit("message", {message: 'Kaushi dear.... MC', notificationFor: 'Kaushal'});

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });

    socket.on("message", (senderUserId, message) => {
      console.log("message", message);
      io.to(roomId).emit("message", senderUserId, message);
    });
  });
});
 
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});