
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:4000", {
  query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
});

const Broadcast = () => {
  const [broadcasterId, setBroadcasterId] = useState(null);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const initPeer = async () => {
      const newPeer = new Peer();

      newPeer.on("open", (id) => {
        setBroadcasterId(id);
      });

      setPeer(newPeer);
    };

    initPeer();

    return () => {
      peer?.destroy();
    };
  }, []);

  const onConnect = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const broadcasterVideo = document.getElementById("broadcaster-video");
        broadcasterVideo.srcObject = stream;
        socket.emit("broadcaster");
        broadcasterVideo.play();

        const mediaConnection = peer.call("watcher", stream);

        mediaConnection.on("stream", (remoteStream) => {
          const watcherVideo = document.getElementById("watcher-video");
          watcherVideo.srcObject = remoteStream;
          watcherVideo.play();
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {broadcasterId ? (
        <>
          <h2>Your ID: {broadcasterId}</h2>
          <video id="broadcaster-video" width="400" height="300" muted></video>
          <button onClick={onConnect}>Connect</button>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
      <hr />
      <video id="watcher-video" width="400" height="300" autoPlay></video>
    </div>
  );
};

export default Broadcast;
