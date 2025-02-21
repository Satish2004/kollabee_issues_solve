import { SellerSidebar } from "@/components/seller-sidebar";
import SellerLayoutHeader from "@/components/seller/layout-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f4f4f4] h-screen flex">
      {/* Fixed Sidebar */}
        <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 w-full overflow-y-auto no-scrollbar">
        <SellerLayoutHeader />
        {children}
      </div>
    </div>
  );
}
