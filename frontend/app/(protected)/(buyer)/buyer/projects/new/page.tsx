"use client";

import CreateProjects from "../_component/CreateProjects";
import { FormProvider } from "../_component/create-projects-context";

const ProjectsPage = () => {
  return (
    <FormProvider>
      <div className="px-0 md:px-6 w-full h-full">
        <CreateProjects />
      </div>
    </FormProvider>
  );
};

export default ProjectsPage;
