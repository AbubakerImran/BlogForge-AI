import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Hardcoded permission map for performance (mirrors DB seed)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  USER: ["home", "blog", "categories-site", "about", "contact"],
  ADMIN: [
    "dashboard", "posts", "categories-dashboard", "analytics", "settings",
    "home", "blog", "categories-site", "about", "contact",
  ],
  SUPERADMIN: [
    "dashboard", "posts", "categories-dashboard", "analytics", "newsletter",
    "settings", "users", "home", "blog", "categories-site", "about", "contact",
  ],
};

export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms ? perms.includes(permission) : false;
}

export function isSuperAdmin(role: string): boolean {
  return role === "SUPERADMIN";
}

export function isAdminOrAbove(role: string): boolean {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export async function getSessionWithRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    ...session,
    user: {
      ...session.user,
      role: session.user.role || "USER",
    },
  };
}
