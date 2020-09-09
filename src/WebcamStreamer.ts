export default class WebcamStreamer {
  private stream: MediaStream | null;
  constructor() {
    this.stream = null;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return this.stream;
  }
  stop() {
    this.stream?.getTracks().forEach((track) => track.stop());
  }
  getStream() {
    return this.stream;
  }
}
