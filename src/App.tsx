import React, { useEffect, useRef } from "react";
import "./App.css";
import WebcamStreamer from "./WebcamStreamer";

function App() {
  const webcamVideo = useRef<HTMLVideoElement>(null);
  const simpleVideo = useRef<HTMLVideoElement>(null);
  const webcamStreamer = new WebcamStreamer();
  useEffect(() => {
    webcamStreamer.start().then((stream) => {
      if (webcamVideo.current !== null) {
        webcamVideo.current.srcObject = stream;
      }
    });
    return () => {
      webcamStreamer.stop();
    };
  }, [webcamStreamer]);
  const play = () => simpleVideo.current?.play();
  const stop = () => {
    simpleVideo.current?.pause();
    simpleVideo.current?.load();
  };
  return (
    <div className="App">
      <div>
        <button onClick={play}>Start</button>
        <button onClick={stop}>Stop</button>
      </div>
      <video
        ref={simpleVideo}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        playsInline
      />
      <video ref={webcamVideo} muted autoPlay playsInline />
    </div>
  );
}

export default App;
