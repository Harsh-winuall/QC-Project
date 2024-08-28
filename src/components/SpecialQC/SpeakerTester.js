import React, { useEffect, useState } from 'react';
import soundTest from '../../assets/Audios/Sound_Test.mp3'

const SpeakerTester = ({ onNext }) => {
    const [speakerStatus, setSpeakerStatus] = useState('');
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audio] = useState(new Audio(soundTest));

  const handleSubmit = () => {
    if (!speakerStatus) {
      alert("Please select a speaker status before proceeding.");
      return;
    }
    audio.pause();
    setAudioPlaying(false);
    onNext({ speaker: speakerStatus });
  };

  const playTestAudio = () => {
    if(audioPlaying){
        audio.pause();
        setAudioPlaying(false);
    } else{
        audio.play();
        audio.loop = true
        setAudioPlaying(true);
    }
  };

  useEffect(()=>{

    return ()=>{
        audio.pause();
        setAudioPlaying(false);
    }
  },[]);

  return (
    <div className="speaker-tester">
      <h2>Speaker Test</h2>
      <button onClick={playTestAudio} className="play-audio-button">{audioPlaying ? "Pause" : "Play"}</button>
      <div className="speaker-status">
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="Clear Sound"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          Clear Sound
        </label>
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="Distorted Sound"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          Distorted Sound
        </label>
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="Driver Not Detecting"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          Driver Not Detecting
        </label>
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="Good"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          Good
        </label>
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="Major Cracking"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          Major Cracking
        </label>
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="Minor Cracking"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          Minor Cracking
        </label>
        <label>
          <input
            type="radio"
            name="speakerStatus"
            value="No Sound"
            onChange={(e) => setSpeakerStatus(e.target.value)}
          />
          No Sound
        </label>
      </div>
      <button onClick={handleSubmit} className="submit-button">Next</button>
    </div>
  );
};

export default SpeakerTester;
