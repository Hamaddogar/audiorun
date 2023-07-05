import React, { useEffect, useState } from 'react';
import audioFile from '../src/audio/testd.mp3';

const AudioTextDisplay = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  let recognition = null;
  let audioElement = null;

  const startRecognition = () => {
    recognition = createRecognitionObject();

    recognition.onresult = handleRecognitionResult;
    recognition.onend = handleRecognitionEnd;

    recognition.start();
    setIsListening(true);
  };

  const createRecognitionObject = () => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';

    return recognition;
  };

  const handleRecognitionResult = (event) => {
    const recognizedText = event.results[event.results.length - 1][0].transcript;
    setTranscript((prevTranscript) => prevTranscript + ' ' + recognizedText);
  };

  const handleRecognitionEnd = () => {
    setIsListening(false);
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    audioElement = new Audio(audioFile);
    audioElement.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });

    document.addEventListener('keydown', handleKeyDown); // Add event listener for key press

    return () => {
      if (recognition) {
        recognition.stop();
      }

      document.removeEventListener('keydown', handleKeyDown); // Remove event listener when component unmounts
    };
  }, []);

  const handleKeyDown = () => {
    if (!audioLoaded) {
      audioElement.load();
      audioElement.play().catch((error) => {
        console.log('Audio playback error:', error);
      });
    }

    startRecognition();
  };

  const handleButtonClick = () => {
    if (audioElement && audioLoaded) {
      audioElement.play().catch((error) => {
        console.log('Audio playback error:', error);
      });
      startRecognition();
    }
  };

  return (
    <div className="audio-text-display">
      <div className="audio-controls">
        <button
          className={`audio-button ${isListening ? 'active' : ''}`}
          disabled={isListening || !audioLoaded}
          onClick={handleButtonClick}
        >
          {isListening ? 'Listening...' : 'Start Listening'}
        </button>
      </div>
      <div className="audio-transcript">{transcript}</div>
    </div>
  );
};

export default AudioTextDisplay;
