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
io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(roomId, userId);
    // socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
