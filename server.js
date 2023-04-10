import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import livestreamRoute from "./livestream.js";

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);
const port = process.env.PORT || 4000;

const io = new Server(httpServer, {
  cors: {
    // origin: "*",
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use("/api/v1/livestream", livestreamRoute);
let broadcaster;
// io.on("connection", (socket) => {
//   console.log("socket connected");

//   socket.on("join-room", (roomId, userId) => {
//     // confirm
//     socket.join(roomId);
//     console.log(roomId, userId);
//     // socket.to(roomId).broadcast.emit("user-connected", userId);
//     socket.broadcast.to(roomId).emit("user-connected", userId);
//   });

//   //  broadcaster connects
//   socket.on("broadcaster", (roomId, userId) => {
//     broadcaster = socket.id;
//     // i can use rooms
//     console.log(roomId, userId,broadcaster,36);
//     console.log(broadcaster);
//     // join a custom room, the room will be generated by UUID
//     socket.join(roomId);
//     // console.log(roomId, userId);
//     // // socket.to(roomId).broadcast.emit("user-connected", userId);
//     socket.broadcast.to(roomId).emit("broadcaster");

//     // socket.broadcast.emit("broadcaster");
//   });
//   //  watcher connects

//   socket.on("watcher", (roomId, user) => {
//     console.log(roomId, user, "from watcher");
//     // this emits to the breoadcaster that person don join him room
//     // after testing this try to run to room
//     socket.broadcast.to(roomId).emit("broadcaster",roomId,user);
//     socket.broadcast.to(roomId).emit("watcher knocks",user);;

//     // socket.to(broadcaster).emit("watcher", socket.id);
//   });

//   socket.on("disconnect", () => {
//     console.log("disconnected");
//     // socket.broadcast.to(roomId).emit("user-disconnected", userId);
//   });
//   // we will implement the socket.io events to initialize a WebRTC connection. These events will be used by the watchers and broadcaster to instantiate a peer-to-peer connection.
//   socket.on("offer", (id, message) => {
//     socket.to(id).emit("offer", socket.id, message);
//   });
//   socket.on("answer", (id, message) => {
//     socket.to(id).emit("answer", socket.id, message);
//   });
//   socket.on("candidate", (id, message) => {
//     socket.to(id).emit("candidate", socket.id, message);
//   });
// });
io.on("connection", (socket) => {
  console.log("socket connected");

  // broadcaster connects
  socket.on("broadcaster", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("broadcaster");
    console.log(userId, "broadcaster has joined room", roomId);
  });
  // watcher connects
  socket.on("watcher", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("watcher", userId);
    console.log(userId, "watcher has joined room", roomId);
 

  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    // socket.broadcast.to(roomId).emit("user-disconnected", userId);
  });
});
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
