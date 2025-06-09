"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  Share,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  currentUser?: any;
  onLogout?: () => void;
}

export function UserDropdown({ currentUser, onLogout }: UserDropdownProps) {
  const router = useRouter();
  const isLoading = !currentUser;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-full pr-3 pl-1 py-1 hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {isLoading ? (
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-400/60 animate-pulse flex items-center justify-center">
                    <span className="text-lg font-bold text-neutral-400">
                      ...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={currentUser?.imageUrl}
                    alt={currentUser?.name}
                    className="bg-cover"
                  />
                  <AvatarFallback className="bg-primary/10">
                    {currentUser?.name?.slice(0, 1)?.toUpperCase()}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <div className="flex flex-col items-start justify-center min-h-[48px]">
              {isLoading ? (
                <>
                  <div className="h-3 w-14 mb-1 rounded bg-neutral-400/60 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-neutral-400/60 animate-pulse" />
                </>
              ) : (
                <>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {currentUser?.role}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {currentUser?.name}
                  </span>
                </>
              )}
            </div>
          </div>
          <ChevronDown
            className="h-6 w-6 text-muted-foreground"
            strokeWidth={1}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 min-h-[44px] justify-center">
            {isLoading ? (
              <>
                <div className="h-4 w-24 mb-1 rounded bg-neutral-800/60 animate-pulse" />
                <div className="h-3 w-32 rounded bg-neutral-800/60 animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium leading-none">
                  {currentUser?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email}
                </p>
              </>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={isLoading}>
            <Link href="/seller/profile" className="flex">
              <User className="mr-4 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => !isLoading && router.push("/seller/settings")}
            className={`cursor-pointer${
              isLoading ? " opacity-50 pointer-events-none" : ""
            }`}
            disabled={isLoading}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {/* Always active Invite */}
          <DropdownMenuItem asChild>
            <Link href="/seller/invite" className="flex">
              <Share className="mr-2 h-4 w-4" />
              <span>Invite</span>
            </Link>
          </DropdownMenuItem>
          {/* Always active Feedback */}
          <DropdownMenuItem asChild>
            <Link href="/seller/contact" className="flex">
              <NotebookPen className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={isLoading ? undefined : onLogout}
          className={`text-red-600 cursor-pointer${
            isLoading ? " opacity-50 pointer-events-none" : ""
          }`}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
