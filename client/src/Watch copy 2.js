import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
const socket = io("http://localhost:4000", {
  query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
});

export default function Watch() {
  const { id } = useParams();
  const myVideoRef = useRef();
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);

  let ROOM_ID = id;
  const myPeer = new Peer();
  myPeer.on("open", (user) => {
    console.log("watcher peer created");
    // or join here
    socket.emit("watcher", ROOM_ID, user);
  });
  useEffect(() => {
    socket.on("connect", () => {
      // either join the room here
      //   socket.emit("watcher,socket");
      console.log("Connected to server, watcher");
    });

    socket.on("broadcaster", () => {
        // 
      console.log("watcher has felt connector");
      socket.emit("watcher");
    });
    myPeer.on("call", (call) => {
      console.log("Received call from broadcaster");

      call.answer();
      call.on("stream", (stream) => {
        console.log("Received remote stream");

        setRemoteStream(stream);
      });
    });
  });

  return (
    <div>
      <h1>Watch</h1>

      {remoteStream ? (
        <video srcObject={remoteStream} autoPlay />
      ) : (
        <p>Waiting for broadcaster...</p>
      )}
    </div>
  );
}
