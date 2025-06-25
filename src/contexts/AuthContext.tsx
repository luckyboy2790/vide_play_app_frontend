import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useCookies } from "react-cookie";

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface AuthContextType {
  user: any;
  loading: boolean;
  errorMessage: string | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const initialState = {
  user: null,
  loading: true,
  errorMessage: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "INIT":
      return { ...state, user: action.payload.user, loading: false };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user, loading: false };
    case "LOGOUT":
      return { ...state, user: null };
    case "ERROR":
      return { ...state, errorMessage: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, errorMessage: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [cookies, setCookie, removeCookie] = useCookies();

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!res.ok) throw new Error("Failed to register");

      const result = await res.json();

      const authToken = result.token;

      const user = result.user;

      const expires_in = 86400;

      setCookie("authToken", authToken, {
        path: "/",
        maxAge: expires_in,
      });

      dispatch({ type: "LOGIN_SUCCESS", payload: { user } });

      return user;
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log(email, password);

      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const result = await res.json();

      const user = result.user;

      const authToken = result.token;

      const expires_in = 86400;

      setCookie("authToken", authToken, {
        path: "/",
        maxAge: expires_in,
      });

      dispatch({ type: "LOGIN_SUCCESS", payload: { user } });
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    }
  };

  const signOut = useCallback(() => {
    dispatch({ type: "LOGOUT" });

    removeCookie("authToken");
  }, [removeCookie]);

  const getProfile = async () => {
    try {
      const token = cookies.authToken;

      if (token) {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          dispatch({ type: "INIT", payload: { user: null } });

          signOut();

          return;
        }

        const result = await res.json();

        console.log(result);

        const user = result.user;

        dispatch({ type: "INIT", payload: { user } });
      } else {
        dispatch({ type: "INIT", payload: { user: null } });
      }
    } catch {
      dispatch({ type: "INIT", payload: { user: null } });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const value: AuthContextType = {
    user: state.user,
    loading: state.loading,
    errorMessage: state.errorMessage,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
