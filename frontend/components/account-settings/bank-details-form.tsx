"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { paymentApi } from "@/lib/api/payment";
import { BankDetail, BankType } from "@/types/api";

interface BankDetailFormProps {
  initialBankDetails?: BankDetail;
}

export function BankDetailForm({ initialBankDetails }: BankDetailFormProps) {
  const [bankDetails, setBankDetails] = useState<Omit<BankDetail, 'id' | 'userId'>>({
    accountName: initialBankDetails?.accountName ?? '',
    accountNumber: initialBankDetails?.accountNumber ?? '',
    bankName: initialBankDetails?.bankName ?? '',
    bankType: initialBankDetails?.bankType ?? BankType.SAVINGS,
    ifscCode: initialBankDetails?.ifscCode ?? '',
    upiId: initialBankDetails?.upiId ?? '',
    createdAt: initialBankDetails?.createdAt ?? new Date().toISOString(),
    updatedAt: initialBankDetails?.updatedAt ?? new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // if (initialBankDetails?.id) {
      //   await paymentApi.updateBankDetail(initialBankDetails.id, bankDetails);
      //   toast.success("Bank account updated successfully");
      // } else {
        await paymentApi.addBankDetail(bankDetails);
        toast.success("Bank account added successfully");
      // }
    } catch (error) {
      console.error('Failed to save bank details:', error);
      toast.error(initialBankDetails ? "Failed to update bank account" : "Failed to add bank account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialBankDetails ? "Update Bank Account" : "Add Bank Account"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Holder Name</Label>
            <Input
              id="accountName"
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankType">Account Type</Label>
            <Select
              value={bankDetails.bankType}
              onValueChange={(value) => setBankDetails(prev => ({ ...prev, bankType: value as BankType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BankType.SAVINGS}>Savings</SelectItem>
                <SelectItem value={BankType.CURRENT}>Current</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              value={bankDetails.ifscCode}
              onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              value={bankDetails.upiId}
              onChange={(e) => setBankDetails(prev => ({ ...prev, upiId: e.target.value }))}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (initialBankDetails ? "Updating..." : "Adding...") : (initialBankDetails ? "Update Bank Account" : "Add Bank Account")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
