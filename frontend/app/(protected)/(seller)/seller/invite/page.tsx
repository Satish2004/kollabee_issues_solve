"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Copy,
  Share2,
  Mail,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { inviteApi } from "@/lib/api/invite";

const InvitePage = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("email:", email);
  }, [email]);

  // Get the shareable URL from environment variable
  const shareableUrl = process.env.NEXT_PUBLIC_APP_URL;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl ?? "");
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

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      console.log("email: ", email);
      await inviteApi.sendInvite(email);
      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${email}`,
      });
      setEmail("");
      setError(null); // Clear errors on success
    } catch (error: any) {
      if (error.response?.data?.email) {
        setError(
          error.response?.data?.email + " " + error.response.data.message
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Clear errors when input changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-12 border-b">
        <div className="  px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-7 w-7" />
                Invite Collaborators
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                Share access with your team members, clients, or friends to
                collaborate on this project.
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={copyToClipboard}
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied!" : "Share Link"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="  py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column - Sharing options */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Share Link
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Invite
                </TabsTrigger>
              </TabsList>

              <TabsContent value="link">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Copy className="h-5 w-5" />
                      Share via Link
                    </CardTitle>
                    <CardDescription>
                      Copy this unique link to share access with anyone
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
                </Card>
              </TabsContent>

              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Invite via Email
                    </CardTitle>
                    <CardDescription>
                      Send an email invitation directly to your collaborators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={sendInvite} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email address
                        </label>
                        <div className="flex flex-col gap-2">
                          <Input
                            id="email"
                            type="text"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={handleInputChange}
                            required
                          />
                          {error && (
                            <p className="text-sm text-red-500">{error}</p>
                          )}
                        </div>
                        <Button disabled={isLoading} type="submit">
                          Send
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500">
                        Separate multiple emails with commas
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Benefits and info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Why Invite Others?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-gray-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Connect the Ecosystem</h4>
                    <p className="text-sm text-gray-600">
                      Bring your buyers and suppliers together in one platform
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-gray-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Better Products</h4>
                    <p className="text-sm text-gray-600">
                      Create greater futuristic products through collaboration
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-gray-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Maximize Value</h4>
                    <p className="text-sm text-gray-600">
                      Help everyone get the best out of their business
                      relationships
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;
