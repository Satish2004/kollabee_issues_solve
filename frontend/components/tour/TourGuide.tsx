import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface TourGuideProps {
  isFirstVisit?: boolean;
}

const TourGuide: React.FC<TourGuideProps> = ({ isFirstVisit = true }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only start the tour if it's the user's first visit
    // if (isFirstVisit) {
    //   const hasSeenTour = localStorage.getItem('hasSeenTour');
    //   if (!hasSeenTour) {
    //     setRun(true);
    //   }
    // }
  }, [isFirstVisit]);

  const steps: Step[] = [
    {
      target: '#profile-strength',
      content: 'Track your profile completion progress here. A complete profile helps you connect with more buyers!',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '#customer-reach',
      content: 'See how many potential customers you can reach and track your growth.',
      placement: 'bottom',
    },
    {
      target: '#products-nav',
      content: 'Manage your product listings here.',
      placement: 'right',
    },
    {
      target: '#chat-nav',
      content: 'Chat with your customers.',
      placement: 'right',
    },
    {
      target: '#requests-nav',
      content: 'View and manage incoming requests.',
      placement: 'right',
    },
    {
      target: '.settings-section',
      content: 'Configure your account settings and preferences here.',
      placement: 'bottom',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem('hasSeenTour', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      spotlightClicks
      disableOverlayClose
      hideCloseButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#9e1171',
          backgroundColor: '#ffffff',
          textColor: '#333',
          zIndex: 1000,
          arrowColor: '#ffffff',
        },
        tooltip: {
          padding: '20px',
        },
        buttonNext: {
          backgroundColor: '#9e1171',
          color: '#fff',
          padding: '10px 15px',
        },
        buttonBack: {
          marginRight: 10,
          color: '#666',
        },
        buttonSkip: {
          color: '#666',
        }
      }}
    />
  );
};

export default TourGuide; 