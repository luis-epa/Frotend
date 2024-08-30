import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Guardar token
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
    // Guardar usuario
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Guardar estado
    const storedLoggedInStatus = localStorage.getItem("isLoggedIn");
    if (storedLoggedInStatus === "true") {
      setIsLoggedIn(true);
    }

    setIsLoading(false);
  }, []);

  function login(accessToken, user) {
    setIsLoggedIn(true);
    setAccessToken(accessToken);
    setUser(user);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function logout() {
    setIsLoggedIn(false);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  const authValue = {
    isLoggedIn,
    isLoading,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
