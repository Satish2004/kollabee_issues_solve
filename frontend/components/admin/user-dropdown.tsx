"use client"
import React from 'react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserDropdownProps {
    currentUser?: any
    onLogout?: () => void
}

export function UserDropdown({ currentUser, onLogout }: UserDropdownProps) {
    const router = useRouter();
  
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full pr-3 pl-1 py-1 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={currentUser?.imageUrl}
                                alt={currentUser?.name}
                                className='bg-cover'
                            />
                            <AvatarFallback className="bg-primary/10">
                                {currentUser?.name?.slice(0, 1)?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-semibold text-muted-foreground">{currentUser?.role}</span>
                            <span className="text-xs text-neutral-500 font-medium">{currentUser?.name || 'Username'}</span>
                        </div>
                    </div>
                    <ChevronDown className="h-6 w-6 text-muted-foreground" strokeWidth={1} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser?.name || 'Aman K'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {currentUser?.email || 'aman@example.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href="/seller/profile" className="flex">
                            <User className="mr-4 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => router.push('/seller/settings')} className='cursor-pointer'>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}