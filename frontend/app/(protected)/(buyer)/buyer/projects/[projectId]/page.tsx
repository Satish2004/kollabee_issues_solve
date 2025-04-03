import React from "react";

const Page = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

  return <div>Hey bro, Project ID: {projectId}</div>;
};

export default Page;
