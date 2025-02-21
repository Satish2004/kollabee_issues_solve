'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Store,
  ShoppingCart,
  Users,
  MessageSquare,
  Package,
  Bot,
  Headphones,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { getUser } from '../chat/action'

const Sidebar = () => {
  const pathname = usePathname()

  const mainLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/marketplace', label: 'Marketplace', icon: Store },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/suppliers', label: 'My Suppliers', icon: Users },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/matchmaker', label: 'AI Matchmaker', icon: Bot },
  ]

  const guideLinks = [
    { href: '/support', label: 'Support', icon: Headphones },
  ]

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: Icon }) => {
    const isActive = pathname === href
    
    return (
      <Link 
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
          isActive && "bg-red-50 text-red-600"
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    )
  }

  const supabase = createClient()
  const [user,setUser]=useState<User | null>(null);
  
  useEffect(()=>{
    supabase.auth.getUser().then(async({data:{user}})=>{
        console.log('supabase user', user)
        const userData = await getUser(user?.id || "")
        console.log('prisma user', userData)
        setUser(userData);
    })
  },[]) 

  useEffect(()=>{   
    console.log("sidebar user")
    console.log(user)
  },[user])
  
  return (
    <div className="w-64 h-[92vh] bg-white dark:bg-black border-r flex flex-col fixed z-10">


      {/* User Profile */}
      <div className="px-4 py-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <Image
            src={user?.imageUrl || "/avatar.jpg"}
            alt="User"
            width={40}
            height={40}
          />
        </div>
        <div>
          <div className="text-xs text-gray-500">{user?.role}</div>
          <div className="text-sm font-medium">{user?.name}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 py-4 flex flex-col gap-1">
        <div className="px-2 py-1 text-xs font-medium text-gray-500">MAIN</div>
        {mainLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}

        <div className="px-2 mt-4 py-1 text-xs font-medium text-gray-500">GUIDES</div>
        {guideLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t">
        <Link 
          href="/help" 
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </Link>
        <button 
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
          onClick={() => {/* Add logout logic */}}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
