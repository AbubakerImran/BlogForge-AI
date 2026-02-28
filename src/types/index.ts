import type { Post, User, Category, Tag } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

export type ExtendedUser = DefaultUser & {
  id: string;
  role: string;
};

export type PostWithRelations = Post & {
  author: User;
  category: Category | null;
  tags: Tag[];
};

export type CategoryWithCount = Category & {
  _count: {
    posts: number;
  };
};

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
