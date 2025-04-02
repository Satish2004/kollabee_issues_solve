"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, X, Loader2, Plus, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import { categoryApi } from "@/lib/api/category";
import type { Category } from "@/types/api";
import type { ProductFormData } from "./types";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: any;
  mode: "create" | "edit" | "view";
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

// Default industry-specific attributes
const INDUSTRY_SPECIFIC_ATTRIBUTES = [
  { key: "Material", value: "" },
  { key: "Fabric Weight", value: "" },
  { key: "Technics", value: "" },
];

// Default other attributes
const OTHER_ATTRIBUTES = [
  { key: "Collar", value: "" },
  { key: "Fabric Type", value: "" },
  { key: "Fit Type", value: "" },
];

// Debounce function to limit API calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  mode = "create",
  onSubmit,
  onCancel,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      wholesalePrice: 0,
      minOrderQuantity: 1,
      availableQuantity: 0,
      categoryId: "",
      attributes: {},
      images: [],
      isDraft: true,
      thumbnail: [], // Changed from null to empty array
    }
  );
  const [imageLoading, setImageLoading] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImage, setCoverImage] = useState<any>(null);

  // Separate state for different attribute categories
  const [industryAttributes, setIndustryAttributes] = useState<
    Array<{ key: string; value: string }>
  >(INDUSTRY_SPECIFIC_ATTRIBUTES);
  const [otherAttributes, setOtherAttributes] =
    useState<Array<{ key: string; value: string }>>(OTHER_ATTRIBUTES);
  const [customAttributes, setCustomAttributes] = useState<
    Array<{ key: string; value: string }>
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("upload");
  const [activeNumber, setActiveNumber] = useState<number>(1);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [thumbnail, setThumbnail] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for adding new attributes
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [newAttributeKey, setNewAttributeKey] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");
  const [newAttributeCategory, setNewAttributeCategory] = useState<
    "industry" | "other" | "custom"
  >("other");

  // Refs for each section
  const uploadRef = useRef<HTMLDivElement>(null);
  const generalInfoRef = useRef<HTMLDivElement>(null);
  const productDetailsRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);

  // State for editing attributes
  const [editingIndustryIndex, setEditingIndustryIndex] = useState<
    number | null
  >(null);
  const [editingOtherIndex, setEditingOtherIndex] = useState<number | null>(
    null
  );
  const [editingCustomIndex, setEditingCustomIndex] = useState<number | null>(
    null
  );

  // State for save status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Add a new state for form errors at the top of the component, after other state declarations
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    discount?: string;
    deliveryCost?: string;
    minOrderQuantity?: string;
    availableQuantity?: string;
  }>({});

  // Add a new state to track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Use refs to avoid dependency issues in useEffect
  const formDataRef = useRef(formData);
  const industryAttributesRef = useRef(industryAttributes);
  const otherAttributesRef = useRef(otherAttributes);
  const customAttributesRef = useRef(customAttributes);
  const thumbnailRef2 = useRef<any[]>([]);
  const documentsRef2 = useRef(documents);
  const coverImageRef = useRef(coverImage);
  const modeRef = useRef(mode);
  const initialDataRef = useRef(initialData);

  // Update refs when state changes
  useEffect(() => {
    formDataRef.current = formData;
    industryAttributesRef.current = industryAttributes;
    otherAttributesRef.current = otherAttributes;
    customAttributesRef.current = customAttributes;
    thumbnailRef2.current = thumbnail;
    documentsRef2.current = documents;
    coverImageRef.current = coverImage;
    modeRef.current = mode;
    initialDataRef.current = initialData;
  }, [
    formData,
    industryAttributes,
    otherAttributes,
    customAttributes,
    thumbnail,
    documents,
    coverImage,
    mode,
    initialData,
  ]);

  // Load saved draft from localStorage on mount - only run once
  useEffect(() => {
    const loadDraft = () => {
      const savedDraft = localStorage.getItem("productDraft");
      if (!savedDraft) return;

      try {
        const parsedDraft = JSON.parse(savedDraft);

        // For edit mode, only load if the IDs match
        if (mode === "edit") {
          if (initialData?.id && parsedDraft.productId === initialData.id) {
            setFormData(parsedDraft.formData || formData);
            setCoverImage(parsedDraft.coverImage || null);
            setThumbnail(parsedDraft.thumbnail || null);
            setDocuments(parsedDraft.documents || []);
            setIndustryAttributes(
              parsedDraft.industryAttributes || INDUSTRY_SPECIFIC_ATTRIBUTES
            );
            setOtherAttributes(parsedDraft.otherAttributes || OTHER_ATTRIBUTES);
            setCustomAttributes(parsedDraft.customAttributes || []);
            if (parsedDraft.lastSaved) {
              setLastSaved(new Date(parsedDraft.lastSaved));
            }
            toast.info("Draft loaded successfully");
          }
        }
        // For create mode, load the draft
        else if (mode === "create") {
          setFormData(parsedDraft.formData || formData);
          setCoverImage(parsedDraft.coverImage || null);
          setThumbnail(parsedDraft.thumbnail || null);
          setDocuments(parsedDraft.documents || []);
          setIndustryAttributes(
            parsedDraft.industryAttributes || INDUSTRY_SPECIFIC_ATTRIBUTES
          );
          setOtherAttributes(parsedDraft.otherAttributes || OTHER_ATTRIBUTES);
          setCustomAttributes(parsedDraft.customAttributes || []);
          if (parsedDraft.lastSaved) {
            setLastSaved(new Date(parsedDraft.lastSaved));
          }
          toast.info("Draft loaded successfully");
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    loadDraft();
    // Only run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage or API - using refs to avoid dependency issues
  const saveChanges = useCallback(
    debounce(() => {
      setSaveStatus("saving");

      // Combine all attributes into a single object
      const allAttributes = [
        ...industryAttributesRef.current,
        ...otherAttributesRef.current,
        ...customAttributesRef.current,
      ];

      const attributesObject = allAttributes.reduce((acc, { key, value }) => {
        if (key.trim()) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        ...formDataRef.current,
        attributes: attributesObject,
      };

      if (modeRef.current === "edit" && initialDataRef.current?.id) {
        // Save to API if in edit mode
        productsApi
          .updateProduct(initialDataRef.current.id, productData)
          .then(() => {
            setSaveStatus("saved");
            const now = new Date();
            setLastSaved(now);

            // Also save to localStorage with the product ID
            const draftData = {
              productId: initialDataRef.current.id,
              formData: formDataRef.current,
              coverImage: coverImageRef.current,
              thumbnail: thumbnailRef2.current,
              documents: documentsRef2.current,
              industryAttributes: industryAttributesRef.current,
              otherAttributes: otherAttributesRef.current,
              customAttributes: customAttributesRef.current,
              lastSaved: now.toISOString(),
            };
            localStorage.removeItem("productDraft");
          })
          .catch((error) => {
            console.error("Error auto-saving product:", error);
            setSaveStatus("unsaved");
          });
      } else {
        // Save to localStorage if in create mode
        const draftData = {
          productId: formDataRef.current.id || null, // Store ID if available
          formData: formDataRef.current,
          coverImage: coverImageRef.current,
          thumbnail: thumbnailRef2.current,
          documents: documentsRef2.current,
          industryAttributes: industryAttributesRef.current,
          otherAttributes: otherAttributesRef.current,
          customAttributes: customAttributesRef.current,
          lastSaved: new Date().toISOString(),
        };

        localStorage.setItem("productDraft", JSON.stringify(draftData));
        setSaveStatus("saved");
        setLastSaved(new Date());
      }
    }, 1000),
    // No dependencies to avoid re-creating this function
    []
  );

  // Trigger save when form data changes - using a separate effect with a flag to avoid infinite loops
  const [shouldSave, setShouldSave] = useState(false);

  useEffect(() => {
    // Skip the first render
    if (!shouldSave) {
      setShouldSave(true);
      return;
    }

    setSaveStatus("unsaved");
    saveChanges();
  }, [
    formData,
    industryAttributes,
    otherAttributes,
    customAttributes,
    thumbnail,
    documents,
    saveChanges,
    shouldSave,
  ]);

  // Load categories once on mount
  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load initial data for edit/view mode
  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      if (!initialData) return;

      setFormData((prevData) => ({ ...initialData, ...prevData }));

      if (initialData.images && initialData.images.length > 0) {
        setCoverImage(initialData.images[0]);
      }
      if (initialData.thumbnail) {
        // Handle both array and string cases for backward compatibility
        const thumbnailArray = Array.isArray(initialData.thumbnail)
          ? initialData.thumbnail
          : initialData.thumbnail
          ? [initialData.thumbnail]
          : [];
        setThumbnail(thumbnailArray);
      }
      if (initialData.documents) {
        setDocuments(initialData.documents);
      }

      // Convert attributes object to array and categorize them
      if (initialData.attributes) {
        const attributesObj = initialData.attributes || {};
        const allAttributes = Object.entries(attributesObj).map(
          ([key, value]) => ({
            key,
            value: value as string,
          })
        );

        // Categorize existing attributes
        const industryKeys = INDUSTRY_SPECIFIC_ATTRIBUTES.map(
          (attr) => attr.key
        );
        const otherKeys = OTHER_ATTRIBUTES.map((attr) => attr.key);

        const existingIndustryAttrs = allAttributes.filter((attr) =>
          industryKeys.includes(attr.key)
        );
        const existingOtherAttrs = allAttributes.filter((attr) =>
          otherKeys.includes(attr.key)
        );
        const existingCustomAttrs = allAttributes.filter(
          (attr) =>
            !industryKeys.includes(attr.key) && !otherKeys.includes(attr.key)
        );

        // Add any missing default attributes
        const existingIndustryKeys = existingIndustryAttrs.map(
          (attr) => attr.key
        );
        const missingIndustryAttrs = INDUSTRY_SPECIFIC_ATTRIBUTES.filter(
          (attr) => !existingIndustryKeys.includes(attr.key)
        );

        const existingOtherKeys = existingOtherAttrs.map((attr) => attr.key);
        const missingOtherAttrs = OTHER_ATTRIBUTES.filter(
          (attr) => !existingOtherKeys.includes(attr.key)
        );

        setIndustryAttributes([
          ...existingIndustryAttrs,
          ...missingIndustryAttrs,
        ]);
        setOtherAttributes([...existingOtherAttrs, ...missingOtherAttrs]);
        setCustomAttributes(existingCustomAttrs);
      }
    }
    // Only run when initialData or mode changes
  }, [initialData, mode]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageLoading(true);
        const response: any = await productsApi.uploadImage(file);
        setFormData((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), response?.url],
        }));
        setCoverImage(response?.url);
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload image");
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setThumbnailLoading(true);

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response: any = await productsApi.uploadImage(file);

        // Add the new thumbnail URL to the existing array
        setThumbnail((prev) => [...prev, response?.url]);
        setFormData((prev: any) => ({
          ...prev,
          thumbnail: [...(prev.thumbnail || []), response?.url],
        }));
      }

      toast.success("Thumbnails uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload thumbnails");
    } finally {
      setThumbnailLoading(false);
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setDocumentLoading(true);
        const response: any = await productsApi.uploadImage(file); // Assuming the same API works for documents
        const newDocuments = [...documents, response?.url];
        setFormData((prev: any) => ({
          ...prev,
          documents: newDocuments,
        }));
        setDocuments(newDocuments);
        toast.success("Document uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload document");
      } finally {
        setDocumentLoading(false);
      }
    }
  };

  // Add a validation function before the handleSubmit function
  const validateForm = () => {
    const newErrors: any = {};

    // Validate required fields
    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    }

    if (
      formData.discount &&
      (isNaN(Number(formData.discount)) ||
        Number(formData.discount) < 0 ||
        Number(formData.discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (!formData.deliveryCost) {
      newErrors.deliveryCost = "Delivery cost is required";
    }

    if (!formData.minOrderQuantity) {
      newErrors.minOrderQuantity = "Minimum order quantity is required";
    }

    if (!formData.availableQuantity) {
      newErrors.availableQuantity = "Available quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modify the handleSubmit function to include validation
  const handleSubmit = async (e: React.FormEvent, isDraft = true) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Validate form before submission
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fill the required fields before saving");
      return;
    }

    setIsSubmitting(true);

    try {
      // Rest of the existing handleSubmit code...
      // Combine all attributes into a single object
      const allAttributes = [
        ...industryAttributes,
        ...otherAttributes,
        ...customAttributes,
      ];
      const attributesObject = allAttributes.reduce((acc, { key, value }) => {
        if (key.trim()) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        ...formData,
        attributes: attributesObject,
        thumbnail: thumbnail,
        documents: documents,
      };

      let response: any;
      if (mode === "edit") {
        response = await productsApi.updateProduct(initialData.id, productData);
        localStorage.removeItem("productDraft");
      } else {
        response = await productsApi.create(productData);
        localStorage.removeItem("productDraft");
        console.log("Draft Removed");
        setFormData({
          name: "",
          description: "",
          price: 0,
          wholesalePrice: 0,
          minOrderQuantity: 1,
          availableQuantity: 0,
          categoryId: "",
          attributes: {},
          images: [],
          isDraft: true,
          thumbnail: [],
        });
        setCoverImage(null);
      }
      toast.success(
        mode === "create"
          ? "Product created successfully"
          : "Product updated successfully"
      );
      onSubmit(response.data);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to handle real-time validation as user types
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Only validate in real-time if the form has been submitted once
    if (formSubmitted) {
      // Clear the specific error if the field is now valid
      if (field === "name" && value.trim()) {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }

      if (field === "price" && value) {
        setErrors((prev) => ({ ...prev, price: undefined }));
      }

      if (field === "discount") {
        if (!value || (Number(value) >= 0 && Number(value) <= 100)) {
          setErrors((prev) => ({ ...prev, discount: undefined }));
        } else {
          setErrors((prev) => ({
            ...prev,
            discount: "Discount must be between 0 and 100",
          }));
        }
      }

      if (field === "deliveryCost" && value) {
        setErrors((prev) => ({ ...prev, deliveryCost: undefined }));
      }

      if (field === "minOrderQuantity" && value) {
        setErrors((prev) => ({ ...prev, minOrderQuantity: undefined }));
      }

      if (field === "availableQuantity" && value) {
        setErrors((prev) => ({ ...prev, availableQuantity: undefined }));
      }
    }
  };

  // Handle scroll to section
  const scrollToSection = (sectionId: string) => {
    const refs: any = {
      upload: uploadRef,
      "general-info": generalInfoRef,
      "product-details": productDetailsRef,
      documents: documentsRef,
    };

    refs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveSection(sectionId);
    setActiveNumber(
      sectionId === "upload"
        ? 1
        : sectionId === "general-info"
        ? 2
        : sectionId === "product-details"
        ? 3
        : 4
    );
  };

  const handleScroll = () => {
    const sections = [
      { id: "upload", ref: uploadRef },
      { id: "general-info", ref: generalInfoRef },
      { id: "product-details", ref: productDetailsRef },
      { id: "documents", ref: documentsRef },
    ];

    for (const section of sections) {
      const element = section.ref.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= 100 && rect.bottom >= 100;

        if (isVisible) {
          setActiveSection(section.id);
          break;
        }
      }
    }

    // Special handling for the documents section at the end of the page
    const documentsElement = documentsRef.current;
    if (documentsElement) {
      const rect = documentsElement.getBoundingClientRect();
      const isAtEndOfPage = rect.bottom <= window.innerHeight + 100;

      if (isAtEndOfPage) {
        setActiveSection("documents");
      }
    }

    setActiveNumber(
      activeSection === "upload"
        ? 1
        : activeSection === "general-info"
        ? 2
        : activeSection === "product-details"
        ? 3
        : 4
    );
  };

  // Functions to handle attribute updates
  const updateIndustryAttribute = (
    index: number,
    key?: string,
    value?: string
  ) => {
    const updated = [...industryAttributes];
    if (key !== undefined) updated[index].key = key;
    if (value !== undefined) updated[index].value = value;
    setIndustryAttributes(updated);
  };

  const updateOtherAttribute = (
    index: number,
    key?: string,
    value?: string
  ) => {
    const updated = [...otherAttributes];
    if (key !== undefined) updated[index].key = key;
    if (value !== undefined) updated[index].value = value;
    setOtherAttributes(updated);
  };

  const updateCustomAttribute = (
    index: number,
    key?: string,
    value?: string
  ) => {
    const updated = [...customAttributes];
    if (key !== undefined) updated[index].key = key;
    if (value !== undefined) updated[index].value = value;
    setCustomAttributes(updated);
  };

  const removeCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const addNewAttribute = () => {
    if (newAttributeKey.trim()) {
      const newAttr = { key: newAttributeKey, value: newAttributeValue };

      switch (newAttributeCategory) {
        case "industry":
          setIndustryAttributes([...industryAttributes, newAttr]);
          break;
        case "other":
          setOtherAttributes([...otherAttributes, newAttr]);
          break;
        case "custom":
          setCustomAttributes([...customAttributes, newAttr]);
          break;
      }

      setNewAttributeKey("");
      setNewAttributeValue("");
      setIsAddingAttribute(false);
    }
  };

  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "";

    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const hours = lastSaved.getHours();
    const minutes = lastSaved.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `Today at ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Remove a document from the list
  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
    setFormData((prev: any) => ({
      ...prev,
      documents: newDocuments,
    }));
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
          <p className="text-red-500">Back</p>
        </div>

        {/* Save status indicator */}
        <div className="flex items-center text-sm">
          {saveStatus === "saving" && (
            <div className="flex items-center text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center text-green-600">
              <Check className="w-4 h-4 mr-2" />
              {mode === "create" ? "Saved in draft" : "Saved"}{" "}
              {lastSaved && `• ${formatLastSaved()}`}
            </div>
          )}
          {saveStatus === "unsaved" && (
            <div className="text-amber-500">Unsaved changes</div>
          )}
        </div>
      </header>

      <div className="p-6 grid grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4">
          {mode !== "create" && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500 mb-2">Last update</div>
              <div>{lastSaved ? formatLastSaved() : "Not saved yet"}</div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">Status</div>
            <div>{formData.isDraft ? "Draft" : "Active"}</div>
          </div>

          {/* Navigation Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection("upload")}
                className="flex items-center space-x-1 w-full"
              >
                <div
                  className={`w-10 aspect-square ${
                    activeNumber >= 1 ? "bg-green-500" : "bg-neutral-200"
                  } rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      activeNumber >= 1 ? "text-white" : ""
                    }`}
                  >
                    01
                  </span>
                </div>
                <div
                  className={`w-full text-left p-2 rounded ${
                    activeSection === "upload"
                      ? "bg-green-50 text-green-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Upload Art Cover
                </div>
              </button>
              <div
                className={`h-8 w-0.5 rounded-full ml-4 ${
                  activeNumber > 1 ? "bg-green-500" : " bg-neutral-200 "
                }`}
              ></div>

              <button
                onClick={() => scrollToSection("general-info")}
                className="flex items-center space-x-1 w-full"
              >
                <div
                  className={`w-10 aspect-square ${
                    activeNumber >= 2 ? "bg-green-500" : "bg-neutral-200"
                  } rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      activeNumber >= 2 ? "text-white" : ""
                    }`}
                  >
                    02
                  </span>
                </div>
                <div
                  className={`w-full text-left p-2 rounded ${
                    activeSection === "general-info"
                      ? "bg-green-50 text-green-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  General Information
                </div>
              </button>
              <div
                className={`h-8 w-0.5 rounded-full ml-4 ${
                  activeNumber > 2 ? "bg-green-500" : " bg-neutral-200 "
                }`}
              ></div>

              <button
                onClick={() => scrollToSection("product-details")}
                className="flex items-center space-x-1 w-full"
              >
                <div
                  className={`w-10 aspect-square ${
                    activeNumber >= 3 ? "bg-green-500" : "bg-neutral-200"
                  } rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      activeNumber >= 3 ? "text-white" : ""
                    }`}
                  >
                    03
                  </span>
                </div>
                <div
                  className={`w-full text-left p-2 rounded ${
                    activeSection === "product-details"
                      ? "bg-green-50 text-green-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Product Details
                </div>
              </button>
              <div
                className={`h-8 w-0.5 rounded-full ml-4 ${
                  activeNumber > 3 ? "bg-green-500" : " bg-neutral-200 "
                }`}
              ></div>

              <button
                onClick={() => scrollToSection("documents")}
                className="flex items-center space-x-1 w-full"
              >
                <div
                  className={`w-10 aspect-square ${
                    activeNumber >= 4 ? "bg-green-500" : "bg-neutral-200"
                  } rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      activeNumber >= 4 ? "text-white" : ""
                    }`}
                  >
                    04
                  </span>
                </div>
                <div
                  className={`w-full text-left p-2 rounded ${
                    activeSection === "documents"
                      ? "bg-green-50 text-green-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Documents
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
            onClick={(e) => handleSubmit(e, true)}
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>

        {/* Main Content */}
        <div
          className="col-span-3 bg-white rounded-lg shadow p-6 overflow-auto max-h-[calc(100vh-120px)]"
          onScroll={handleScroll}
        >
          <form>
            {/* Upload Cover Section */}
            <section id="upload" ref={uploadRef} className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Upload cover</h2>
              <p className="text-gray-600 mb-4">
                Upload the art cover to capture your audience's attention
              </p>
              <div className="border-2 border-dashed rounded-lg p-8 text-center h-full">
                {coverImage ? (
                  <div className="relative">
                    <img
                      src={coverImage || "/placeholder.svg"}
                      alt="Cover preview"
                      className="max-h-64 mx-auto"
                    />
                  </div>
                ) : (
                  <div>
                    {imageLoading ? (
                      <div className="w-8 h-8 text-gray-400 mx-auto mb-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    )}
                    <p className="text-gray-600 mb-2 text-sm">
                      Drag and drop your image here
                    </p>
                    <p className="text-gray-600 mb-2 text-sm">
                      Recommended image size: 400 x 300 px for optimal display
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="text-[#898989] text-sm px-6 py-2 rounded-[6px] font-semibold"
                  onClick={() => {
                    setCoverImage(null);
                    setFormData((prev: any) => ({
                      ...prev,
                      images: [],
                    }));
                  }}
                >
                  Remove
                </button>
                <label
                  htmlFor="cover-upload"
                  className="text-[#898989] border border-[#898989] text-sm px-4 py-1 rounded-[14px] font-semibold cursor-pointer"
                >
                  Change
                </label>
              </div>
            </section>

            {/* Product Details Section */}
            <section id="general-info" ref={generalInfoRef} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-4">Thumbnail</h3>
                <div className="border-2 border-dashed rounded-lg p-8 text-center h-full">
                  {thumbnailLoading ? (
                    <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                      <Loader2 className="w-12 h-12 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload thumbnails for your product
                      </p>
                      <p className="text-gray-600 mb-2">
                        Recommended image size: 400 x 300 px for optimal display
                      </p>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        ref={thumbnailRef}
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="text-[#898989] border border-[#898989] text-sm px-4 py-1 rounded-[14px] font-semibold cursor-pointer"
                      >
                        Browse Files
                      </label>
                    </>
                  )}

                  {thumbnail.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {thumbnail.map((doc: string, index: number) => (
                        <div
                          key={index}
                          className="relative border rounded-md p-2"
                        >
                          <img
                            src={doc || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-32 h-32 object-cover mx-auto"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              const newThumbnails = [...thumbnail];
                              newThumbnails.splice(index, 1);
                              setThumbnail(newThumbnails);
                              setFormData((prev: any) => ({
                                ...prev,
                                thumbnail: newThumbnails,
                              }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-md font-medium mb-4">Price Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600 w-[50%]">
                    Name <span className="text-red-500">*</span>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      value={formData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1/3 text-sm text-gray-600">
                    Add product price <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      placeholder="122.00"
                      className={`w-full p-2 pl-8 border rounded-md bg-[#fcfcfc] ${
                        errors.price ? "border-red-500" : ""
                      }`}
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-1/3 text-sm text-gray-600">
                    Discount <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter discount"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${
                        errors.discount ? "border-red-500" : ""
                      }`}
                      value={formData.discount || ""}
                      onChange={(e) =>
                        handleInputChange("discount", e.target.value)
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                    {errors.discount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.discount}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-1/3 text-sm text-gray-600">
                    Delivery cost <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      placeholder="Enter delivery cost"
                      className={`w-full p-2 pl-8 border rounded-md bg-[#fcfcfc] ${
                        errors.deliveryCost ? "border-red-500" : ""
                      }`}
                      value={formData.deliveryCost || ""}
                      onChange={(e) =>
                        handleInputChange("deliveryCost", e.target.value)
                      }
                    />
                    {errors.deliveryCost && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.deliveryCost}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-1/3 text-sm text-gray-600">
                    Minimum order <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter minimum order quantity"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${
                        errors.minOrderQuantity ? "border-red-500" : ""
                      }`}
                      value={formData.minOrderQuantity || ""}
                      onChange={(e) =>
                        handleInputChange("minOrderQuantity", e.target.value)
                      }
                    />
                    {errors.minOrderQuantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.minOrderQuantity}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1/3 text-sm text-gray-600">
                    Available quantity <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter available quantity"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${
                        errors.availableQuantity ? "border-red-500" : ""
                      }`}
                      value={formData.availableQuantity || ""}
                      onChange={(e) =>
                        handleInputChange("availableQuantity", e.target.value)
                      }
                    />
                    {errors.availableQuantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.availableQuantity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Product Attributes Section */}
            <section
              id="product-details"
              ref={productDetailsRef}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold mb-4">Key attributes</h2>

              {/* Industry-specific attributes */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">
                  Industry-specific attributes
                </h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {industryAttributes.map((attr, index) => (
                        <tr key={index}>
                          <td className="p-3 border-b border-r w-1/3 relative bg-gray-50">
                            {editingIndustryIndex === index ? (
                              <input
                                type="text"
                                className="w-full bg-transparent focus:outline-none"
                                value={attr.key}
                                onChange={(e) =>
                                  updateIndustryAttribute(index, e.target.value)
                                }
                                onBlur={() => setEditingIndustryIndex(null)}
                                autoFocus
                              />
                            ) : (
                              <div
                                className="w-full cursor-pointer"
                                onDoubleClick={() =>
                                  setEditingIndustryIndex(index)
                                }
                                title="Double-click to edit"
                              >
                                {attr.key}
                              </div>
                            )}
                          </td>
                          <td className="p-3 border-b bg-white">
                            <input
                              type="text"
                              placeholder="Add your answer"
                              className="w-full p-2 bg-transparent focus:outline-none"
                              value={attr.value}
                              onChange={(e) =>
                                updateIndustryAttribute(
                                  index,
                                  undefined,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Other attributes */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Other attributes</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {otherAttributes.map((attr, index) => (
                        <tr key={index}>
                          <td className="p-3 border-b border-r w-1/3 relative bg-gray-50">
                            {editingOtherIndex === index ? (
                              <input
                                type="text"
                                className="w-full bg-transparent focus:outline-none"
                                value={attr.key}
                                onChange={(e) =>
                                  updateOtherAttribute(index, e.target.value)
                                }
                                onBlur={() => setEditingOtherIndex(null)}
                                autoFocus
                              />
                            ) : (
                              <div
                                className="w-full cursor-pointer "
                                onDoubleClick={() =>
                                  setEditingOtherIndex(index)
                                }
                                title="Double-click to edit"
                              >
                                {attr.key}
                              </div>
                            )}
                          </td>
                          <td className="p-3 border-b bg-white">
                            <input
                              type="text"
                              placeholder="Add your answer"
                              className="w-full p-2 bg-transparent focus:outline-none"
                              value={attr.value}
                              onChange={(e) =>
                                updateOtherAttribute(
                                  index,
                                  undefined,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom attributes */}
              {customAttributes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Other attributes</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {customAttributes.map((attr, index) => (
                          <tr key={index}>
                            <td className="p-3 border-b border-r w-1/3 relative bg-gray-50">
                              {editingCustomIndex === index ? (
                                <input
                                  type="text"
                                  className="w-full bg-transparent focus:outline-none"
                                  value={attr.key}
                                  onChange={(e) =>
                                    updateCustomAttribute(index, e.target.value)
                                  }
                                  onBlur={() => setEditingCustomIndex(null)}
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="w-full cursor-pointer"
                                  onDoubleClick={() =>
                                    setEditingCustomIndex(index)
                                  }
                                  title="Double-click to edit"
                                >
                                  {attr.key}
                                  <button
                                    type="button"
                                    className="absolute right-2 text-gray-500 hover:text-red-500"
                                    onClick={() => removeCustomAttribute(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="p-3 border-b bg-white">
                              <input
                                type="text"
                                placeholder="Add your answer"
                                className="w-full p-2 bg-transparent focus:outline-none"
                                value={attr.value}
                                onChange={(e) =>
                                  updateCustomAttribute(
                                    index,
                                    undefined,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add new attribute */}
              {isAddingAttribute ? (
                <div className="mt-4 p-4 border rounded-md">
                  <div className="flex items-center mb-3">
                    <h3 className="text-md font-medium">Add new attribute</h3>
                    <button
                      type="button"
                      className="ml-auto text-gray-500 hover:text-red-500"
                      onClick={() => setIsAddingAttribute(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Attribute Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter attribute name"
                        value={newAttributeKey}
                        onChange={(e) => setNewAttributeKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Attribute Value
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter attribute value"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">
                      Attribute Category
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newAttributeCategory}
                      onChange={(e) =>
                        setNewAttributeCategory(e.target.value as any)
                      }
                    >
                      <option value="industry">
                        Industry-specific attributes
                      </option>
                      <option value="other">Other attributes</option>
                      <option value="custom">Custom attributes</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addNewAttribute}
                    className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
                  >
                    Add Attribute
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingAttribute(true)}
                  className="mt-4 text-[#898989] hover:text-[#666] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add other options
                </button>
              )}
            </section>

            {/* Documents Section */}
            <section id="documents" ref={documentsRef}>
              <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {documentLoading ? (
                  <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                    <Loader2 className="w-12 h-12 animate-spin" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your documents here
                    </p>
                    <p className="text-gray-600 mb-2">
                      Recommended image size: 400 x 300 px for optimal display
                    </p>
                    <input
                      id="documents-upload"
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                    <label
                      htmlFor="documents-upload"
                      className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
                    >
                      Browse Files
                    </label>
                  </>
                )}
              </div>

              {/* Display uploaded documents */}
              {documents.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {documents.map((doc: string, index: number) => (
                    <div key={index} className="relative border rounded-md p-2">
                      <img
                        src={doc || "/placeholder.svg"}
                        alt={`Document ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
