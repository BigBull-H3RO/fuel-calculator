import React, { useState } from 'react';
import './App.css';

function App() {
  const [remainingTime, setRemainingTime] = useState('');
  const [lapTime, setLapTime] = useState('');
  const [fuelLeft, setFuelLeft] = useState('');
  const [fuelNeeded, setFuelNeeded] = useState('');

  const calculateFuel = () => {
    const remainingTimeInSec = convertToSeconds(remainingTime);
    const lapTimeInSec = convertToSeconds(lapTime);

    const remainingLaps = remainingTimeInSec / lapTimeInSec;
    const fuelRequired = Math.ceil(remainingLaps - fuelLeft) + 1; // +1 for safety round

    setFuelNeeded(fuelRequired);
  };

  const convertToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  return (
      <div className="App">
          <h1>Fuel Calculator</h1>

        <div className="input-field">
          <label>Verbleibende Zeit (MM:SS):</label>
          <input
              type="text"
              value={remainingTime}
              onChange={(e) => setRemainingTime(e.target.value)}
              placeholder="20:00"
          />
        </div>

        <div className="input-field">
          <label>Rundenzeit (MM:SS):</label>
          <input
              type="text"
              value={lapTime}
              onChange={(e) => setLapTime(e.target.value)}
              placeholder="2:00"
          />
        </div>

        <div className="input-field">
          <label>Verbleibender (Runden):</label>
          <input
              type="number"
              value={fuelLeft}
              onChange={(e) => setFuelLeft(Number(e.target.value))}
              placeholder="10.0"
          />
        </div>

        <button onClick={calculateFuel}>Berechnen</button>

        {fuelNeeded > 0 && (
            <div className="result">
              <h2>Benötigter Sprit: {fuelNeeded} Runden</h2>
            </div>
        )}
      </div>
  );
}

export default App;
