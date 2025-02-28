"use client";
import { useEffect, useState } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const DriverTour = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#profile-strength',
          popover: {
            title: 'Profile Strength',
            description: 'Track your profile completion progress here.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#customer-reach',
          popover: {
            title: 'Customer Reach',
            description: 'See how many potential customers you can reach.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#products-nav',
          popover: {
            title: 'Products',
            description: 'Manage your product listings here.',
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#chat-nav',
          popover: {
            title: 'Chat',
            description: 'Chat with your customers directly.',
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#requests-nav',
          popover: {
            title: 'Requests',
            description: 'View and manage incoming requests.',
            side: "right",
            align: 'start'
          }
        }
      ],
      animate: true,
      showButtons: ['next', 'previous', 'close'],
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      stagePadding: 4,
      onDestroyStarted: () => {
        localStorage.setItem('hasSeenTour', 'true');
      }
    });

    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      try {
        driverObj.drive();
      } catch (error) {
        console.error('Tour error:', error);
      }
    }

    return () => {
      try {
        driverObj.destroy();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, [isReady]);

  return null;
}; 