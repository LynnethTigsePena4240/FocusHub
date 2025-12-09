import { useEffect, useState } from 'react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

type PomodoroState = {
  mode: 'focus' | 'break';
  secLeft: number;
  isRunning: boolean;
};

// Shared global state
let pomodoroState: PomodoroState = {
  mode: 'focus',
  secLeft: FOCUS_TIME,
  isRunning: false,
};

let listeners: (() => void)[] = [];
let intervalId: number | null = null;

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const startInterval = () => {
  if (intervalId !== null) return; // Already running
  intervalId = setInterval(() => {
    if (!pomodoroState.isRunning) return;

    if (pomodoroState.secLeft <= 1) {
      const nextMode = pomodoroState.mode === 'focus' ? 'break' : 'focus';
      pomodoroState = {
        mode: nextMode,
        secLeft: nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME,
        isRunning: false,
      };
    } else {
      pomodoroState = { ...pomodoroState, secLeft: pomodoroState.secLeft - 1 };
    }

    emitChange();
  }, 1000);
};

const stopInterval = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const updateState = (newState: Partial<PomodoroState>) => {
  pomodoroState = { ...pomodoroState, ...newState };
  emitChange();

  if (pomodoroState.isRunning) {
    startInterval();
  } else {
    stopInterval();
  }
};

export const usePomodoro = () => {
  const [state, setState] = useState(pomodoroState);

  useEffect(() => {
    const listener = () => setState({ ...pomodoroState }); // force re-render
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const startPause = () => {
    updateState({ isRunning: !pomodoroState.isRunning });
  };

  const reset = () => {
    updateState({
      secLeft: pomodoroState.mode === 'focus' ? FOCUS_TIME : BREAK_TIME,
      isRunning: false,
    });
  };

  const setMode = (newMode: 'focus' | 'break') => {
    updateState({
      mode: newMode,
      secLeft: newMode === 'focus' ? FOCUS_TIME : BREAK_TIME,
      isRunning: false,
    })
  }

  return { ...state, startPause, reset, setMode };
};
