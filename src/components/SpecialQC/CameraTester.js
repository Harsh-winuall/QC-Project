import React, { useState, useRef, useEffect } from 'react';
import Header from '../Header';
import CopyrightComponent from '../CopyrightComponent';
import { useNavigate } from 'react-router-dom';

const CameraTester = ({ onNext }) => {
  const [cameraStatus, setCameraStatus] = useState('');
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const navigation = useNavigate();

  // Function to start the camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing the camera: ', error);
      setCameraStatus('Not Working');
    }
  };

  // Stop the camera stream when component unmounts or when moving to the next QC
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleSubmit = () => {
    if (!cameraStatus) {
      alert("Please select a camera status before proceeding.");
      return;
    }

    // Stop the camera stream before moving to the next QC
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    onNext({ camera: cameraStatus });
  };

  return (
    <div className="camera-tester-container">
      <Header/>
      <div className="camera-tester">
        <div className="keyboard-tester-title">
            <div style={{width:"985px", height:"84px", gap:4}}>
              <div style={{display:"flex", alignItems:"center", gap:40}}>
                <i onClick={()=> navigation(-1)} class="fa-solid fa-circle-chevron-left" style={{fontSize:"20px", cursor:"pointer"}}></i>
                <div style={{fontWeight:500, width:"385px", height:"40px", fontSize:"24px", lineHeight:"40px", color:"#101112"}}>Camera Test</div>
              </div>
              <div style={{width:"985px", height:"40px", fontWeight:"400", fontSize:"18px", lineHeight:"16px", color:"#656B70"}}>Start camera by giving permission and mention the issue faced.</div>
            </div>
        </div>
        <button onClick={startCamera} className="start-camera-button">Start Camera</button>
        <div className="camera-feed">
          <video ref={videoRef} autoPlay className="video-frame" />
        </div>
        <div className="camera-status">
          <label>
            <input
              type="radio"
              name="cameraStatus"
              value="Working"
              onChange={(e) => setCameraStatus(e.target.value)}
            />
            Working
          </label>
          <label>
            <input
              type="radio"
              name="cameraStatus"
              value="Not Working"
              onChange={(e) => setCameraStatus(e.target.value)}
            />
            Not Working
          </label>
          <label>
            <input
              type="radio"
              name="cameraStatus"
              value="Distorted Image"
              onChange={(e) => setCameraStatus(e.target.value)}
            />
            Distorted Image
          </label>
          <label>
            <input
              type="radio"
              name="cameraStatus"
              value="Foggy Image"
              onChange={(e) => setCameraStatus(e.target.value)}
            />
            Foggy Image
          </label>
        </div>
        <div className="button-frame">
          <button onClick={handleSubmit} className="next-btn">NEXT</button>
        </div>
      </div>
      <CopyrightComponent/>
    </div>
  );
};

export default CameraTester;
