import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils/format";

interface TopBuyerProps {
  id: string;
  totalOrders: number;
  totalSpent: number;
  buyer: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
}

interface TopBuyersTableProps {
  buyers: TopBuyerProps[];
}

export function TopBuyersTable({ buyers }: TopBuyersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Buyers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {buyers.filter(b => b.buyer).map((buyer) => (
            <div key={buyer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={buyer.buyer.imageUrl} />
                  <AvatarFallback>{buyer.buyer.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{buyer.buyer.name}</p>
                  <p className="text-sm text-muted-foreground">{buyer.buyer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(buyer.totalSpent)}</p>
                <p className="text-sm text-muted-foreground">{buyer.totalOrders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 