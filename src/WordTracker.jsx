import React, { useState, useEffect } from 'react';

const WordTracker = () => {
  const [wordTarget, setWordTarget] = useState(0);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [remainingBoxes, setRemainingBoxes] = useState(0);

  useEffect(() => {
    // Load saved data on component mount
    const savedData = JSON.parse(localStorage.getItem('wordTrackerData'));
    if (savedData) {
      setWordTarget(savedData.wordTarget);
      setCurrentWordCount(savedData.currentWordCount);
    }
  }, []);

  useEffect(() => {
    const completedBoxes = Math.floor(currentWordCount / 500);
    const totalBoxes = Math.ceil(wordTarget / 500);
    setRemainingBoxes(totalBoxes - completedBoxes);
  }, [wordTarget, currentWordCount]);

  const handleBoxClick = (boxIndex) => {
    const newCount = Math.min((boxIndex + 1) * 500, wordTarget);
    setCurrentWordCount(newCount);
  };

  const renderBoxes = () => {
    const totalBoxes = Math.ceil(wordTarget / 500);
    const boxes = [];
    for (let i = 0; i < totalBoxes; i++) {
      const isFilled = currentWordCount >= (i + 1) * 500;
      boxes.push(
        <div
          key={i}
          style={{
            width: '30px',
            height: '30px',
            border: '1px solid #ddd',
            display: 'inline-block',
            margin: '3px',
            background: isFilled ? '#4a4a4a' : 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isFilled ? 'inset 0 0 5px rgba(0,0,0,0.2)' : 'none',
          }}
          onClick={() => handleBoxClick(i)}
          onMouseEnter={(e) => { if (!isFilled) e.target.style.backgroundColor = '#f0f0f0' }}
          onMouseLeave={(e) => { if (!isFilled) e.target.style.backgroundColor = 'white' }}
        />
      );
    }
    return boxes;
  };

  const handleSave = () => {
    const dataToSave = {
      wordTarget,
      currentWordCount
    };
    localStorage.setItem('wordTrackerData', JSON.stringify(dataToSave));
    alert('Progress saved successfully!');
  };

  const handleExport = () => {
    const totalBoxes = Math.ceil(wordTarget / 500);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Box Number,Status\n";

    for (let i = 0; i < totalBoxes; i++) {
      const isFilled = currentWordCount >= (i + 1) * 500;
      csvContent += `${i + 1},${isFilled ? 'X' : ''}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "word_tracker_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Word Tracker</h1>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
          Word Target:
          <input
            type="number"
            value={wordTarget}
            onChange={(e) => setWordTarget(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>{renderBoxes()}</div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '4px',
        boxShadow: '0 0 5px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <div>Boxes remaining: <strong>{remainingBoxes}</strong></div>
        <div>Current Word Count: <strong>{currentWordCount}</strong></div>
        <div>Word Target: <strong>{wordTarget}</strong></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleSave} style={buttonStyle}>Save Progress</button>
        <button onClick={handleExport} style={buttonStyle}>Export CSV</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4a4a4a',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default WordTracker;