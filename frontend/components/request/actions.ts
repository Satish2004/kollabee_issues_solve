'use server'

import { prisma } from '@/lib/db';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

type RequestInput = {
  sellerId: string;
  productName: string;
  additionalIngredients?: string;
  formulaDetails?: string;
  formulaImage?: string;
  quantity: number;
  packagingType?: string;
  volumePerUnit?: string;
  packagingInstructions?: string;
  deliveryDeadline?: string;
  deliveryLocation?: string;
  additionalNotes?: string;
  requestType: 'PRODUCT' | 'PACKAGING' | 'PROPOSAL';
};

export async function createRequest(data: RequestInput) {
  if (!data) {
    return {
      success: false,
      error: 'No data provided'
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error('Unauthorized');
    }
    
    const buyer = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        seller: true,
        buyer: true,
      }
    });

    try {
      const request = await prisma.request.create({
        data: {
          buyerId: user.id,
          sellerId: data.sellerId,
          productName: data.productName,
          additionalIngredients: data.additionalIngredients || null,
          formulaDetails: data.formulaDetails || null,
          formulaImage: data.formulaImage || null,
          quantity: data.quantity,
          packagingType: data.packagingType || null,
          volumePerUnit: data.volumePerUnit || null,
          packagingInstructions: data.packagingInstructions || null,
          deliveryDeadline: data.deliveryDeadline ? new Date(data.deliveryDeadline) : null,
          deliveryLocation: data.deliveryLocation || null,
          additionalNotes: data.additionalNotes || null,
          requestType: data.requestType,
        },
      });

      console.log('Request created:', request);
      revalidatePath('/requests');
      return { success: true, data: request };
    } catch (prismaError: any) {
      console.error('Prisma Error:', {
        name: prismaError.name,
        message: prismaError.message,
        code: prismaError.code,
        meta: prismaError.meta
      });
      throw prismaError;
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create request';
    console.error('Request creation error:', {
      error,
      message: errorMessage
    });
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}