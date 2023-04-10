import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
const socket = io("http://localhost:4000", {
  query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
});
export default function Livestream() {
  const [broadcasterId, setBroadcasterId] = useState(null);
  const [peer, setPeer] = useState(null);
  const [peers, setPeers] = useState({});

  const { id } = useParams();
  const myVideoRef = useRef();
  const peersRef = useRef({});

  let ROOM_ID = id;
  const myPeer = new Peer();
  myPeer.on("open", (user) => {
    console.log("peer created");
    socket.emit("broadcaster", ROOM_ID, user);
  });

  const onConnect = (userId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        
        const broadcasterVideo = document.getElementById("broadcaster-video");
        broadcasterVideo.srcObject = stream;
        broadcasterVideo.play();

        const call = myPeer.call(userId, stream);

        call.on("stream", (remoteStream) => {
          const watcherVideo = document.getElementById("watcher-video");
          watcherVideo.srcObject = remoteStream;
          watcherVideo.play();
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
       

        socket.on("watcher knocks", (user) => {
          console.log("wathcher knock");
          //   connectToNewUser(user, stream);
        });
      });
  }, []);

  return (
    <div>
      Livestream
      <video
        ref={myVideoRef}
        muted
        style={{ width: "300px", height: "200px" }}
      />
    </div>
  );
}
