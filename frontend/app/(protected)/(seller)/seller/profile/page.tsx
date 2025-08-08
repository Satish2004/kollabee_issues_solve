import React, { Suspense } from "react";
import KollaBeeProfile from "./clientPage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KollaBeeProfile />
    </Suspense>
  );
};

export default Page;