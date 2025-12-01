// src/components/ToolsDropdown.jsx
import { useEffect, useRef, useState } from 'react';

const ToolsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // 'calculator' | 'timer'

  // Calculator
  const [expression, setExpression] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [calcError, setCalcError] = useState('');

  const handleCalculate = () => {
    setCalcError('');
    setCalcResult('');
    if (!expression.trim()) return;
    try {
      // Eval con Function para operaciones simples
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${expression})`);
      const result = fn();
      setCalcResult(String(result));
    } catch (err) {
      console.error(err);
      setCalcError('Expresion invalida');
    }
  };

  // Timer
  const [timerInput, setTimerInput] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const startTimer = () => {
    const seconds = Number(timerInput) * 60;
    if (!seconds || seconds <= 0) return;
    setRemaining(seconds);
    setRunning(true);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(0);
  };

  const formatSeconds = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const toggle = () => setOpen((o) => !o);

  return (
    <div className="tools-dropdown">
      <button type="button" className="toggle-btn" onClick={toggle}>
        Herramientas
      </button>
      {open && (
        <div className="tools-menu">
          <div className="tool-tabs">
            <button
              type="button"
              className={`tool-tab ${selected === 'calculator' ? 'active' : ''}`}
              onClick={() => setSelected(selected === 'calculator' ? null : 'calculator')}
            >
              Calculadora
            </button>
            <button
              type="button"
              className={`tool-tab ${selected === 'timer' ? 'active' : ''}`}
              onClick={() => setSelected(selected === 'timer' ? null : 'timer')}
            >
              Timer
            </button>
          </div>
          {selected === 'calculator' && (
            <div className="tool-panel">
              <input
                className="form-input"
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Ej: (2+3)*4"
              />
              <button type="button" className="form-submit" onClick={handleCalculate}>
                Calcular
              </button>
              {calcResult && <p className="tool-result">Resultado: {calcResult}</p>}
              {calcError && <p className="error-text">{calcError}</p>}
            </div>
          )}
          {selected === 'timer' && (
            <div className="tool-panel">
              <label className="form-label">
                Minutos
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={timerInput}
                  onChange={(e) => setTimerInput(e.target.value)}
                  placeholder="Ej: 5"
                />
              </label>
              <div className="tool-actions">
                <button type="button" className="form-submit" onClick={startTimer} disabled={running}>
                  Iniciar
                </button>
                <button type="button" className="task-btn task-btn-cancel" onClick={stopTimer}>
                  Detener
                </button>
              </div>
              <p className="tool-result">Tiempo: {formatSeconds(remaining)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsDropdown;
