import React, { useState } from 'react';
import Header from './Header';

const QCForm = ({ qc, onNext }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      onNext(selectedOption);
    }
  };

  return (
    <div className="qcform-container">
      <Header/>
      <form onSubmit={handleSubmit} className="qc-form">
        <h2 className='qcform-title'>{qc.name}</h2>
        <div className="qcform-subtitle">Please select the condition of the device’s Panel B.</div>
        <div className="qc-options">
            {qc.options.map((option, index) => (
              <div key={index} className="qc-option">
                <label className={`radio-label ${selectedOption === option ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  {option}
                </label>
              </div>
            ))}
          </div>
        
        <button type="submit" disabled={!selectedOption}>Next</button>
      </form>
    </div>
  );
};

export default QCForm;
