import React, { useEffect, useState } from 'react';
import QCForm from './QCForm';
import KeyboardTester from './SpecialQC/KeboardTester';
import CameraTester from './SpecialQC/CameraTester';
import SpeakerTester from './SpecialQC/SpeakerTester';
import MicTester from './SpecialQC/MicTester';
import TrackpadTester from './SpecialQC/TrackpadTester';
import DisplayTester from './SpecialQC/DisplayTester';
import { useLocation } from 'react-router-dom';
import HotkeyTester from './SpecialQC/HotkeyTester';
import Loader from './Loader';

const qcList = [
  // { name: 'Display Checking (dead pixel test)', type: 'displayTester'},
  // { name: 'Keyboard', type: 'keyboardTester' },
  // { name: 'Camera', type: 'cameraTester' },
  // { name: 'Speaker', type: 'speakerTester' },
  // { name: 'Mic', type: 'micTester' },
  // { name: 'Trackpad', type: 'trackpadTester' },
  {name: 'Hotkeys / Special Characters', type: 'hotkeyTester'},
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
  {name: 'Battery status', options : ['Heating', 'Normal']},
  {name: 'Hardware diagnostic Test', options: ['Passed', 'Failed', 'Warnings']},
  {name:'Touch Screen', options: ['Not Available', 'Working', 'Not working']},
  {name: 'Keypad/light', options: ['Working', 'Not Working', 'Partially Lit']},
  {name: "Trackball", options: ['Not Available', 'Working', 'Rubber Missing', 'Driver Not Detecting', 'Low sencitivity']},
  {name: "SYS TEMP", options: ['100%', '50%-75%','75%','Between 50C and 100C', 'less than 50C', 'Greater than 100C']},

  

  // Add all your QCs here in the same format
];

const QCProcess = () => {
  const location = useLocation();
  const {username, serialNo} = location.state;
  const [currentQCIndex, setCurrentQCIndex] = useState(0);
  const [qcData, setQcData] = useState({});
  const [loading, setLoading] = useState(false); // State to track loading status
  // const [newQcData, setNewQcData] = useState({});
  // const [systemInfo, setSystemInfo] = useState({});
  // const [finalData, setFinalData] = useState({});


  async function handleQcClick() {
    try {

        setLoading(true);
        // Fetch system info
        const systemInfo = await fetchSystemInfo();
        if (!systemInfo) {
          console.error('System info not available, skipping final data preparation.');
          return;
        }

        const updatedQcData = { ...qcData, ...systemInfo };
        // setNewQcData(updatedQcData);


        // Create the finalData object after systemInfo is fetched

        const finalData = {
          serialNo,
          username,
          qcData: updatedQcData, // Use the updated qcData
        };

        console.log('Final Data:', finalData);
        setLoading(false); // Stop the loader after the operation is complete
        // Proceed with submitting finalData or any other operation
    } catch (error) {
        console.error('Error fetching system info:', error);
    }
}

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch system info');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching system info:', error);
      return null; // Return null or a default value in case of failure
    }
  };

  const handleNext = (selectedOption) => {
    const currentQC = qcList[currentQCIndex].name;
    setQcData({ ...qcData, [currentQC]: selectedOption});

    if (currentQCIndex < qcList.length - 1) {
      setCurrentQCIndex(currentQCIndex + 1);
    } else {

      // fetch("/api/summary", 
      //   {
      //     method: "POST",
      //     body: 'hello'
      //   })
      //   .then(res => res.json())
      //   .then(data => {
      //     setSystemInfo(data)
      //   }
      // )

      handleQcClick();
      // console.log(qcData);
      // console.log(systemInfo)
      // fetch('/api/submit_all_qcs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(finalData),
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log(data);
      //   });
    }
  };

  const currentQC = qcList[currentQCIndex];
  let progressMarkWidth = Math.floor((currentQCIndex * 100) / (qcList.length));

  return (
    <div>
      {loading ? ( 
        <Loader /> // Show the loader when loading is true
      ) : currentQCIndex < qcList.length ? (
        currentQC.type === 'keyboardTester' ? (
          <KeyboardTester onNext={handleNext} />
        ) : currentQC.type === 'cameraTester' ? (
          <CameraTester onNext={handleNext} />
        ) : currentQC.type === 'speakerTester' ? (
          <SpeakerTester onNext={handleNext} />
        ) : currentQC.type === 'micTester' ? (
          <MicTester onNext={handleNext} />
        ) : currentQC.type === 'trackpadTester' ? (
          <TrackpadTester onNext={handleNext} />
        ) : currentQC.type === 'displayTester' ? (
          <DisplayTester onNext={handleNext} />
        ) : currentQC.type === 'hotkeyTester' ? (
          <HotkeyTester onNext={handleNext}/>
        ) : (
          <QCForm qc={currentQC} onNext={handleNext} />
        )
      ) : (
        <h2>All QCs Completed!</h2>
      )}

      <div className='progress-bar-container'>
        <div
          className='progress-marker'
          style={{
            width: `${progressMarkWidth}%`,
          }}
        >
          {progressMarkWidth}%
        </div>
      </div>
    </div>
  );
};

export default QCProcess;