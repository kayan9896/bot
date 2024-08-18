import React, { useState } from "react";
import { ReactMic } from "react-mic";

const Speech = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [blob, setBlob] = useState(null);
  const [tx,setTx] = useState(null)

  const onStartRecording = () => {
    setRecording(true);
  };

  const onStopRecording = (recordedBlob) => {
    setRecording(false);
    if (recordedBlob && recordedBlob.blob) {
      setBlob(recordedBlob);
      setAudioURL(URL.createObjectURL(recordedBlob.blob));
      console.log(audioURL)
    }
  };

  const handleUpload = async () => {
    if (blob) {
      const formData = new FormData();
      formData.append("audio", blob.blob, "recording.wav");

  try {
    const response = await fetch("https://legendary-fishstick-67w6q66jwxgh4q49-8000.app.github.dev/audio", {
      method:"POST",
      body:formData,
    });
    const data=await response.json()
    console.log("Audio uploaded successfully:", data);
    setTx(data['transcript'])
    
  } catch (error) {
    console.error("Error uploading audio:", error);
  }
}
  };

  return (
      <div style={{ display: "flex", flexDirection:"column", alignItems: "center",width:'74%',height:'100%' }}>
        <ReactMic
          record={recording}
          className="sound-wave"
          onStop={onStopRecording}
          strokeColor="#000000"
          backgroundColor="#FF4081"
          mimeType="audio/wav"
          style={{ marginBottom: "10px" }}
        />
        <div style={{display: "flex", flexDirection:"row",margin:'5px'}}>
        <button
          onClick={recording ? () => onStopRecording(blob) : onStartRecording}
          style={{
            backgroundColor: recording ? "blue" : "gray",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        {audioURL && (
          <button
            onClick={handleUpload}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              marginLeft:'10px'
            }}
          >
            Upload
          </button>
        )}
        </div>
    
      {audioURL && (
        <div>
          <audio controls src={audioURL} style={{ marginBottom: "10px" }}></audio>
        </div>
      )}
      <p style={{textAlign:'left'}}>{tx}</p>
    </div>
  );
};

export default Speech;