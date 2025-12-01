// src/components/TimerWidget.jsx
import { useTimer } from '../context/TimerContext.jsx';

const TimerWidget = () => {
  const { remainingSeconds, running, format, pauseTimer, resetTimer } = useTimer();

  if (!remainingSeconds) return null;

  return (
    <div className="timer-widget">
      <div className="timer-widget-header">
        <span>Timer</span>
        <span className={`dot ${running ? 'on' : 'off'}`}></span>
      </div>
      <div className="timer-widget-body">
        <span className="timer-widget-time">{format(remainingSeconds)}</span>
      </div>
      <div className="timer-widget-actions">
        <button type="button" className="task-btn task-btn-save" onClick={pauseTimer}>
          {running ? 'Pausar' : 'Pausado'}
        </button>
        <button type="button" className="task-btn task-btn-delete" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerWidget;
