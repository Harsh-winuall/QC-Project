import React, { useState, useRef, useEffect } from 'react';
import Header from '../Header';

const CameraTester = ({ onNext }) => {
  const [cameraStatus, setCameraStatus] = useState('');
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

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
    <dic className="camera-tester-container">
      <Header/>
      <div className="camera-tester">
        <h2>Camera Test</h2>
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
        <button onClick={handleSubmit} className="submit-button">Next</button>
      </div>
    </dic>
  );
};

export default CameraTester;
