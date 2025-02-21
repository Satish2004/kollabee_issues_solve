import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Request } from "@/types/api";
import { formatCurrency } from "@/lib/utils/format";

interface RequestCardProps {
  request: Request;
  onAccept: (id: string) => Promise<void>;
}

export function RequestCard({ request, onAccept }: RequestCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{request.productName}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {request.category} {request.subCategory && `- ${request.subCategory}`}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <span className="font-medium">{request.quantity} units</span>
        </div>
        {request.targetPrice && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Target Price</span>
            <span className="font-medium">{formatCurrency(request.targetPrice)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Country</span>
          <span className="font-medium">{request.country}</span>
        </div>
        {request.orderFrequency && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Order Frequency</span>
            <span className="font-medium">{request.orderFrequency}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => onAccept(request.id)}
        >
          Accept Request
        </Button>
      </CardFooter>
    </Card>
  );
} 