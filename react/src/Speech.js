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
        setTx(data['transcript']['message'])
        
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    }
  };

  return (
    <div>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStopRecording}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        mimeType="audio/wav"
      />
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
        <div>
          <audio controls src={audioURL}></audio>
          <button
            onClick={handleUpload}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
            }}
          >
            Upload
          </button>
        </div>
      )}
      <p>{tx}</p>
    </div>
  );
};

export default Speech;

/*import React, { useState, useRef } from "react";
import ReactAudioRecorder from "react-audio-recorder";
import ReactPlayer from "react-player";
import axios from "axios";  
const Speech = () => {
  const [recordState, setRecordState] = useState("inactive");  
  const [audioData, setAudioData] = useState(null);  
  const [audioUrl, setAudioUrl] = useState(null);  
  const recorderRef =useRef(null); 
  const handleRecord = () => {
    setRecordState((prevState) => {
      return prevState === "inactive" ? "recording" : "inactive";  
    }); 
  };  
  const handleStop = (audioDataBlob) => {
    // Set the recorded audio data to the state
    setAudioData(audioDataBlob); 
    setRecordState("inactive");  }; 
    const handleUpload = async () => {   
    const formData = new FormData(); 
    formData.append("audio", audioData);     
    try {      
      const response = await axios.post("https://legendary-fishstick-67w6q66jwxgh4q49-8000.app.github.dev/audio", formData, {         
        headers: {"Content-Type": "multipart/form-data",},       });     // Handle successful upload      
        console.log("Audio uploaded successfully:", response.data);      
        setAudioUrl(response.data.audioUrl);    } 
    catch (error) {      // Handle error      
      console.error("Error uploading audio:", error);    }  };  
    return (  
    <div>  
      {recordState === "recording" ? (<button onClick={handleRecord} style={{ backgroundColor: "blue" }}>          Stop Recording        </button>   ) :   
      (<button onClick={handleRecord}>Start Recording</button>)}  

      {audioUrl && <ReactPlayer url={audioUrl} playing={true} />}  
      {audioData && <ReactPlayer url={URL.createObjectURL(audioData)} playing={true} />}        

      {recordState === "inactive" && <button onClick={handleUpload}>Upload</button>}     
      <ReactAudioRecorder   ref={recorderRef}   state={recordState}   onStop={handleStop}   style={{ display: "none" }} />  
    </div>  );};  
export default Speech;*/