"use client";

import { Suspense } from "react";
import GoogleRedirectPageContent from "./pageContent";

export default function GoogleRedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleRedirectPageContent />
    </Suspense>
  );
}
