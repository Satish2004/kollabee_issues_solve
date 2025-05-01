"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "./create-projects-context";
import { uploadApi } from "@/lib/api/upload";
import { X, Upload, ImageIcon } from "lucide-react";

interface Step1Props {
  handleNext: () => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Step1: React.FC<Step1Props> = ({ handleNext, errors, setErrors }) => {
  const { formData, updateFormData } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCertifications, setFilteredCertifications] = useState<
    string[]
  >([]);
  const [showCertificateSearch, setShowCertificateSearch] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; publicId: string }[]
  >([]);
  const [showProductCategories, setShowProductCategories] = useState(false);

  // Product categories based on project type
  const productCategories = {
    "custom-manufacturing": [
      "Ayurveda & Herbal",
      "Beauty",
      "Beverages",
      "Cosmetics",
      "Cleaning, Home Care & Kitchen",
      "Consumer Electronics",
      "Food",
      "Furniture & Home Decor",
      "Health & Wellness",
      "Ingredients",
      "Flavours",
      "Fragrances",
      "Mother & Baby Care",
      "Natural & Organic Products",
      "Personal Care & Hygiene",
      "Pet Care Products",
      "Tea & Coffee",
      "Textiles & Apparel",
      "Toys",
      "Other",
    ],
    "packaging-only": [
      "Primary Packaging",
      "Secondary Packaging",
      "Bottles (Glass or Plastic)",
      "Jars (Glass, PET, Acrylic)",
      "Tubes (Aluminum, Plastic, Laminated)",
      "Sachets / Sample Packs",
      "Blister Packaging",
      "Flexible Packaging",
      "Stand-up Pouches",
      "Flat Pouches",
      "Sleeves & Wraps",
      "Rigid Boxes",
      "Folding Cartons",
      "Mailing / Shipping Boxes",
      "Luxury / Gift Packaging",
      "Pumps & Dispensers",
      "Caps & Closures",
      "Custom Inserts / Trays",
      "Labels & Stickers",
      "Sustainable / Eco-Friendly Packaging",
    ],
    "services-brand-support": [
      "Brand Strategy & Development",
      "Design & Creative Services",
      "Digital Marketing",
      "Web & E-Commerce Development",
      "Photography & Videography",
      "Market Research & Analytics",
      "Public Relations & Outreach",
      "Retail & E-Commerce Strategy",
      "Content Creation & Copywriting",
      "Consulting Services",
      "Other",
    ],
  };

  // All available certifications
  const allCertifications = [
    "FSC Certified",
    "B Corp Certified",
    "ISO 14001",
    "Cradle to Cradle Certified",
    "Fair Trade Certified",
    "Global Recycled Standard (GRS)",
    "EcoCert",
    "FDA Registered",
    "cGMP Certified",
    "ISO 22000",
    "ISO 9001",
    "NSF Certified",
    "HACCP Certified",
    "Kosher Certified",
    "Halal Certified",
    "UL Certified",
    "RoHS Compliant",
    "ISO 13485",
    "REACH Compliance",
    "CE Marking",
    "SA8000 Certified",
    "BSCI Certified",
    "SEDEX Member",
    "SMETA Audited",
    "GOTS Certified",
    "Non-GMO Verified",
    "Oeko-Tex® Standard 100",
    "NATRUE Certified",
    "ISO 22716 Certified",
    "ISO 50001 Certified",
    "PEFC",
    "USDA Organic",
    "Vegan Certification",
    "Energy Star",
    "Plastic-Free Certification",
  ];

  useEffect(() => {
    if (searchTerm) {
      const filtered = allCertifications.filter((cert) =>
        cert.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCertifications(filtered);
    } else {
      setFilteredCertifications([]);
    }
  }, [searchTerm]);

  const handleChange = (field: string, value: string) => {
    updateFormData(field, value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const response = await uploadApi.uploadProductImage(file);
      if (response && response.url) {
        const newFile = {
          url: response.url,
          publicId: response.public_id,
        };
        setUploadedFiles([...uploadedFiles, newFile]);
        updateFormData("referenceFiles", [
          ...(formData.referenceFiles || []),
          newFile,
        ]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (publicId: string) => {
    try {
      await uploadApi.deleteImage(publicId);
      const updatedFiles = uploadedFiles.filter(
        (file) => file.publicId !== publicId
      );
      setUploadedFiles(updatedFiles);
      updateFormData("referenceFiles", updatedFiles);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const toggleCertification = (cert: string) => {
    const currentCerts = formData.certifications || [];
    if (currentCerts.includes(cert)) {
      updateFormData(
        "certifications",
        currentCerts.filter((c) => c !== cert)
      );
    } else {
      updateFormData("certifications", [...currentCerts, cert]);
    }
  };

  // Render different forms based on project type
  const renderCustomManufacturingForm = () => (
    <div className="space-y-8 font-futura font-normal">
      {/* Section 01. Project Information */}
      <div>
        <h2 className="text-lg font-medium mb-4">01. Project Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="text-sm font-normal">
              Project title<span className="text-[#EA3D4F]">*</span>
            </Label>
            <Input
              id="projectTitle"
              placeholder="What should we call this project? (e.g., Organic Hair Oil Line)"
              value={formData.projectTitle || ""}
              onChange={(e) => handleChange("projectTitle", e.target.value)}
              className="w-full font-normal"
            />
            {errors.projectTitle && (
              <p className="text-red-500 text-sm font-normal">
                {errors.projectTitle}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productCategory" className="text-sm font-normal">
              Product category<span className="text-[#EA3D4F]">*</span>
            </Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProductCategories(!showProductCategories)}
                className="w-full justify-between font-normal"
              >
                {formData.productCategory?.length > 0
                  ? `${formData.productCategory.length} categories selected`
                  : "Select one or more relevant product types"}
                <span className="ml-2 opacity-70">
                  {showProductCategories ? "▲" : "▼"}
                </span>
              </Button>

              {showProductCategories && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2">
                    {productCategories["custom-manufacturing"].map(
                      (category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                        >
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={(formData.productCategory || []).includes(
                              category
                            )}
                            onChange={() => {
                              const currentCategories =
                                formData.productCategory || [];
                              if (currentCategories.includes(category)) {
                                updateFormData(
                                  "productCategory",
                                  currentCategories.filter(
                                    (c) => c !== category
                                  )
                                );
                              } else {
                                updateFormData("productCategory", [
                                  ...currentCategories,
                                  category,
                                ]);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {(formData.productCategory || []).length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-normal mb-2">Selected Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {(formData.productCategory || []).map((category) => (
                    <div
                      key={category}
                      className="bg-gray-100 rounded-full px-3 py-1 text-sm font-normal flex items-center"
                    >
                      {category}
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          const currentCategories =
                            formData.productCategory || [];
                          updateFormData(
                            "productCategory",
                            currentCategories.filter((c) => c !== category)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.productCategory && (
              <p className="text-red-500 text-sm font-normal">
                {errors.productCategory}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="productDescription" className="text-sm font-normal">
            Tell us about your product<span className="text-[#EA3D4F]">*</span>
          </Label>
          <Textarea
            id="productDescription"
            placeholder="Provide a description of your product, what it should look like, feel like, and any key ingredients or materials that need to be included."
            value={formData.productDescription || ""}
            onChange={(e) => handleChange("productDescription", e.target.value)}
            className="min-h-[120px] font-normal"
          />
          {errors.productDescription && (
            <p className="text-red-500 text-sm font-normal">
              {errors.productDescription}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal">
            Do You Have a Product Design or Formula?
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <RadioGroup
            value={formData.hasDesignOrFormula || ""}
            onValueChange={(value) => handleChange("hasDesignOrFormula", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 font-normal">
              <RadioGroupItem value="yes" id="has-design-yes" />
              <Label htmlFor="has-design-yes" className="text-sm font-normal ">
                Yes, I have a design or formula for this product.
              </Label>
            </div>
            <div className="flex items-center space-x-2 font-normal">
              <RadioGroupItem value="no" id="has-design-no" />
              <Label htmlFor="has-design-no" className="text-sm font-normal ">
                No, I need help developing a formula/design.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rebrand" id="has-design-rebrand" />
              <Label
                htmlFor="has-design-rebrand"
                className="text-sm font-normal "
              >
                I want to rebrand an existing product (Private/White Label).
              </Label>
            </div>
          </RadioGroup>
          {errors.hasDesignOrFormula && (
            <p className="text-red-500 text-sm font-normal">
              {errors.hasDesignOrFormula}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-normal">
            Product Customization Preferences
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <RadioGroup
            value={formData.customizationLevel || ""}
            onValueChange={(value) => handleChange("customizationLevel", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="slight" id="customization-slight" />
              <Label
                htmlFor="customization-slight"
                className="text-sm font-normal"
              >
                Slight modifications to an existing product
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="customization-full" />
              <Label
                htmlFor="customization-full"
                className="text-sm font-normal "
              >
                Fully custom product/design (from scratch)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ready" id="customization-ready" />
              <Label
                htmlFor="customization-ready"
                className="text-sm font-normal "
              >
                Ready-made product with private/white label rebranding
              </Label>
            </div>
          </RadioGroup>
          {errors.customizationLevel && (
            <p className="text-red-500 text-sm font-normal">
              {errors.customizationLevel}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal">
            Upload references (Optional)
          </Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 font-normal">
                  {uploading
                    ? "Uploading..."
                    : "Upload design files, product sketches, inspiration images, etc."}
                </span>
              </div>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="border rounded-md overflow-hidden h-24 flex items-center justify-center">
                    {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt="Reference"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate max-w-full">
                          {file.url.split("/").pop()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFile(file.publicId)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-normal">
              What certifications should the supplier have? (Optional)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-normal font-futura"
              onClick={() => setShowCertificateSearch(!showCertificateSearch)}
            >
              {showCertificateSearch ? "Hide Search" : "Search Certifications"}
            </Button>
          </div>

          {showCertificateSearch && (
            <div className="space-y-4 border rounded-md p-4">
              <Input
                placeholder="Search for certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full font-normal"
              />

              {filteredCertifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredCertifications.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`cert-${cert}`}
                        checked={(formData.certifications || []).includes(cert)}
                        onChange={() => toggleCertification(cert)}
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`cert-${cert}`}
                        className="text-sm font-normal"
                      >
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <p className="text-sm font-normal text-gray-500">
                  No certifications found matching your search.
                </p>
              ) : (
                <p className="text-sm font-normal text-gray-500">
                  Type to search for certifications.
                </p>
              )}
            </div>
          )}

          {(formData.certifications || []).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-normal mb-2">
                Selected Certifications:
              </p>
              <div className="flex flex-wrap gap-2">
                {(formData.certifications || []).map((cert) => (
                  <div
                    key={cert}
                    className="bg-gray-100 rounded-full px-3 py-1 text-sm font-normal flex items-center"
                  >
                    {cert}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => toggleCertification(cert)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 02. Product Requirements */}
      <div>
        <h2 className="text-lg font-medium mb-4">02. Product Requirements</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do You Have a Target Retail Price for Your Product? (Optional)
            </Label>
            <RadioGroup
              value={formData.hasTargetPrice || ""}
              onValueChange={(value) => handleChange("hasTargetPrice", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="target-price-yes" />
                <Label
                  htmlFor="target-price-yes"
                  className="text-sm font-normal "
                >
                  Yes, I have a target price.
                </Label>
              </div>
              {formData.hasTargetPrice === "yes" && (
                <Input
                  placeholder="Enter target price (e.g., $50)"
                  value={formData.targetPrice || ""}
                  onChange={(e) => handleChange("targetPrice", e.target.value)}
                  className="w-full max-w-xs ml-6"
                />
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="target-price-no" />
                <Label
                  htmlFor="target-price-no"
                  className="text-sm font-normal"
                >
                  No, I do not have a target price yet.
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do You Need a Custom Sample Before Production?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <RadioGroup
              value={formData.needsSample || ""}
              onValueChange={(value) => handleChange("needsSample", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sample-yes" />
                <Label htmlFor="sample-yes" className="text-sm font-normal">
                  Yes, I would like to receive a custom sample before
                  proceeding.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sample-no" />
                <Label htmlFor="sample-no" className="text-sm font-normal">
                  No, I do not need a custom sample before production.
                </Label>
              </div>
            </RadioGroup>
            {errors.needsSample && (
              <p className="text-red-500 text-sm font-normal">
                {errors.needsSample}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do You Require Packaging with Your Product?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <RadioGroup
              value={formData.needsPackaging || ""}
              onValueChange={(value) => handleChange("needsPackaging", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="packaging-yes" />
                <Label htmlFor="packaging-yes" className="text-sm font-normal ">
                  Yes — I need custom packaging for this product.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="packaging-no" />
                <Label htmlFor="packaging-no" className="text-sm font-normal">
                  No — I only need the product itself (no packaging).
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="have" id="packaging-have" />
                <Label htmlFor="packaging-have" className="text-sm font-normal">
                  I already have packaging designed.
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 italic mt-1">
              🛈 You can add a packaging project after this one if needed.
            </p>
            {errors.needsPackaging && (
              <p className="text-red-500 text-sm font-normal">
                {errors.needsPackaging}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do You Need Design for Your Product or Packaging?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <RadioGroup
              value={formData.needsDesign || ""}
              onValueChange={(value) => handleChange("needsDesign", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="design-yes" />
                <Label htmlFor="design-yes" className="text-sm font-normal">
                  Yes, I need design services for my product or packaging.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="design-no" />
                <Label htmlFor="design-no" className="text-sm font-normal">
                  No, I do not need design services.
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 italic mt-1">
              🛈 You can add a Services & Brand Support project after the
              completed one if needed.
            </p>
            {errors.needsDesign && (
              <p className="text-red-500 text-sm font-normal">
                {errors.needsDesign}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackagingOnlyForm = () => (
    <div className="space-y-8 font-futura font-normal">
      {/* Section 01. Project Information */}
      <div>
        <h2 className="text-lg font-medium mb-4">01. Project Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="text-sm font-normal">
              Project Title<span className="text-[#EA3D4F]">*</span>
            </Label>
            <Input
              id="projectTitle"
              placeholder="What should we call this packaging project?"
              value={formData.projectTitle || ""}
              onChange={(e) => handleChange("projectTitle", e.target.value)}
              className="w-full"
            />
            {errors.projectTitle && (
              <p className="text-red-500 text-sm font-normal">
                {errors.projectTitle}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="packagingCategory" className="text-sm font-normal">
              What kind of packaging are you looking for?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <Select
              value={formData.packagingCategory || ""}
              onValueChange={(value) =>
                handleChange("packagingCategory", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select packaging category" />
              </SelectTrigger>
              <SelectContent className="bg-white z-100">
                {productCategories["packaging-only"].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.packagingCategory && (
              <p className="text-red-500 text-sm font-normal">
                {errors.packagingCategory}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="packagingDescription" className="text-sm font-normal">
            Describe the packaging types you're looking for?
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <Textarea
            id="packagingDescription"
            placeholder="e.g., glass jar, resealable pouch, folding carton"
            value={formData.packagingDescription || ""}
            onChange={(e) =>
              handleChange("packagingDescription", e.target.value)
            }
            className="min-h-[100px]"
          />
          {errors.packagingDescription && (
            <p className="text-red-500 text-sm font-normal">
              {errors.packagingDescription}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productForPackaging" className="text-sm font-normal">
            What product is this packaging for? (optional)
          </Label>
          <Textarea
            id="productForPackaging"
            placeholder="This helps the supplier recommend the most suitable packaging materials."
            value={formData.productForPackaging || ""}
            onChange={(e) =>
              handleChange("productForPackaging", e.target.value)
            }
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-normal">
            Do you need eco-friendly or sustainable packaging materials?
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <RadioGroup
            value={formData.ecoFriendly || ""}
            onValueChange={(value) => handleChange("ecoFriendly", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="eco-yes" />
              <Label htmlFor="eco-yes" className="text-sm font-normal ">
                Yes – Please use sustainable materials
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="eco-no" />
              <Label htmlFor="eco-no" className="text-sm font-normal">
                No – Standard materials are fine
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="open" id="eco-open" />
              <Label htmlFor="eco-open" className="text-sm font-normal ">
                Open to both options
              </Label>
            </div>
          </RadioGroup>
          {errors.ecoFriendly && (
            <p className="text-red-500 text-sm font-normal">
              {errors.ecoFriendly}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal">
            Upload any references for your packaging (Optional)
          </Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-normal text-gray-500">
                  {uploading
                    ? "Uploading..."
                    : "Upload images or examples of packaging"}
                </span>
              </div>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="border rounded-md overflow-hidden h-24 flex items-center justify-center">
                    {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt="Reference"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate max-w-full">
                          {file.url.split("/").pop()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFile(file.publicId)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="packagingDimensions" className="text-sm font-normal">
            Specific dimensions or functional requirements?
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <Textarea
            id="packagingDimensions"
            placeholder="For example: bottle size, box dimensions, resealable zipper, etc."
            value={formData.packagingDimensions || ""}
            onChange={(e) =>
              handleChange("packagingDimensions", e.target.value)
            }
            className="min-h-[100px]"
          />
          {errors.packagingDimensions && (
            <p className="text-red-500 text-sm font-normal">
              {errors.packagingDimensions}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do you need labeling or printing services? (optional)
            </Label>
            <RadioGroup
              value={formData.needsLabeling || ""}
              onValueChange={(value) => handleChange("needsLabeling", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="labeling-yes" />
                <Label htmlFor="labeling-yes" className="text-sm font-normal ">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="labeling-no" />
                <Label htmlFor="labeling-no" className="text-sm font-normal ">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-sm font-normal">
              Do you already have a packaging design ready? (optional)
            </Label>
            <RadioGroup
              value={formData.hasPackagingDesign || ""}
              onValueChange={(value) =>
                handleChange("hasPackagingDesign", value)
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="packaging-design-yes" />
                <Label
                  htmlFor="packaging-design-yes"
                  className="text-sm font-normal "
                >
                  Yes, I have a design ready.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="packaging-design-no" />
                <Label
                  htmlFor="packaging-design-no"
                  className="text-sm font-normal "
                >
                  No, I need design services.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="not-needed"
                  id="packaging-design-not-needed"
                />
                <Label
                  htmlFor="packaging-design-not-needed"
                  className="text-sm font-normal"
                >
                  I don't need packaging design at this point.
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Section 02. Product Requirements */}
      <div>
        <h2 className="text-lg font-medium mb-4">02. Product Requirements</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-normal">
                What certifications should the supplier have? (optional)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-normal font-futura"
                onClick={() => setShowCertificateSearch(!showCertificateSearch)}
              >
                {showCertificateSearch
                  ? "Hide Search"
                  : "Search Certifications"}
              </Button>
            </div>

            {showCertificateSearch && (
              <div className="space-y-4 border rounded-md p-4">
                <Input
                  placeholder="Search for certifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />

                {filteredCertifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredCertifications.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cert-${cert}`}
                          checked={(formData.certifications || []).includes(
                            cert
                          )}
                          onChange={() => toggleCertification(cert)}
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor={`cert-${cert}`}
                          className="text-sm font-normal"
                        >
                          {cert}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <p className="text-sm font-normal text-gray-500">
                    No certifications found matching your search.
                  </p>
                ) : (
                  <p className="text-sm font-normal text-gray-500">
                    Type to search for certifications.
                  </p>
                )}
              </div>
            )}

            {(formData.certifications || []).length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-normal mb-2">
                  Selected Certifications:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(formData.certifications || []).map((cert) => (
                    <div
                      key={cert}
                      className="bg-gray-100 rounded-full px-3 py-1 text-sm font-normal flex items-center"
                    >
                      {cert}
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => toggleCertification(cert)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do You Need a Custom Sample Before Production?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <RadioGroup
              value={formData.needsSample || ""}
              onValueChange={(value) => handleChange("needsSample", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sample-yes" />
                <Label htmlFor="sample-yes" className="text-sm font-normal ">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sample-no" />
                <Label htmlFor="sample-no" className="text-sm font-normal ">
                  No
                </Label>
              </div>
            </RadioGroup>
            {errors.needsSample && (
              <p className="text-red-500 text-sm font-normal">
                {errors.needsSample}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderServicesBrandSupportForm = () => (
    <div className="space-y-8 font-futura font-normal">
      {/* Section 01. Project Information */}
      <div>
        <h2 className="text-lg font-medium mb-4">01. Project Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="text-sm font-normal">
              Project Title<span className="text-[#EA3D4F]">*</span>
            </Label>
            <Input
              id="projectTitle"
              placeholder="What should we call this project?"
              value={formData.projectTitle || ""}
              onChange={(e) => handleChange("projectTitle", e.target.value)}
              className="w-full"
            />
            {errors.projectTitle && (
              <p className="text-red-500 text-sm font-normal">
                {errors.projectTitle}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Do you have an existing brand, or is this a new launch?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <RadioGroup
              value={formData.brandStatus || ""}
              onValueChange={(value) => handleChange("brandStatus", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="brand-existing" />
                <Label
                  htmlFor="brand-existing"
                  className="text-sm font-normal "
                >
                  Existing brand
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="brand-new" />
                <Label htmlFor="brand-new" className="text-sm font-normal ">
                  Starting from scratch
                </Label>
              </div>
            </RadioGroup>
            {errors.brandStatus && (
              <p className="text-red-500 text-sm font-normal">
                {errors.brandStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-normal">
            Please upload any reference materials (Optional)
          </Label>
          <div className="border-2 border-dashed rounded-md p-7 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-normal text-gray-500">
                  {uploading
                    ? "Uploading..."
                    : "Include logos, moodboards, inspiration images, etc."}
                </span>
              </div>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="border rounded-md overflow-hidden h-32 flex items-center justify-center">
                    {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt="Reference"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate max-w-full">
                          {file.url.split("/").pop()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFile(file.publicId)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandVision" className="text-sm font-normal">
            Tell us about your brand or vision
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <Textarea
            id="brandVision"
            placeholder="Provide a brief description to help the supplier understand your brand's aesthetic, mission, and goals"
            value={formData.brandVision || ""}
            onChange={(e) => handleChange("brandVision", e.target.value)}
            className="min-h-[120px]"
          />
          {errors.brandVision && (
            <p className="text-red-500 text-sm font-normal">
              {errors.brandVision}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectDescription" className="text-sm font-normal">
          Project Description<span className="text-[#EA3D4F]">*</span>
        </Label>
        <Textarea
          id="projectDescription"
          placeholder="Briefly describe the services or brand support you require."
          value={formData.projectDescription || ""}
          onChange={(e) => handleChange("projectDescription", e.target.value)}
          className="min-h-[120px]"
        />
        {errors.projectDescription && (
          <p className="text-red-500 text-sm font-normal">
            {errors.projectDescription}
          </p>
        )}
      </div>

      {/* Section 02. Service Requirements */}
      <div>
        <h2 className="text-lg font-medium mb-4">02. Service Requirements</h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-normal">
              What type of services are you looking for?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
              {productCategories["services-brand-support"].map((service) => (
                <div
                  key={service}
                  className="flex items-center space-x-2 font-normal"
                >
                  <input
                    type="checkbox"
                    id={`service-${service}`}
                    checked={(formData.selectedServices || []).includes(
                      service
                    )}
                    onChange={() => {
                      const currentServices = formData.selectedServices || [];
                      if (currentServices.includes(service)) {
                        updateFormData(
                          "selectedServices",
                          currentServices.filter((s) => s !== service)
                        );
                      } else {
                        updateFormData("selectedServices", [
                          ...currentServices,
                          service,
                        ]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`service-${service}`}
                    className="text-sm font-normal"
                  >
                    {service}
                  </Label>
                </div>
              ))}
            </div>
            {errors.selectedServices && (
              <p className="text-red-500 text-sm font-normal">
                {errors.selectedServices}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 font-futura font-normal">
      <h1 className="text-2xl font-medium mb-2">Project Details</h1>
      <p className="text-[#78787A] text-sm font-normal mb-6">
        Define the details of your project to ensure accurate supplier matching.
      </p>

      {/* Render different forms based on project type */}
      {formData.selectedServices.includes("custom-manufacturing") &&
        renderCustomManufacturingForm()}
      {formData.selectedServices.includes("packaging-only") &&
        renderPackagingOnlyForm()}
      {formData.selectedServices.includes("services-brand-support") &&
        renderServicesBrandSupportForm()}

      <div className="flex justify-end mt-8">
        <Button
          variant="ghost"
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1;
