import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
const socket = io("http://localhost:4000", {
  query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
});

export default function Watch() {
  const { id } = useParams();
  let ROOM_ID = id;
  const videoGridRef = useRef();
  const [broadcaster, setBroadcaster] = useState(false);
  const myVideoRef = useRef();
  const myPeer = new Peer({
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    pingInterval: 5000,
  });

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  }
  myPeer.on("open", (user) => {
    console.log("peer created");
    socket.emit("watcher", ROOM_ID, user);
  });
  myPeer.on("call", (call) => {
    console.log("call");
    console.log(call);
    // console.log(call);

    call.answer();
    // const video = document.createElement("video");
    // video.style.width = "300px";
    // video.style.height = "200px";
    // setBroadcaster(!broadcaster);

    // call.on("stream", (userVideoStream) => {
    //     const video = document.createElement("video");

    //     console.log(userVideoStream);
    //     video.srcObject = userVideoStream;
    //     video.addEventListener("loadedmetadata", () => {
    //       video.play();
    //     });
    //     videoGridRef.current.append(video);
    //     //   addVideoStream(myVideoRef.current, userVideoStream);
    //   })
    // call.on("stream", (userVideoStream) => {
    //   const video = document.createElement("video");

    //   console.log(userVideoStream);
    //   video.srcObject = userVideoStream;
    //   video.addEventListener("loadedmetadata", () => {
    //     // Wait for user interaction to call the play() method
    //     document.addEventListener("click", () => {
    //       video.play().catch((error) => {
    //         console.log(error);
    //       });
    //     });
    //   });
    //   videoGridRef.current.append(video);
    // });
    call.on("stream", (userVideoStream) => {
        const video = myVideoRef.current;
        video.srcObject = userVideoStream;
        video.addEventListener("loadedmetadata", () => {
          // Wait for user interaction to call the play() method
          document.addEventListener("click", () => {
            video.play().catch((error) => {
              console.log(error);
            });
          });
        });
      });
  });
  return (
    <div>
      Watch
      <div id="video-grid" ref={videoGridRef}>
        pop
      </div>
      <video
        ref={myVideoRef}
        muted
        style={{ width: "300px", height: "200px" }}
      />
    </div>
  );
}
