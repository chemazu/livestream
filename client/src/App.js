import React from "react";
import VideoChat from "./VideoChat";
import { Routes, Route, useNavigate } from "react-router-dom";



export default function App() {
  return (
    <div>
      App
      <Routes>
        <Route path="live/:id" element={<VideoChat />} />
      </Routes>
      {/* <VideoChat /> */}
    </div>
  );
}
