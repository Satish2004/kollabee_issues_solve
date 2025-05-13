"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get the shareable URL from environment variable
  const shareableUrl =
    process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);

      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard.",
        variant: "destructive",
      });
    }
  };

return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share with others
          </CardTitle>
          <CardDescription>
            Share this link with others to give them access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={shareableUrl}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
