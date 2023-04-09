import React from "react";
import VideoChat from "./VideoChat";
import { Routes, Route, useNavigate } from "react-router-dom";
import Livestream from "./Livestream";
import Watch from "./Watch";



export default function App() {
  return (
    <div>
      App
      <Routes>
        <Route path="call/:id" element={<VideoChat />} />
        <Route path="stream/:id" element={<Livestream />} />
        <Route path="watch/:id" element={<Watch />} />
        

      </Routes>
      {/* <VideoChat /> */}
    </div>
  );
}
