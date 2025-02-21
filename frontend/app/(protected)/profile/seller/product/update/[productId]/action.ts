'use server'
import { prisma } from '@/lib/db'


export const editProduct=async(data: any)=>{
    try {
        // Destructure the incoming data
        const {
            images,
            productId,
            sellerId,
            productName,
            productDescription,
            totalQuantity,
            pickupAddressId,
            pickupAddress,
            length,
            width,
            height,
            weight,
            packageType,
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
        } = data;
    
        // Create the Pickup Address
        const createdPickupAddress = await prisma.pickupAddress.update({
            where:{
                id:pickupAddressId
            },
            data: {
                fullName: pickupAddress.fullName,
                businessName: pickupAddress.businessName,
                street: pickupAddress.street,
                city: pickupAddress.city,
                state: pickupAddress.state,
                country: pickupAddress.country,
                postalCode: pickupAddress.postalCode,
                phone: pickupAddress.phone,
                email: pickupAddress.email,
            },
        });
        // Create the Product
        const createdProduct = await prisma.product.update({
            where:{
                id:productId
            },
            data: {
                images,
                sellerId,
                name: productName,
                description: productDescription,
                availableQuantity: parseInt(totalQuantity, 10),
                pickupAddressId: createdPickupAddress.id,
                carrier,
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
            },
        });

    
        return {
            success: true,
            message: "Product updated successfully!",
            product: createdProduct,
        };
    }catch(error:any){
        console.error("Error updating product:", error instanceof Error ? error.message : error);
        return {
            success: false,
            message: "Failed to update product.",
            error: error.message,
        };
    }
}