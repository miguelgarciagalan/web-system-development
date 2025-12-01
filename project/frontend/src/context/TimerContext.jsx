// src/context/TimerContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const TimerContext = createContext(null);
const STORAGE_KEY = 'studycalendar_timer';

const loadStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error(err);
    return null;
  }
};

const saveStored = (payload) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error(err);
  }
};

const clearStored = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error(err);
  }
};

export const TimerProvider = ({ children }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const intervalRef = useRef(null);

  // Restaurar estado guardado
  useEffect(() => {
    const stored = loadStored();
    if (stored && stored.totalSeconds) {
      const now = Date.now();
      if (stored.endTime && stored.endTime > now) {
        const remaining = Math.max(0, Math.round((stored.endTime - now) / 1000));
        setRemainingSeconds(remaining);
        setTotalSeconds(stored.totalSeconds);
        setEndTime(stored.endTime);
        setRunning(true);
      } else if (stored.remainingSeconds && stored.remainingSeconds > 0) {
        setRemainingSeconds(stored.remainingSeconds);
        setTotalSeconds(stored.totalSeconds || stored.remainingSeconds);
        setRunning(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setEndTime(null);
          clearStored();
          return 0;
        }
        const now = Date.now();
        saveStored({
          endTime,
          totalSeconds,
          remainingSeconds: next,
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, endTime, totalSeconds]);

  const startTimer = (mins, secs) => {
    const total = Math.max(0, Number(mins || 0) * 60 + Number(secs || 0));
    if (!total) return;
    const end = Date.now() + total * 1000;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setEndTime(end);
    setRunning(true);
    saveStored({ endTime: end, totalSeconds: total, remainingSeconds: total });
  };

  const pauseTimer = () => {
    setRunning(false);
    setEndTime(null);
    saveStored({
      endTime: null,
      totalSeconds,
      remainingSeconds,
    });
  };

  const resetTimer = () => {
    setRunning(false);
    setEndTime(null);
    setRemainingSeconds(0);
    setTotalSeconds(0);
    clearStored();
  };

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider
      value={{
        remainingSeconds,
        totalSeconds,
        running,
        startTimer,
        pauseTimer,
        resetTimer,
        format,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer debe usarse dentro de TimerProvider');
  return ctx;
};
