import { useState, useEffect, useCallback } from "react";

export function useLockout(
  storageKey: string,
  maxAttempts: number,
  lockDuration: number // in seconds
) {
  const attemptsKey = `${storageKey}Attempts`;
  const lockoutKey = `${storageKey}LockoutEnd`;

  const [attempts, setAttempts] = useState<number>(() => {
    const saved = localStorage.getItem(attemptsKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lockoutTime, setLockoutTime] = useState<number>(0);

  // Initialize lockout based on saved end timestamp
  useEffect(() => {
    const savedEnd = localStorage.getItem(lockoutKey);
    if (savedEnd) {
      const remaining = Math.max(
        0,
        Math.floor((parseInt(savedEnd, 10) - Date.now()) / 1000)
      );
      setLockoutTime(remaining);
    }
  }, []);

  // Timer tick every second
  useEffect(() => {
    if (lockoutTime <= 0) return;

    const interval = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(lockoutKey);
          setAttempts(0);
          localStorage.removeItem(attemptsKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime > 0]); // only re-run if lockout starts

  // Save attempts to localStorage
  useEffect(() => {
    localStorage.setItem(attemptsKey, attempts.toString());
  }, [attempts]);

  const incrementAttempts = useCallback(() => {
    setAttempts((prev) => {
      const newAttempts = prev + 1;
      if (newAttempts >= maxAttempts) {
        const lockEndTime = Date.now() + lockDuration * 1000;
        localStorage.setItem(lockoutKey, lockEndTime.toString());
        setLockoutTime(lockDuration);
      }
      return newAttempts;
    });
  }, [maxAttempts, lockDuration]);

  const resetAttempts = useCallback(() => {
    setAttempts(0);
    setLockoutTime(0);
    localStorage.removeItem(attemptsKey);
    localStorage.removeItem(lockoutKey);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return {
    attempts,
    lockoutTime,
    incrementAttempts,
    resetAttempts,
    formatTime,
    isLockedOut: lockoutTime > 0,
  };
}
