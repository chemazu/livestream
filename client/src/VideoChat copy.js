import React, { useRef, useState, useEffect } from "react";

function VideoChat() {
  
  const [peers, setPeers] = useState({});
  const [myPeerId, setMyPeerId] = useState("");
  const socketRef = useRef();
  const peersRef = useRef({});
  const myPeerRef = useRef();

  const videoGridRef = useRef();
  const myVideoRef = useRef();

  useEffect(() => {
    // create a new socket connection
    socketRef.current = io("/");

    // create a new Peer instance
    myPeerRef.current = new Peer(undefined, {
      host: "/",
      port: "3001",
    });

    // get the user's video and audio stream
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // add user's video to the grid
        addVideoStream(myVideoRef.current, stream);

        // listen for incoming calls
        myPeerRef.current.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        // emit 'join-room' event to server with roomId and peerId
        myPeerRef.current.on("open", (id) => {
          setMyPeerId(id);
          socketRef.current.emit("join-room", ROOM_ID, id);
        });

        // listen for 'user-connected' event from server
        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });

        // listen for 'user-disconnected' event from server
        socketRef.current.on("user-disconnected", (userId) => {
          if (peersRef.current[userId]) {
            peersRef.current[userId].close();
            delete peersRef.current[userId];
          }
        });
      });

    // cleanup function
    return () => {
      // close the Peer connection
      myPeerRef.current.destroy();

      // disconnect the socket
      socketRef.current.disconnect();
    };
  }, []);

  function connectToNewUser(userId, stream) {
    const call = myPeerRef.current.call(userId, stream);
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

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGridRef.current.append(video);
  }

  return (
    <div>
      <div id="video-grid" ref={videoGridRef}></div>
      <video
        ref={myVideoRef}
        muted
        style={{ width: "300px", height: "200px" }}
      />
    </div>
  );
}
