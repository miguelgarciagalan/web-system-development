// src/pages/TimerPage.jsx
import { useState } from 'react';
import { useTimer } from '../context/TimerContext.jsx';

const TimerPage = () => {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const { remainingSeconds, totalSeconds, running, startTimer, pauseTimer, resetTimer, format } =
    useTimer();

  const start = () => {
    const total =
      (Number(minutes) > 0 ? Number(minutes) * 60 : 0) +
      (Number(seconds) > 0 ? Number(seconds) : 0);
    if (!total) return;
    startTimer(minutes, seconds);
  };

  const reset = () => {
    resetTimer();
    setMinutes('');
    setSeconds('');
  };

  const progress =
    remainingSeconds && totalSeconds
      ? Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100))
      : 0;

  return (
    <div className="tool-page">
      <div className="tool-card">
        <h2>Timer</h2>
        <div className="timer-inputs">
          <label className="form-label">
            Minutos
            <input
              className="form-input"
              type="number"
              min="0"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="form-label">
            Segundos
            <input
              className="form-input"
              type="number"
              min="0"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              placeholder="0"
            />
          </label>
        </div>
        <div className="timer-display">{format(remainingSeconds)}</div>
        <div className="timer-progress">
          <div className="timer-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="tool-actions">
          <button className="form-submit" type="button" onClick={start} disabled={running}>
            Iniciar
          </button>
          <button
            className="task-btn task-btn-save"
            type="button"
            onClick={pauseTimer}
            disabled={!running}
          >
            Pausar
          </button>
          <button className="task-btn task-btn-cancel" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
