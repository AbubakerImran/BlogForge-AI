"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon, LogIn, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BlogForge
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 mt-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="justify-start gap-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>

          <Separator className="my-2" />

          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => onOpenChange(false)}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn()}
              className="justify-start gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
