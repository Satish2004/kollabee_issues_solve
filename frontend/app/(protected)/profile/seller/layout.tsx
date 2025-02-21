import SellerProfileSidebar from "@/components/profile/seller-profile-sidebar";

export default function ProfileLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">
            <SellerProfileSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}