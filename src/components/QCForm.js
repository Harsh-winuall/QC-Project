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
        <h2>{qc.name}</h2>
        {qc.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={handleChange}
              />
              {option}
            </label>
          </div>
        ))}
        
        <button type="submit" disabled={!selectedOption}>Next</button>
      </form>
    </div>
  );
};

export default QCForm;
