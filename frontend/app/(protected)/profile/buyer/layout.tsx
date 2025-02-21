import BuyerProfileSidebar from "@/components/profile/buyer-profile-sidebar";

export default function ProfileLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">
            <BuyerProfileSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}