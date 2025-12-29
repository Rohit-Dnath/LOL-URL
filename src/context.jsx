import { createContext, useContext } from "react";
import { useSession } from "@/lib/auth/session";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const { session, status } = useSession();
  const user = session?.user;
  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <UrlContext.Provider value={{ user, loading, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;