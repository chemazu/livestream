import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:4000", {
  query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
});
export default function VideoChat() {
  // room id
  const [peers, setPeers] = useState({});

  const { id } = useParams();
  const videoGridRef = useRef();
  const myVideoRef = useRef();

  const peersRef = useRef({});

  let ROOM_ID = id;
  // const myPeer = new Peer(undefined, {
  //   host: "/",,
  //   port: "3001",
  // });
  const myPeer = new Peer();
  myPeer.on("open", (user) => {
    socket.emit("join-room", ROOM_ID, user);
  });

  // add video stream
  function addVideoStream(video, stream) {
    
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    console.log(videoGridRef.current);

    videoGridRef.current.append(video);
    console.log(videoGridRef.current);

  }
  // get new user info
  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();

      setPeers((prevPeers) => {
        delete prevPeers[userId];
        return { ...prevPeers };
      });
    });

    peersRef.current[userId] = call;
    setPeers((prevPeers) => {
      return { ...prevPeers, [userId]: call };
    });
  }

  // join room by id
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // add user's video to the grid
        addVideoStream(myVideoRef.current, stream);

        myPeer.on("call", (call) => {
          console.log("call");
          console.log(call);

          call.answer(stream);
          const video = document.createElement("video");
          video.style.width = "300px";
          video.style.height = "200px";
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          console.log(userId, "user connected");
          connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", (userId) => {
          if (peersRef.current[userId]) {
            peersRef.current[userId].close();
            delete peersRef.current[userId];
          }
        });
      });

    // return () => {
    //   socket.off('my-event');
    // };
  }, []);

  return (
    <div>
      <div id="video-grid" ref={videoGridRef}>
        pop
      </div>
      <video
        ref={myVideoRef}
        muted
        style={{ width: "300px", height: "200px" }}
      />
      <p>videochat{ROOM_ID}</p>
    </div>
  );
}
