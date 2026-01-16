import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  skill: string;
  intervalTime: number;
  volume?: number;
  delay?: number;
}

export const useTimer = ({ skill, intervalTime, volume = 1, delay = 30 }: TimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(intervalTime);
  const [isDelayPhase, setIsDelayPhase] = useState(false);
  const timerRef = useRef<number | null>(null);

  const speak = (text: string) => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const doTimerEffect = () => {
    speak(`${skill}`);
  }

  // Unified timer countdown for both delay and normal phases
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      doTimerEffect();
      if (isDelayPhase) {
        // Delay finished, transition to normal timer
        setIsDelayPhase(false);
        setTimeLeft(intervalTime);
      } else {
        // Normal timer cycle, reset to interval
        setTimeLeft(intervalTime);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isDelayPhase, skill, intervalTime, volume]);

  const toggleTimer = () => {
    if (isActive) {
      // Stopping: cancel everything
      window.speechSynthesis.cancel();
      setIsDelayPhase(false);
      setIsActive(!isActive);
      return;
    }
    
    // Starting: play initial TTS, then start delay phase (or skip if delay is 0)
    speak(`Starting session. Focus on ${skill}`);
    const hasDelay = delay > 0;
    setIsDelayPhase(hasDelay);
    setTimeLeft(hasDelay ? delay : intervalTime);
    setIsActive(!isActive);
  };

  return { isActive, timeLeft, isDelayPhase, toggleTimer, setTimeLeft };
};
