import React, { useState, useEffect } from 'react';
import Header from '../Header';

const MicTester = ({ onNext }) => {
    const [micStatus, setMicStatus] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [error, setError] = useState(null);
    const [testSentence, setTestSentence] = useState('');

    useEffect(() => {
        // Check if the browser supports the Web Speech API
        if (!('webkitSpeechRecognition' in window)) {
            setError('Speech recognition is not supported in your browser.');
            return;
        }

        const speechRecognition = new window.webkitSpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        speechRecognition.lang = 'en-US';

        speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            const correctTranscript = transcript.substring(0,transcript.length-1).trim()
            setRecognizedText(correctTranscript);

            if (recognizedText.toLowerCase() === testSentence.toLowerCase()) {
                setMicStatus('Good');
            } else {
                setMicStatus('Unclear');
            }
        };

        speechRecognition.onerror = (event) => {
            setError(`Speech recognition error: ${event.error}`);
        };

        setRecognition(speechRecognition);
    }, []);

    const startRecording = () => {
        if (recognition) {
            setRecognizedText('');
            setMicStatus('');
            recognition.start();
        }
    };

    const handleSubmit = () => {
        if (!micStatus) {
            alert('Please complete the test before proceeding.');
            return;
        }
        onNext({ microphone: micStatus });
    };

    useEffect(() => {
        // Set a predefined sentence for the test
        setTestSentence("The quick brown fox jumps over the lazy dog");
    }, []);

    return (
        <div className="mic-test-container">
            <Header/>
            <div className="mic-tester">
                <h2>Microphone Test</h2>
                {error && <p className="error">{error}</p>}
                <p>Sentence to read: <strong>{testSentence}</strong></p>
                <button onClick={startRecording} className="record-button">
                    Start Recording
                </button>
                {recognizedText && (
                    <div>
                        <p>Recognized Text: <strong>{recognizedText}</strong></p>
                        <p>Mic Status: <strong>{micStatus}</strong></p>
                    </div>
                )}
                <div className="mic-status">
                    <label>
                        <input
                            type="radio"
                            name="micStatus"
                            value="Good"
                            checked={micStatus === 'Good'}
                            readOnly
                        />
                        Good
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="micStatus"
                            value="Unclear"
                            checked={micStatus === 'Unclear'}
                            readOnly
                        />
                        Unclear
                    </label>
                </div>
                <button onClick={handleSubmit} className="submit-button">
                    Next
                </button>
            </div>
        </div>
    );
};

export default MicTester;
