'use client'
import { UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserProfile() {
    // const supabase = createClient()
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[#F3F4F6]">
                    <UserCircle className="h-5 w-5 text-[#6B7280]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E5E7EB]">
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer text-sm text-[#1F2937]">
                        Documents
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/upload" className="cursor-pointer text-sm text-[#1F2937]">
                        Upload
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/account" className="cursor-pointer text-sm text-[#1F2937]">
                        Account Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-sm text-[#EF4444] focus:text-[#EF4444]"
                    onClick={async () => {
                        // await supabase.auth.signOut()
                        router.push('/')
                        router.refresh()
                    }}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}