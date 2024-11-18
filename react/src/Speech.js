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
    <div className="flex flex-col items-center w-[74%] h-full">
        <ReactMic
            record={recording}
            className="sound-wave"
            onStop={onStopRecording}
            strokeColor="#000000"
            backgroundColor="#FF4081"
            mimeType="audio/wav"
            style={{ marginBottom: "10px" }}
        />
        <div className="flex flex-row m-5">
            <button
                onClick={recording ? () => onStopRecording(blob) : onStartRecording}
                className={`
                    px-5 py-2.5 
                    border-none rounded-lg 
                    cursor-pointer
                    text-white
                    transition-colors
                    ${recording ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}
                `}
            >
                {recording ? "Stop Recording" : "Start Recording"}
            </button>
            {audioURL && (
                <button
                    onClick={handleUpload}
                    className="
                        px-5 py-2.5 
                        border-none rounded-lg 
                        cursor-pointer
                        bg-green-500 hover:bg-green-600
                        text-white
                        ml-2.5
                        transition-colors
                    "
                >
                    Upload
                </button>
            )}
        </div>

        {audioURL && (
            <div className="mb-2.5">
                <audio controls src={audioURL} className="mb-2.5"></audio>
            </div>
        )}
        <p className="text-left">{tx}</p>
    </div>
);
};

export default Speech;