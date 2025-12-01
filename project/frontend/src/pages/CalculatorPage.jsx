// src/pages/CalculatorPage.jsx
import { useState } from 'react';

const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '(', ')'];

const CalculatorPage = () => {
  const [display, setDisplay] = useState('');
  const [error, setError] = useState('');

  const append = (val) => {
    setDisplay((prev) => prev + val);
    setError('');
  };

  const clearAll = () => {
    setDisplay('');
    setError('');
  };

  const backspace = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    setError('');
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${display})`);
      const result = fn();
      setDisplay(String(result));
    } catch (err) {
      console.error(err);
      setError('Expresion invalida');
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-card calculator-card">
        <h2>Calculadora</h2>
        <input
          className="calc-display"
          type="text"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          placeholder="Ingresa una expresion"
        />
        {error && <p className="error-text">{error}</p>}
        <div className="calc-grid">
          {buttons.map((b) => (
            <button key={b} type="button" className="calc-btn" onClick={() => append(b)}>
              {b}
            </button>
          ))}
          <button type="button" className="calc-btn span-2" onClick={() => append('+')}>
            +
          </button>
          <button type="button" className="calc-btn" onClick={backspace}>
            ?
          </button>
          <button type="button" className="calc-btn" onClick={clearAll}>
            C
          </button>
          <button type="button" className="calc-btn span-2 primary" onClick={calculate}>
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
