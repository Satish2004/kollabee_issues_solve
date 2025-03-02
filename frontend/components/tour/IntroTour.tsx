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
    console.log('isReady', isReady);
    if (!isReady) return;
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setEnabled(true);
    }
  }, [isReady]);

  const steps = [
    {
      element: '.tour-products',
      intro: 'Manage your product listings here.',
      position: 'right'
    },
    {
      element: '.tour-chat',
      intro: 'Chat with your customers directly.',
      position: 'right'
    },
    {
      element: '.tour-requests',
      intro: 'View and manage incoming requests.',
      position: 'right'
    },
    {
      element: '.tour-profile-strength',
      intro: 'Track your profile completion progress here.',
      position: 'bottom'
    },
    {
      element: '.tour-customer-reach',
      intro: 'See how many potential customers you can reach.',
      position: 'bottom'
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