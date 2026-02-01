"use client"

import Link from "next/link"
import { UserCircle2 } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

type NavigationBarProps = {
  isAuthenticated?: boolean
}

export default function NavigationBar({
  isAuthenticated = false,
}: Readonly<NavigationBarProps>) {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
        {isAuthenticated ? (
          <div className="flex items-center">
            <UserCircle2 className="size-7 text-foreground" aria-hidden="true" />
            <span className="sr-only">User menu</span>
          </div>
        ) : null}

        <NavigationMenu className="flex-1 justify-start" viewport={false}>
          <NavigationMenuList className="justify-start">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/how-it-works"
                  className={navigationMenuTriggerStyle()}
                >
                  How it works
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/privacy" className={navigationMenuTriggerStyle()}>
                  Privacy
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {isAuthenticated ? (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/documents"
                      className={navigationMenuTriggerStyle()}
                    >
                      Documents
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/upload"
                      className={navigationMenuTriggerStyle()}
                    >
                      Upload
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            ) : null}
          </NavigationMenuList>
        </NavigationMenu>

        {isAuthenticated ? null : (
          <Link
            href="/signup"
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Sign up
          </Link>
        )}
      </div>
    </header>
  )
}
