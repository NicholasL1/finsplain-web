'use client'
import { UserCircle } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu'
import { signOutAction } from '@/src/app/actions'
import Link from 'next/link'

interface UserProfileProps {
  userName?: string
}

export default function UserProfile({ userName }: UserProfileProps) {
  const initial = userName?.trim()[0]?.toUpperCase() ?? ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0 hover:bg-accent">
          {initial ? (
            <span className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm select-none">
              {initial}
            </span>
          ) : (
            <UserCircle className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border">
        {userName && (
          <>
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer text-sm text-foreground">
            Documents
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/upload" className="cursor-pointer text-sm text-foreground">
            Upload
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/account" className="cursor-pointer text-sm text-foreground">
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-sm text-red-500 focus:text-red-500"
          onClick={() => signOutAction()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
