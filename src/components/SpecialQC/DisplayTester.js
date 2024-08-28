import React, { useState } from 'react';

const DisplayTester = ({ onNext }) => {
  const [displayStatus, setDisplayStatus] = useState('');
  const [testStep, setTestStep] = useState(0);

  const colors = ['black', 'white', 'red', 'green', 'blue'];

  const nextColor = () => {
    if (testStep < colors.length - 1) {
      setTestStep(prevStep => prevStep + 1);
    }
  };

  const previousColor = () => {
    if (testStep > 0) {
      setTestStep(prevStep => prevStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!displayStatus) {
      alert("Please select a display status before proceeding.");
      return;
    }
    onNext({ display: displayStatus });
  };

  return (
    <div className="display-tester" style={{ backgroundColor: colors[testStep], height: '100vh' }}>
      <h2>Display Test - Dead Pixel Test</h2>
      <p>
        Use the arrow buttons below to navigate through different color screens. Carefully observe the display for any dead pixels or other anomalies.
      </p>
      <div className="navigation-buttons">
        <button onClick={previousColor} disabled={testStep === 0}>Previous</button>
        <button onClick={nextColor} disabled={testStep === colors.length - 1}>Next</button>
      </div>
      <div className="display-status">
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Good"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Good
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Greater than 3 dots"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Greater than 3 dots
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Less than 3 dots"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Less than 3 dots
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Broken"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Broken
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Horizontal Line"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Horizontal Line
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Vertical Lines"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Vertical Lines
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="KB Imprints"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          KB Imprints
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Major White Patches"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Major White Patches
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Paint Spillage"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Paint Spillage
        </label>
        <label>
          <input
            type="radio"
            name="displayStatus"
            value="Visible Backlight"
            onChange={(e) => setDisplayStatus(e.target.value)}
          />
          Visible Backlight
        </label>
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Next
      </button>
    </div>
  );
};

export default DisplayTester;
