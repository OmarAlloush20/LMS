import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext, useEffect, useState } from "react";
import { loginService, registerService, checkAuthService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(e) {
    e.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        return {
          success: true,
          message:
            data.message || "User registered successfully! Please sign in.",
        };
      } else {
        return {
          success: false,
          message:
            data.message || "Registration failed. Email may already exist.",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  }

  async function handleloginUser(e) {
    e.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        return { success: true, message: "Login successful" };
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        return {
          success: false,
          message: data.message || "Invalid email or password",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Check auth error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
    sessionStorage.removeItem("accessToken");
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleloginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton className="w-full h-screen" /> : children}
    </AuthContext.Provider>
  );
}
