import React, { RefObject, useEffect, useRef } from "react";
import "./App.css";
import WebcamStreamer from "./WebcamStreamer";
import styled from "styled-components";

const VideoStyle = styled.video`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: auto;
  opacity: 0.5;
`;
const WebcamStyle = styled.video`
  width: 100%;
  height: auto;
`;

const Container = styled.div`
  position: relative;
  width: 300px;
  margin: auto;
`;
const startWebcam = (
  webcamStreamer: WebcamStreamer,
  webcamVideo: RefObject<HTMLVideoElement>
) => {
  if (
    webcamVideo.current !== null &&
    webcamVideo.current.srcObject !== null &&
    "active" in webcamVideo.current.srcObject &&
    webcamVideo.current.srcObject.active
  ) {
    return;
  }
  webcamStreamer.start().then((stream) => {
    if (webcamVideo.current !== null) {
      webcamVideo.current.srcObject = stream;
    }
  });
};
function App() {
  const webcamVideo = useRef<HTMLVideoElement>(null);
  const simpleVideo = useRef<HTMLVideoElement>(null);
  const webcamStreamer = new WebcamStreamer();
  useEffect(() => {
    startWebcam(webcamStreamer, webcamVideo);
    return () => {
      webcamStreamer.stop();
    };
  }, [webcamStreamer]);
  const play = () => {
    simpleVideo.current?.play();
    startWebcam(webcamStreamer, webcamVideo);
  };
  const stop = () => {
    simpleVideo.current?.pause();
    simpleVideo.current?.load();
    webcamStreamer.stop();
  };
  return (
    <Container className="App">
      <div>
        <button onClick={play}>Start</button>
        <button onClick={stop}>Stop</button>
      </div>
      <VideoStyle
        ref={simpleVideo}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        playsInline
      />
      <WebcamStyle ref={webcamVideo} muted autoPlay playsInline />
    </Container>
  );
}

export default App;
