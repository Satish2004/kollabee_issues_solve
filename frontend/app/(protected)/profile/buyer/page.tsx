import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BuyerProfileEditor from "@/components/profile/edit-profile-buyer";
import { getAddressAction, getUserProfile } from "@/actions/profile";

export const dynamic = "force-dynamic"; 

export default async function ProfilePage() {
  // Fetch user data on the server
  const userData = await getUserProfile();
  const billingAddress = await getAddressAction('BILLING');
  const shippingAddress = await getAddressAction('SHIPPING');

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl text-muted-foreground">Failed to load user data. Please try again later.</h1>
      </div>
    );
  }

  const userInitial = userData.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData?.imageUrl || ''} alt={userData.name || 'User'} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userData.name || 'User'}</h1>
              <p className="text-muted-foreground">{userData.email}</p>
              <Badge variant="outline" className="mt-2">
                {userData.role || 'Buyer'}
              </Badge>
            </div>
          </CardHeader>
          <BuyerProfileEditor
            user={userData}
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
          />
        </Card>
      </div>
    </main>
  );
};
