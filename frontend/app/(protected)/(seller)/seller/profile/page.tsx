import React, { Suspense } from "react";
import KollaBeeProfile from "./clientPage";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KollaBeeProfile />
    </Suspense>
  );
};

export default page;
