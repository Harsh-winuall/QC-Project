import React, { useState, useEffect } from 'react';
import Header from '../Header';

const HotkeyTester = ({ onNext }) => {
  const [pressedKeys, setPressedKeys] = useState([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const hotkeyTests = [
    { instruction: "Press 'Ctrl + C' for Copy", expected: 'Ctrl+C' },
    { instruction: "Press 'Ctrl + V' for Paste", expected: 'Ctrl+V' },
    // Add more hotkey tests as needed
  ];

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.metaKey) modifiers.push('Windows');

    const mappedKey = `${modifiers.join('+')}${modifiers.length ? '+' : ''}${key}`;
    
    if (!pressedKeys.includes(mappedKey)) {
      setPressedKeys([...pressedKeys, mappedKey]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pressedKeys]);

  const handleTestSubmit = () => {
    const currentTest = hotkeyTests[currentTestIndex];
    if (currentTestIndex < hotkeyTests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setPressedKeys([]); // Reset pressed keys for next test
    } else {
      setTestCompleted(true); // Show the final status selection
    }
  };

  const handleFinalSubmit = () => {
    if (selectedOption) {
      onNext(selectedOption); // Pass the selected option to the next component
    }
  };

  const currentTest = hotkeyTests[currentTestIndex];

  return (
    <div className="hotkey-tester-container">
      <Header />
      <div className="hotkey-tester">
        {testCompleted ? (
          <div className="final-status">
            <h2>Hotkey Test Completed</h2>
            <p>Select the status of the hotkeys:</p>
            <div className="status-options">
              <label>
                <input
                  type="radio"
                  name="selectedOption"
                  value="Working"
                  checked={selectedOption === 'Working'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                Working
              </label>
              <label>
                <input
                  type="radio"
                  name="selectedOption"
                  value="Not Working"
                  checked={selectedOption === 'Not Working'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                Not Working
              </label>
              <label>
                <input
                  type="radio"
                  name="selectedOption"
                  value="Driver Not Detecting"
                  checked={selectedOption === 'Driver Not Detecting'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                Driver Not Detecting
              </label>
            </div>
            <button onClick={handleFinalSubmit} className="submit-button">Submit</button>
          </div>
        ) : (
          <div>
            <h2>{currentTest.instruction}</h2>
            <div className="hotkey-instructions">
              <p>Press the keys as instructed above</p>
              <div className="pressed-keys">
                {pressedKeys.map((key, index) => (
                  <span key={index} className="pressed-key">{key}</span>
                ))}
              </div>
            </div>
            <button onClick={handleTestSubmit} className="submit-button">
              {currentTestIndex < hotkeyTests.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotkeyTester;
