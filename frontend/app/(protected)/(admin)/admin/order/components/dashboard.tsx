"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./overview";
import Orders from "./orders";
import Analytics from "./analytics";
import IconRenderer2 from "@/components/buyer/icons-render-from-figma";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // Update the query parameter when the active tab changes
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
          <TabsList className="h-24 px-6 bg-white rounded-lg shadow-sm w-full flex flex-row items-center justify-start">
            <div className="flex flex-col items-center">
              <TabsTrigger
                value="overview"
                className={`flex items-center gap-2 pb-2 ${
                  activeTab === "overview" ? "text-black" : "text-gray-500"
                }`}
              >
                <IconRenderer2 icon="https://s3-alpha-sig.figma.com/img/5827/9bb6/68498b0e692770dce347ee4555fa5952?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Wh~hxHXFzMKWEjK75eQ20PRjuks52ySzL5MlSZRLkKcLtqKe4unNmKQ1CGCh5RPFi1IsxsRZKorPhSjrfBsFIruX85sk31KUGfNKPqzEHw4wbX5aCdde0YThuuhPOXWXpR97ItrsXdlHmv9RG9RUvgnqugN3fObGPaFpUS7QuBHL-UDoN~fH046u-le-lXhNuUOaipeTXQfESnApvBTLS2KDBYobm5y0TAiK8WaeHXaSs6OmS6x6cRmgOxKqQY5GtPE-bpHT02PkCTotmfxrvo4hAd7BkaDwYz10nt5E~qB8GmuB5XEP-fpE2v5uEQY7tj05oz61kqaKamKn9pIyxw__" />
                <span>Overview</span>
              </TabsTrigger>
              {activeTab === "overview" && (
                <div className="w-full h-[1px] bg-gradient-to-r from-red-500 to-orange-500 mt-2"></div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <TabsTrigger
                value="orders"
                className={`flex items-center gap-2 pb-2 border-none shadow-none ${
                  activeTab === "orders" ? "text-black" : "text-gray-500"
                }`}
              >
                <IconRenderer2 icon="https://s3-alpha-sig.figma.com/img/98cf/2f2b/64f16e2045cc7866a56ba4f7d4ea9e03?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iLI7xvLC0eIKYAEkh2TBRjNOP442sQp~bm7OMrT82hVwogK9KZDokEDFFqcgKSnm4iG5XUjmW0KzJihAzoUhu65WaYow7iHjccr4z6d1HFXXYTa6JMMBd4VHSmQeaJXQebh40IQkFhkfjOkODOE34RRFsY7Y4ZeeSruCSKPGVnwcARX4xf6un9vsFZhwreaStiCkUEOoAp3q5aVp2yWsuwIpKgAiz27KPHxTRDZVAarg9D8eUn56iCkm3HxckJAmZZxncI7rgLb~SwcAcj3NULH~1Mi5bQM~070VOplP0A8bBVzJmfgtqjnVW~L3uEQCS~GNsYNDSOud4Eknr2mNpg__" />
                <span>Orders</span>
              </TabsTrigger>
              {activeTab === "orders" && (
                <div className="w-full h-[1px] bg-gradient-to-r from-red-500 to-orange-500 mt-2"></div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <TabsTrigger
                value="analytics"
                className={`flex items-center gap-2 pb-2 ${
                  activeTab === "analytics" ? "text-black" : "text-gray-500"
                }`}
              >
                <IconRenderer2 icon="https://s3-alpha-sig.figma.com/img/46c2/ac63/170d245d56028e6d09765a6affe724fe?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=fqsEqClYivHoQ2Ti97QwbGImG-aDrxEuc0K3hb3wbOVfWzZB~Rpd3R8QA-rl8N0E~Ym9QqVTX40Hlpn~EKw5IL9X7~BzqLXPPW8X8SNpiMNnrS9h0zhqlN24BGGhH~ueniYTnUpkrGAZJ4RbynGRPRVnfg7DyucGrdbzqbqvsW1eTIewYpuNwC2P-H2ziOWtlBUWPtEbXrtXCfuS794o8i9YYCONHgnYTrQeVOh9Rh3F7AE7Lkc8DwTJdyNOfQg0rYQ09A7YxnidqDC8XGrO9G3D-XkSib8f-3bqwaeZ0M2Bd3Y5ZW-uy8zl1kzVeOYsAQtMef5CDHqQ5mCvCQPaGg__" />
                <span>Analytics</span>
              </TabsTrigger>
              {activeTab === "analytics" && (
                <div className="w-full h-[1px] bg-gradient-to-r from-red-500 to-orange-500 mt-2"></div>
              )}
            </div>
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
