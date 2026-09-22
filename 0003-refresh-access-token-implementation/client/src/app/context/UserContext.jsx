import { useCallback, useEffect, useRef, useState } from "react";
import { UserContext } from "./user-context";

const ACCESS_TOKEN_KEY = "accessToken";

const getStoredAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const storeAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(getStoredAccessToken);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedUser = useRef(false);

  const setAccessToken = useCallback((token) => {
    storeAccessToken(token);
    setAccessTokenState(token);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      setAccessToken(null);
      return null;
    }

    const { accessToken: refreshedToken } = await response.json();
    setAccessToken(refreshedToken);
    return refreshedToken;
  }, [setAccessToken]);

  const fetchUser = useCallback(async (token) => {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch user");
    }

    const result = await response.json();
    setUser(result.data.user);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = accessToken || (await refreshAccessToken());

    if (!token) {
      setUser(null);
      return;
    }

    try {
      await fetchUser(token);
    } catch {
      const refreshedToken = await refreshAccessToken();

      if (refreshedToken) {
        await fetchUser(refreshedToken);
      } else {
        setUser(null);
      }
    }
  }, [accessToken, fetchUser, refreshAccessToken]);

  useEffect(() => {
    if (hasLoadedUser.current) {
      return;
    }

    hasLoadedUser.current = true;
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const value = {
    user,
    accessToken,
    isLoading,
    setUser,
    setAccessToken,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
