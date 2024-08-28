import React, { useState } from 'react';
import QCForm from './QCForm';
import KeyboardTester from './SpecialQC/KeboardTester';
import CameraTester from './SpecialQC/CameraTester';
import SpeakerTester from './SpecialQC/SpeakerTester';
import MicTester from './SpecialQC/MicTester';
import TrackpadTester from './SpecialQC/TrackpadTester';
import DisplayTester from './SpecialQC/DisplayTester';

const qcList = [
  // { name: 'Display Checking (dead pixel test)', type: 'displayTester'},
  { name: 'Keyboard', type: 'keyboardTester' },
  { name: 'Camera', type: 'cameraTester' },
  { name: 'Speaker', type: 'speakerTester' },
  { name: 'Mic', type: 'micTester' },
  { name: 'Trackpad', type: 'trackpadTester' },
  { name: 'Panel A', options: ['Perfect','Not Available', 'Major Scratches', 'Minor Scratches', 'Paint Faded', 'Crack/Broken Panel A', 'Minor Dent', 'Acceptable Scratches', 'Dents and Cracks','Good','Major Scratches (Panel A)'] },
  { name: 'Panel B', options: ['Perfect','Not Available', 'Major Scratches', 'Minor Scratches', 'Paint Faded', 'Crack/Broken Panel B', 'Minor Dent', 'Acceptable Scratches', 'Dents and Cracks','Good','Major Scratches (Panel B)'] },
  { name: 'Panel C', options: ['Perfect','Not Available', 'Major Scratches', 'Minor Scratches', 'Paint Faded', 'Crack/Broken Panel C', 'Minor Dent', 'Acceptable Scratches', 'Dents and Cracks','Good','Major Scratches (Panel C)'] },
  { name: 'Panel D', options: ['Perfect','Not Available', 'Major Scratches', 'Minor Scratches', 'Paint Faded', 'Crack/Broken Panel D', 'Minor Dent', 'Acceptable Scratches', 'Dents and Cracks','Good','Major Scratches (Panel D)'] },
  {name:'Logos', options: ['Faded (Logos)', 'Fully Missing', 'Painted', 'Some Missing', 'Perfect']},
  {name:'Lid gap issue', options:['Perfect', 'Major Gap', 'Minor Gap', 'Major Issue', 'Minor Issue','No Issue']},
  {name:'Screw Issue', options: ['Losse Screw', 'Missing', 'Missing Screws', 'No Issue', 'Perfect', 'Wrong Screws']},
  {name:'Hinge', options: ['Crack/Broken', 'Major Dent', 'Minor Dent', 'Major Scratches','Noise', 'Perfect']},
  {name: 'Colour', options: ['As Expected','Faded', 'Heavily Painted', 'Mismatch','Smelling Paint']},
  {name: 'Cleanliness', options: ['Clean', 'Dusty', 'Stained (Permanent)', 'Stained (Temporary)']},
  {name: 'Smoothness', options: ['Average', 'Perfect', 'Rough', 'Smooth']},
  {name: 'Backside rubber', options: ['Missing', 'Perfect', "Sticky Rubbers"]},
  {name: 'Backlight Checking', options: ['Working', 'Low Light', 'Not Working', 'Not Available']},
  {name: 'USB Port', options: ['All Ports Working', 'All Ports Not Working', 'Driver Not Detecting', 'Not Working', 'Working', 'Some Ports Not Working']},
  {name: 'HDMI Port', options: ['Driver Not Detecting', 'Functional', 'Non-Functional', 'Working', 'Not Working', 'Partially Functional', 'Not Available (HDMI Port)']},
  {name: 'Earphone Port', options: ['Damaged', 'Dusted', 'Functional', 'Non-Functional', 'Partially Functional', 'Working', 'Not Working']},
  {name: 'Charging Port', options: ['Fast Charging', 'Slow Charging', 'Not Charging',' Heat up while Charging']},
  {name: 'Fan Sound', options: ['Noisy', 'Working', 'Not Working']},
  {name: 'Lid Sensor', options: ['Working', 'Not Working']},
  {name: 'Type C ports', options: ['Working', 'Not Working', 'Not Available', 'Driver Not Detecting']},
  // Add all your QCs here in the same format
];

const QCProcess = () => {
  const [currentQCIndex, setCurrentQCIndex] = useState(0);
  const [qcData, setQcData] = useState({});

  const handleNext = (selectedOption) => {   // Takes the selected option from the QC Check and stores it to QCData Object and moves on to next QC..
    const currentQC = qcList[currentQCIndex].name;
    setQcData({ ...qcData, [currentQC]: selectedOption });

    if (currentQCIndex < qcList.length - 1) {
      setCurrentQCIndex(currentQCIndex + 1);
    } else {
      // Submit all QC data to the backend in JSON format
      console.log('Submitting all QC data:', qcData);
      fetch('/api/submit_all_qcs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qcData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    }
  };
  const currentQC = qcList[currentQCIndex];  // Object of QC
  let progressMarkWidth = Math.floor((currentQCIndex*100)/(qcList.length));

  return (
    <div>
      {currentQCIndex < qcList.length ? (
        currentQC.type === 'keyboardTester' ? (
          <KeyboardTester onNext={handleNext} />
        ) : currentQC.type === 'cameraTester' ? (
          <CameraTester onNext={handleNext} />
        ) : currentQC.type === 'speakerTester' ? (
          <SpeakerTester onNext={handleNext}/>
        ) : currentQC.type === 'micTester' ? (
          <MicTester onNext={handleNext} />
        ) : currentQC.type === 'trackpadTester' ? (
          <TrackpadTester onNext={handleNext} /> ) 
          : currentQC.type === 'displayTester' ? (
            <DisplayTester onNext={handleNext}/>
          ) : (
          <QCForm qc={currentQC} onNext={handleNext} />
        )
      ) : (
        <h2>All QCs Completed!</h2>
      )}

      {/* <div className='progress-bar-container'>
        <div
          className='progress-marker'
          style={{
            width: `${progressMarkWidth}%`,
            backgroundColor: '#0056b3',
            height: '10px',
            fontSize: '8px',
            color: 'white',
          }}
        >
          {progressMarkWidth} %
        </div>
      </div> */}
    </div>
  );
};

export default QCProcess;
