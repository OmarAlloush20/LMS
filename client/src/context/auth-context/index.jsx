import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext, useState } from "react";
import { registerService } from "@/services";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  async function handleRegisterUser(e) {
    e.preventDefault();
    const data = await registerService(signUpFormData);

    console.log(data);
  }

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
