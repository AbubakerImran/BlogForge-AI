"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  BarChart3,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Users,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSiteSettings } from "@/components/shared/SiteSettingsProvider";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  folder: FolderOpen,
  "bar-chart": BarChart3,
  mail: Mail,
  settings: Settings,
  users: Users,
  "life-buoy": LifeBuoy,
};

const allSidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard", roles: ["ADMIN", "SUPERADMIN"] },
  { label: "Posts", href: "/dashboard/posts", icon: "file-text", roles: ["ADMIN", "SUPERADMIN"] },
  { label: "Categories", href: "/dashboard/categories", icon: "folder", roles: ["ADMIN", "SUPERADMIN"] },
  { label: "Analytics", href: "/dashboard/analytics", icon: "bar-chart", roles: ["ADMIN", "SUPERADMIN"] },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: "mail", roles: ["SUPERADMIN"] },
  { label: "Support", href: "/dashboard/support", icon: "life-buoy", roles: ["ADMIN", "SUPERADMIN"] },
  { label: "Settings", href: "/dashboard/settings", icon: "settings", roles: ["ADMIN", "SUPERADMIN"] },
  { label: "Users", href: "/dashboard/users", icon: "users", roles: ["SUPERADMIN"] },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const siteSettings = useSiteSettings();

  const userRole = session?.user?.role || "USER";
  const sidebarLinks = allSidebarLinks.filter((link) => link.roles.includes(userRole));

  const roleBadgeLabel = userRole === "SUPERADMIN" ? "Super Admin" : "Admin";

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {siteSettings.siteName}
            </span>
          </Link>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("h-8 w-8", collapsed && "mx-auto")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info with dropdown */}
      {session?.user && (
        <div className={cn("border-t p-3", collapsed && "flex justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-1 text-left hover:bg-accent transition-colors",
                  collapsed && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.user.name}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {roleBadgeLabel}
                    </Badge>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile & Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}
