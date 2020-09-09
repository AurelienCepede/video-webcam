import React, { RefObject, useEffect, useRef } from "react";
import "./App.css";
import WebcamStreamer from "./WebcamStreamer";
import styled from "styled-components";
import Recorder from "./Recorder";

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

const webcamStreamer = new WebcamStreamer();
let webcamRecorder: Recorder | null = null;

const startWebcam = (webcamVideo: RefObject<HTMLVideoElement>) => {
  if (
    webcamVideo.current !== null &&
    webcamVideo.current.srcObject !== null &&
    "active" in webcamVideo.current.srcObject &&
    webcamVideo.current.srcObject.active
  ) {
    return;
  }
  return webcamStreamer.start().then((stream) => {
    if (webcamVideo.current !== null) {
      webcamVideo.current.srcObject = stream;
      webcamRecorder = new Recorder(stream);
    }
  });
};
const startWebcamCapture = async (
  webcamVideo: RefObject<HTMLVideoElement>,
  handleStop: (url: string | undefined) => void
) => {
  await startWebcam(webcamVideo);
  webcamRecorder?.start(handleStop);
};

function App() {
  const webcamVideo = useRef<HTMLVideoElement>(null);
  const simpleVideo = useRef<HTMLVideoElement>(null);
  const capturedVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    startWebcam(webcamVideo);
    return () => {
      webcamStreamer.stop();
    };
  }, []);
  const play = () => {
    simpleVideo.current?.play();
    startWebcam(webcamVideo);
  };
  const stop = () => {
    webcamRecorder?.stop();
    simpleVideo.current?.pause();
    simpleVideo.current?.load();
    webcamStreamer.stop();
  };
  const capture = () => {
    if (webcamRecorder !== null) {
      console.log("Recording stop");
      webcamRecorder.stop();
    }
    console.log("Recording start");
    startWebcamCapture(webcamVideo, (url) => {
      if (capturedVideo.current !== null && url !== undefined) {
        capturedVideo.current.src = url;
      } else {
        console.error("No url");
      }
    });
  };
  return (
    <Container className="App">
      <div>
        <button onClick={play}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={capture}>Capture</button>
      </div>
      <VideoStyle
        ref={simpleVideo}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        playsInline
      />
      <WebcamStyle ref={webcamVideo} muted autoPlay playsInline />
      <WebcamStyle ref={capturedVideo} controls />
    </Container>
  );
}

export default App;
