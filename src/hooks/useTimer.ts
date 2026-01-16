import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  skill: string;
  intervalTime: number;
  volume?: number;
}

export const useTimer = ({ skill, intervalTime, volume = 1 }: TimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(intervalTime);
  const timerRef = useRef<number | null>(null);

  const speak = (text: string) => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      speak(`${skill}`);
      setTimeLeft(intervalTime);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, skill, intervalTime, volume]);

  const toggleTimer = () => {
    if (!isActive) {
      setTimeLeft(intervalTime);
      speak(`Starting session. Focus on ${skill}`);
    } else {
      window.speechSynthesis.cancel();
    }
    setIsActive(!isActive);
  };

  return { isActive, timeLeft, toggleTimer, setTimeLeft };
};
