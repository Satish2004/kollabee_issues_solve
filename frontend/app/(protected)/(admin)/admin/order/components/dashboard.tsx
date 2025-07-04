"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./overview";
import Orders from "./orders";
import Analytics from "./analytics";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    router.replace(`?tab=${activeTab}`);
  }, [activeTab, router]);

  return (
    <div className="  w-full  space-y-6">
      <div className="rounded-lg shadow-sm p-4">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full gap-4"
        >
          <TabsList className="mb-4 w-full bg-white flex justify-start py-8 px-4 space-x-8">
            <TabsTrigger value="overview" className="text-base rounded-none data-[state=active]:shadow-none  data-[state=active]:border-b-2 border-black px-0">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-base rounded-none data-[state=active]:shadow-none  data-[state=active]:border-b-2 border-black px-0">Orders</TabsTrigger>
            <TabsTrigger value="analytics" className="text-base rounded-none data-[state=active]:shadow-none  data-[state=active]:border-b-2 border-black px-0">Analytics</TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <TabsContent value="overview">
              <Overview />
            </TabsContent>

            <TabsContent value="orders">
              <Orders />
            </TabsContent>

            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
