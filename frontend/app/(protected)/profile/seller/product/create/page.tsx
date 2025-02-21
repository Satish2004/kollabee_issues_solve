
import { createProduct } from './action'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import ProductCreate from '@/components/form/product-create'

const page = async() => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userData = await prisma.user.findUnique({
    where: {
      id:user?.id
    },
    include:{
      seller:true
    }
  })
  console.log(userData)
  return (
    <ProductCreate onSubmit={createProduct} currentUser={userData?.seller?.id}/>
  )
}
export default page
