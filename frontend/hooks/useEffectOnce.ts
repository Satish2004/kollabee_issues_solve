import { useEffect, useRef } from 'react';

export function useEffectOnce(effect: () => void | (() => void)) {
  const destroyFunc = useRef<void | (() => void)>(undefined);
  const effectCalled = useRef<boolean>(false);
  const renderAfterCalled = useRef<boolean>(false);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // Only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // Clean up effect
    return () => {
      if (!renderAfterCalled.current) {
        return;
      }

      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, [effect]);
} 