"use client";
import React, { useEffect } from 'react';
import { CheckoutProvider } from '../../../../../checkout-context';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="">
        <main className="">
            <CheckoutProvider>
          {children}
            </CheckoutProvider>
        </main>
    </div>
  );
}