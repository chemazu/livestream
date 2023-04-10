import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
const socket = io("http://localhost:4000", {
  query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
});

export default function Livestream() {
  const [livestream, setLivestream] = useState();
  const { id } = useParams();
  const myVideoRef = useRef();
  let ROOM_ID = id;

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  }

  const onConnect = (userId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        addVideoStream(myVideoRef.current, stream);

        // const broadcasterVideo = document.getElementById("broadcaster-video");
        // broadcasterVideo.srcObject = stream;
        // broadcasterVideo.play();

        const call = myPeer.call(userId, stream);
        call.on("stream", (remoteStream) => {
          console.log("first remote stream");
        });
      })
      .catch((error) => console.error(error));
  };
  const myPeer =  new Peer({

  });
  myPeer.on("open", (user) => {
    console.log("peer created");
    socket.emit("broadcaster", ROOM_ID, user);
  });
  useEffect(() => {
    socket.on("watcher", (userId) => {
      console.log(userId);

      onConnect(userId);
    });
  });
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
