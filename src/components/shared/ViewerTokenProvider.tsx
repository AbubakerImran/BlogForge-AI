"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ViewerTokenContext = createContext<string | null>(null);

const VIEWER_TOKEN_KEY = "blogforge_viewer_token";

function generateToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function ViewerTokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.id) {
      // Signed-in user: use their user ID as viewer token
      setToken(`user_${session.user.id}`);
      // Clear public token since user is signed in
      localStorage.removeItem(VIEWER_TOKEN_KEY);
    } else {
      // Public user: get or create a persistent token
      let storedToken = localStorage.getItem(VIEWER_TOKEN_KEY);
      if (!storedToken) {
        storedToken = `pub_${generateToken()}`;
        localStorage.setItem(VIEWER_TOKEN_KEY, storedToken);
      }
      setToken(storedToken);
    }
  }, [session, status]);

  return (
    <ViewerTokenContext.Provider value={token}>
      {children}
    </ViewerTokenContext.Provider>
  );
}

export function useViewerToken() {
  return useContext(ViewerTokenContext);
}
