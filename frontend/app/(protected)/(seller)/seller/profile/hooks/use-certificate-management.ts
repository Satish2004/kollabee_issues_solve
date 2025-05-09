"use client";

import { useState } from "react";
import { toast } from "sonner";
import { profileApi } from "@/lib/api/profile";
import { uploadApi } from "@/lib/api";

type UseCertificateManagementProps = {
  formStates: any;
  handleFormChange: (sectionId: string, value: any) => void;
};

export const useCertificateManagement = ({
  formStates,
  handleFormChange,
}: UseCertificateManagementProps) => {
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    image: null,
    issuerName: "",
    expiryDate: null,
    approved: false,
  });

  const handleCertificateUpload = async () => {
    if (
      !newCertificate.name ||
      !newCertificate.image ||
      !newCertificate.issuerName
    ) {
      toast.error("Please provide all required certificate information");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", newCertificate.name);
      formData.append("image", newCertificate.image); // Field name must match backend
      formData.append("issuer", newCertificate.issuerName);

      if (newCertificate.expiryDate) {
        formData.append("expiryDate", newCertificate.expiryDate.toISOString());
      }

      const response = await uploadApi.uploadProfileImage(newCertificate.image);

      // Update certificates list
      const updatedCertificates = [
        ...(formStates.certificates?.certificates || []),
        response,
      ];

      handleFormChange("certificates", {
        ...formStates.certificates,
        certificates: updatedCertificates,
      });

      setCertificateModalOpen(false);
      setNewCertificate({
        name: "",
        image: null,
        issuerName: "",
        expiryDate: null,
      });
      toast.success("Certificate uploaded successfully");
    } catch (error) {
      console.error("Error uploading certificate:", error);
      toast.error("Failed to upload certificate");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveCertificate = async (certificateId: string) => {
    setIsSaving(true);
    try {
      // await profileApi.deleteCertificate(certificateId);

      // Update certificates list
      const updatedCertificates = formStates.certificates.certificates.filter(
        (cert: any) => cert.id !== certificateId
      );

      handleFormChange("certificates", {
        ...formStates.certificates,
        certificates: updatedCertificates,
      });

      toast.success("Certificate removed successfully");
    } catch (error) {
      console.error("Error removing certificate:", error);
      toast.error("Failed to remove certificate");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    certificateModalOpen,
    setCertificateModalOpen,
    newCertificate,
    setNewCertificate,
    isSaving,
    setIsSaving,
    handleCertificateUpload,
    handleRemoveCertificate,
  };
};
