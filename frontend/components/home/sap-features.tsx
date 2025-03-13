import React, { ReactNode } from 'react';
import { ListChecks, Users, Sliders, Link2 } from 'lucide-react';
import Image from 'next/image';

interface FeatureListItemProps {
  icon: ReactNode;
  text: string;
}

interface WorkflowFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const SAPFeatures = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="bg-gradient-to-r from-[#E91E63] to-[#F9A825] rounded-2xl px-8 pt-20 h-[500px]  overflow-hidden">
          <div className="rounded-lg overflow-hidden mx-auto flex justify-center w-full">
            <div className="relative">
              <Image
                src="/frame.png"
                alt="Product showcase"
                width={500}
                height={200}
                className="w-80 h-full object-cover"
              />











            </div>
          </div>
        </div>

        <div>
          <span className="inline-block bg-gray-100 rounded-full px-4 py-1 text-sm mb-4">
            KollaBee Key Features
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Discover the Remarkable Features of SAP
          </h2>
          <p className="text-gray-600 mb-6">
            Explore SAP's standout features that drive productivity and success. From task tracking to seamless collaboration, discover how SAP transforms project management.
          </p>

          <div className="space-y-4">
            <FeatureListItem icon={<ListChecks className="w-5 h-5" />} text="Intuitive Task Management for Streamlined Workflow" />
            <FeatureListItem icon={<Users className="w-5 h-5" />} text="Real-time Collaboration Tools for Enhanced Teamwork" />
            <FeatureListItem icon={<Sliders className="w-5 h-5" />} text="Customizable Dashboards for Tailored Insights" />
            <FeatureListItem icon={<Link2 className="w-5 h-5" />} text="Seamless Integration with Existing Tools and Platforms" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <WorkflowFeature
          icon={<ListChecks className="w-6 h-6" />}
          title="Dynamic Task Management"
          description="Effortlessly assign, track, and prioritize tasks to keep projects on schedule and teams aligned for success."
        />
        <WorkflowFeature
          icon={<Users className="w-6 h-6" />}
          title="Real-time Collaboration"
          description="Enhance teamwork and productivity with instant communication and file sharing."
        />
        <WorkflowFeature
          icon={<Sliders className="w-6 h-6" />}
          title="Agile Workflow Optimization"
          description="Adapt quickly to the changing project requirements with flexible workflows designed."
        />
      </div>
    </div>
  );
};

const FeatureListItem = ({ icon, text }: FeatureListItemProps) => {
  return (
    <div className="flex items-center space-x-3 rounded-3xl border border-[#e6e9ee] p-2">
      <div className="bg-red-500 rounded-full p-2 text-white">
        {icon}
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
};

const WorkflowFeature = ({ icon, title, description }: WorkflowFeatureProps) => {
  return (
    <div className="text-center rounded-2xl border border-[#e6e9ee] p-2">
      <div className="flex items-center justify-center mb-2 gap-4">
        <div className="inline-block  h-4 w-4 rounded-lg ">
          {icon}
        </div>
        <h3 className="font-semibold text-lg m-0">{title}</h3>
      </div>

      <p className="text-gray-600">{description}</p>
    </div>
  );
};
