import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

const Watch = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);
  const socket = io("http://localhost:4000", {
    query: { authorization: `Bearer ${localStorage.getItem("user-token")}` },
  });
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("watcher", (id) => {
      console.log("Watcher connected", id);

      const peer = new Peer({});

      peer.on("open", (id) => {
        console.log("Connected to peer server");
        socket.emit("offer", id);
      });

      peer.on("call", (call) => {
        console.log("Received call from broadcaster");

        call.answer();
        call.on("stream", (stream) => {
          console.log("Received remote stream");

          setRemoteStream(stream);
        });
      });

      setPeer(peer);
      setPeerId(id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");

      if (peer) {
        peer.destroy();
      }

      setPeer(null);
      setPeerId("");
      setRemoteStream(null);
    });

    return () => {
      if (peer) {
        peer.destroy();
      }

      socket.disconnect();
    };
  }, []);

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
};

export default Watch;
