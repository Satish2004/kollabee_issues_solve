import { Certification } from "@/types/api";
import { Trash2, Upload } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type CertificateUploadType = {
  certificates: Certification[] | undefined;
  setCertificates: Dispatch<SetStateAction<Certification[] | undefined>>;
};

export default function CertificationsUpload({
  certificates = [],
  setCertificates,
}: CertificateUploadType) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newCert:  any = {
        id: crypto.randomUUID(), // Generate a unique ID for each certificate
        name: "",
        issueDate: new Date().toISOString(),
        productId: "",
        product: {
          id: "",
          name: "",
          description: "",
          price: 0,
          images: [],
          categoryId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          seller: {
            id: "",
            // name: "",
            email: "",
            image: "",
          },
        },
        // image: e.target.files[0],
      };

      setCertificates([...certificates, newCert]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newCert: any = {
        id: crypto.randomUUID(),
        name: "",
        issueDate: "",
        image: e.dataTransfer.files[0],
      };

      setCertificates((prev) => [...(prev || []), newCert]);
    }
  };

  const handleChange = (
    id: string,
    field: keyof any,
    value: string | File
  ) => {
    setCertificates((prev) =>
      prev?.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  const handleDelete = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };


  // Function to get image preview URL
  const getImageSrc = (image: string | File) => {
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex flex-col items-center justify-center w-[500px] h-64 border-2 ${
          isDragging ? "border-black" : "border-dashed border-gray-300"
        } rounded-lg bg-gray-50 hover:bg-gray-100 transition-all text-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          name="certificates"
          id="certificates"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <Upload size={30} />
          <p className="mt-2 text-sm text-gray-600">Drop files here</p>
          <p className="text-xs text-gray-400">Supported format: PNG, JPG</p>
        </div>
        <span className="text-sm mt-2">Or</span>
        <label
          htmlFor="certificates"
          className="mt-4 rounded-lg text-sm font-semibold border text-[#DDDDDD] border-[#DDDDDD] p-2 cursor-pointer"
        >
          Browse files
        </label>
      </div>

      {/* List of Uploaded Certificates */}
      {certificates?.map((cert) => (
        <div key={cert.id} className="flex items-end gap-6 mt-4">
          {/* Certificate Image Preview */}
          <div className="w-20 h-20 relative">
            {/* <Image
              src={getImageSrc(cert.image)}
              alt="Certificate Preview"
              layout="fill"
              objectFit="cover"
              className="rounded shadow"
            /> */}
          </div>

          {/* Certificate Fields */}
          <div className="w-60">
            <Label
              htmlFor={`date-${cert.id}`}
              className="text-xs font-semibold"
            >
              Date of Certification Issue
            </Label>
            <Input
              id={`date-${cert.id}`}
              type="date"
              value={cert.issueDate}
              onChange={(e) =>
                handleChange(cert.id, "issueDate", e.target.value)
              }
            />
          </div>

          <div className="w-60">
            <Label
              htmlFor={`name-${cert.id}`}
              className="text-xs font-semibold"
            >
              Name of the gallery certificate issued
            </Label>
            <Input
              id={`name-${cert.id}`}
              type="text"
              placeholder="Enter name"
              value={cert.name}
              onChange={(e) => handleChange(cert.id, "name", e.target.value)}
            />
          </div>

          {/* Delete Button */}
          <Button
            variant="destructive"
            onClick={() => handleDelete(cert.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}
