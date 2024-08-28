import React, { useEffect, useRef, useState } from 'react';

const TrackpadTester = ({ onNext }) => {
  const [currentTest, setCurrentTest] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [trackpadStatus, setTrackpadStatus] = useState('');
  const [userSelection, setUserSelection] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const textRef = useRef(null);

  // Sample long paragraph
  const paragraph = `
    Technology has revolutionized the way we live, work, and communicate. The advent of the internet has connected billions of people worldwide,
    enabling the exchange of information at unprecedented speeds. Mobile devices, once a luxury, have become essential tools for everyday life,
    allowing us to stay connected wherever we go. Innovations in artificial intelligence and machine learning are reshaping industries,
    from healthcare to finance, by automating complex tasks and providing new insights. Meanwhile, concerns about privacy, data security, and the ethical implications of technology continue to grow. 
    As we move forward, it is crucial to balance the benefits of technological advancement with the need to address these challenges responsibly. 
    The future of technology holds immense potential, but it also requires careful consideration and thoughtful regulation to ensure that its impact is positive for all.
  `;

  // Split paragraph into lines
  const lines = paragraph.trim().split('\n');

  // Define the tests (alternating between whole lines and half lines)
  const tests = [
    lines[0], // full line
    lines[1].substring(0, Math.floor(lines[1].length / 2)), // half line
    lines[2], // full line
    lines[3].substring(Math.floor(lines[3].length / 2)), // half line
    lines[4], // full line
    lines[5].substring(0, Math.floor(lines[5].length / 2)), // half line
  ];

  const handleTextHighlight = () => {
    const selection = window.getSelection().toString().trim();
    setUserSelection(selection);

    if (selection === highlightedText) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect! Try again.');
    }
  };

  const handleNextRound = () => {
    if (currentTest < tests.length - 1) {
      setCurrentTest(currentTest + 1);
      setFeedback('');
      setUserSelection('');
    } else {
      setFeedback('Test completed! Please rate the trackpad.');
    }
  };

  const handleSubmit = () => {
    if (!trackpadStatus) {
      alert("Please select a trackpad status before proceeding.");
      return;
    }
    onNext({ trackpad: trackpadStatus });
  };

  // Set the highlighted text for the current round
  useEffect(() => {
    setHighlightedText(tests[currentTest].trim());
  }, [currentTest]);

  return (
    <div className="trackpad-tester">
      <h2>Trackpad Test</h2>

      {feedback && <p className="feedback">{feedback}</p>}

      <p>Please highlight the following text from the paragraph below:</p>
      <div className="highlighted-text">
        <strong>{highlightedText}</strong>
      </div>

      <div ref={textRef} className="paragraph" onMouseUp={handleTextHighlight}>
        <span>{paragraph}</span>
      </div>

      <button onClick={handleNextRound} disabled={feedback !== 'Correct!'}>
        {currentTest < tests.length - 1 ? 'Next' : 'Finish'}
      </button>

      {currentTest === tests.length - 1 && feedback === 'Correct!' && (
        <div className="trackpad-status">
          <h3>How would you rate the trackpad?</h3>
          <div className="status-options">
            {[
              'Blemished', 'Buttons not working', 'Faded', 'Functional', 'Good',
              'Low Sensitivity', 'Non-Functional', 'Not Smooth', 'Partially Functional', 'Perfect',
            ].map((status) => (
              <label key={status}>
                <input
                  type="radio"
                  name="trackpadStatus"
                  value={status}
                  onChange={(e) => setTrackpadStatus(e.target.value)}
                />
                {status}
              </label>
            ))}
          </div>
          <button onClick={handleSubmit} className="submit-button">Next</button>
        </div>
      )}
    </div>
  );
};

export default TrackpadTester;
