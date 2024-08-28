import React, { useState, useEffect } from 'react';
import Header from '../Header';

const KeyboardTester = ({ onNext }) => {
  const [pressedKeys, setPressedKeys] = useState([]);

  const keyboardLayout = [
    ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'Scroll Lock', 'Pause'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Fn', 'Windows', 'Alt', 'Space', 'AltGr', 'Ctrl'],
    ['Insert', 'Home', 'Page Up', 'Delete', 'End', 'Page Down'],
    ['Up Arrow', 'Left Arrow', 'Down Arrow', 'Right Arrow'],
    ['Num Lock', 'Numpad /', 'Numpad *', 'Numpad -', 'Numpad 7', 'Numpad 8', 'Numpad 9', 'Numpad +', 'Numpad 4', 'Numpad 5', 'Numpad 6', 'Numpad 1', 'Numpad 2', 'Numpad 3', 'Numpad Enter', 'Numpad 0', 'Numpad .']
  ];

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    const specialKeyMap = {
      ' ': 'Space',
      'CONTROL': 'Ctrl',
      'ALT': 'Alt',
      'SHIFT': 'Shift',
      'META': 'Windows',
      'ARROWLEFT': 'Left Arrow',
      'ARROWRIGHT': 'Right Arrow',
      'ARROWUP': 'Up Arrow',
      'ARROWDOWN': 'Down Arrow',
      'ESCAPE': 'Esc',
      'BACKSPACE': 'Backspace',
      'CAPSLOCK': 'Caps Lock',
      'TAB': 'Tab',
      'ENTER': 'Enter',
      'DELETE': 'Delete',
      'INSERT': 'Insert',
      'PAGEUP': 'Page Up',
      'PAGEDOWN': 'Page Down',
      'HOME': 'Home',
      'END': 'End',
      'NUMLOCK': 'Num Lock'
    };

    const mappedKey = specialKeyMap[key] || key;
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

  const handleSubmit = () => {
    const allKeys = keyboardLayout.flat();
    const unpressedKeys = allKeys.filter(key => !pressedKeys.includes(key));
    onNext(unpressedKeys);
  };

  return (
    <div className="keyboard-container">
      <Header/>
      <div className="keyboard-tester">
        <h2>Press all keys on the keyboard</h2>
        <div className="keyboard">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className={`keyboard-row row-${rowIndex}`}>
              {row.map((key, keyIndex) => (
                <button key={keyIndex} className={pressedKeys.includes(key) ? 'pressed' : ''}>
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} className="submit-button">Next</button>
      </div>
    </div>
  );
};

export default KeyboardTester;
