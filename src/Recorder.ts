export default class Recorder {
  private mediaRecorder: MediaRecorder;
  private chunks: any;
  private id: number;
  constructor(stream: MediaStream) {
    this.id = Math.random() * Math.random();
    this.mediaRecorder = new MediaRecorder(stream);
  }
  start(handleOnStop: (url: string | undefined) => void) {
    this.mediaRecorder.ondataavailable = (ev) => {
      this.chunks.push(ev.data);
    };
    this.mediaRecorder.onerror = () => {
      throw Error("Erreur lors de l'enregistrement");
    };
    this.mediaRecorder.onstop = () => {
      let blob = new Blob(this.chunks, { type: "video/mp4;" });
      handleOnStop(window.URL.createObjectURL(blob));
    };
    this.chunks = [];
    this.mediaRecorder.start();
  }
  stop() {
    this.mediaRecorder?.state === "recording" && this.mediaRecorder.stop();
  }
}
