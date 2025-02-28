"use client";
import { useEffect, useState } from 'react';
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';

export const IntroTour = () => {
  const [enabled, setEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setEnabled(true);
    }
  }, [isReady]);

  const steps = [
    {
      element: '#products-nav',
      intro: 'Manage your product listings here.',
      position: 'right'
    },
    {
      element: '#chat-nav',
      intro: 'Chat with your customers directly.',
      position: 'right'
    },
    {
      element: '#requests-nav',
      intro: 'View and manage incoming requests.',
      position: 'right'
    }
  ];

  const onExit = () => {
    setEnabled(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  return (
    <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={onExit}
      options={{
        doneLabel: 'Finish',
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: false,
        overlayOpacity: 0.5,
        scrollToElement: true,
        tooltipClass: 'customTooltip'
      }}
    />
  );
}; 