"use server";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/client";

const sanitizeFileName = (fileName: string) => {
  const timestamp = new Date().toISOString(); // Get the current timestamp
  const dotIndex = fileName.lastIndexOf("."); // Find the last dot in the file name

  if (dotIndex === -1) {
    // If no extension exists, sanitize the name and append the timestamp
    return (
      fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_") + `_${timestamp}`
    );
  }

  // Separate the name and extension
  const name = fileName.slice(0, dotIndex); // Part before the last dot
  const extension = fileName.slice(dotIndex); // Part after the last dot, including the dot

  // Sanitize the name and keep the extension intact
  const sanitizedBase = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_");

  return `${sanitizedBase}_${timestamp}${extension}`;
};

export const createProduct = async (data: any) => {
  const supabase = createClient();
  try {
    // Destructure the incoming data
    const {
      images,
      sellerId,
      productName,
      productDescription,
      carrier,
      serviceType,
      additionalServices,
      price,
      totalWeight,
      declaredValue,
      itemDescriptions,
      dimensions,
      hsCode,
      countryOfOrigin,
      commercialInvoice,
      material,
      artistName,
      rarity,
      label,
      techniques,
      color,
      fabricType,
      fitType,
      discount,
      deliveryCost,
    } = data;

    //image uploading


    // Create the Pickup Address
    // const createdPickupAddress = await prisma.pickupAddress.create({
    //   data: {
    //     fullName: pickupAddress.fullName,
    //     businessName: pickupAddress.businessName,
    //     street: pickupAddress.street,
    //     city: pickupAddress.city,
    //     state: pickupAddress.state,
    //     country: pickupAddress.country,
    //     postalCode: pickupAddress.postalCode,
    //     phone: pickupAddress.phone,
    //     email: pickupAddress.email,
    //   },
    // });


    const imageUrls: string[] = [];
    for (const image of images) {
      const sanitizedFileName = sanitizeFileName(image.name);
      const { error } = await supabase.storage
        .from("kollabee")
        .upload(`details/${sanitizedFileName}`, image);

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("kollabee")
        .getPublicUrl(`details/${sanitizedFileName}`);

      if (publicData?.publicUrl) {
        imageUrls.push(publicData.publicUrl);
      }
    }
    // Create the Product
    const createdProduct = await prisma.product.create({
      data: {
        sellerId,
        images: imageUrls,
        name: productName,
        description: productDescription,
        availableQuantity: 10,
        // pickupAddressId: createdPickupAddress.id,
        
        serviceType,
        additionalServices, // Array of strings
        price: parseFloat(price),
        totalWeight: parseFloat(totalWeight),
        declaredValue: declaredValue ? parseFloat(declaredValue) : null,
        itemDescriptions, // Array of strings
        dimensions: dimensions || null,
        hsCode: hsCode || null,
        countryOfOrigin: countryOfOrigin || null,
        commercialInvoice: commercialInvoice || null,
        material,
        artistName,
        rarity,
        label,
        techniques,
        color,
        fabricType,
        fitType,
        discount,
        deliveryCost,
      },
    });

    console.log(createProduct);

    return {
      success: true,
      message: "Product added successfully!",
      product: createdProduct,
    };
  } catch (error: any) {
    console.error(
      "Error adding product:",
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      message: "Failed to add product.",
      error: error.message,
    };
  }
};
