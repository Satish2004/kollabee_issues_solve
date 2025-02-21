import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import EditProduct from '@/components/form/editProduct'
import { editProduct } from './action'

const page = async({params}:{params:{productId:string}}) => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userData = await prisma.user.findUnique({
        where: {
            id:user?.id
        },
        include:{
            seller: true
        }
    })
    const productData=await prisma.product.findUnique({
        where:{
            id:params.productId
        },
        include:{
            seller: true,
            // pickupAddress: true
        }
    })
    console.log(productData)
    return (
        <EditProduct productData={productData} editProduct={editProduct} currentUser={userData?.seller?.id}/>
    )
}

export default page