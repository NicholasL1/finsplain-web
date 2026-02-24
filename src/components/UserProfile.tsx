'use client'
import { UserCircle } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu'
import { signOutAction } from '@/src/app/actions'
import Link from 'next/link'

export default function UserProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border">
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
