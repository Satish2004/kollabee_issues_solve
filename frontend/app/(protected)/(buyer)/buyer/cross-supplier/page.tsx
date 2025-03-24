"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";
import CreateProjects from "./_component/CreateProjects";

const page = () => {
  const [formActive, setFormActive] = React.useState(false);

  if (formActive) {
    return <CreateProjects setOpen={setFormActive} />;
  }

  return (
    <div className="w-full h-full rounded-xl bg-white border flex flex-col items-center justify-center">
      <h1>You don't have any projects</h1>

      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
          onClick={() => setFormActive(true)}
        >
          <PlusIcon size={32} className="text-white" />
          Create Projects
        </Button>
      </div>
    </div>
  );
};

export default page;
