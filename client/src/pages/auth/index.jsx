import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs.jsx";
import { signUpFormControls, signInFormControls } from "@/config";
import { GraduationCap } from "lucide-react";
import CommonForm from "@/components/common-form";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/auth-context/index";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [registrationStatus, setRegistrationStatus] = useState({
    message: "",
    success: false,
  });
  const [signInError, setSignInError] = useState("");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleloginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
    setSignInError(""); // Clear sign-in errors on tab change
  }

  function checkIfSignInFormValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleModifiedRegister = async (e) => {
    e.preventDefault();

    // Client-side email validation
    if (!isEmailValid(signUpFormData.userEmail)) {
      setRegistrationStatus({
        message: "Please enter a valid email address",
        success: false,
      });
      return;
    }

    // Client-side password validation
    if (signUpFormData.password.length < 6) {
      setRegistrationStatus({
        message: "Password must be at least 6 characters",
        success: false,
      });
      return;
    }

    const response = await handleRegisterUser(e);
    setRegistrationStatus({
      message: response.message,
      success: response.success,
    });

    if (response.success) {
      // Reset form data
      setSignUpFormData(initialSignUpFormData);
      // Switch to sign-in tab after 2 seconds
      setTimeout(() => {
        setActiveTab("signin");
      }, 2000);
    }
  };

  const handleModifiedLogin = async (e) => {
    e.preventDefault();

    // Client-side email validation
    if (!isEmailValid(signInFormData.userEmail)) {
      setSignInError("Please enter a valid email address");
      return;
    }

    // Client-side password validation
    if (signInFormData.password.length < 6) {
      setSignInError("Password must be at least 6 characters");
      return;
    }

    const response = await handleloginUser(e);
    if (!response.success) {
      setSignInError(response.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText="Sign in"
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormValid()}
                  handleSubmit={handleModifiedLogin}
                />
              </CardContent>
              {signInError && (
                <CardFooter className="pt-0">
                  <Alert className="w-full border-red-500 bg-red-50 text-red-600">
                    <AlertDescription>{signInError}</AlertDescription>
                  </Alert>
                </CardFooter>
              )}
              {registrationStatus.message && registrationStatus.success && (
                <CardFooter className="pt-0">
                  <Alert className="w-full border-green-500 bg-green-50 text-green-600">
                    <AlertDescription>{registrationStatus.message}</AlertDescription>
                  </Alert>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText="Sign Up"
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormValid()}
                  handleSubmit={handleModifiedRegister}
                />
              </CardContent>
              {registrationStatus.message && (
                <CardFooter className="pt-0">
                  <Alert
                    className={`w-full ${
                      registrationStatus.success
                        ? "border-green-500 bg-green-50 text-green-600"
                        : "border-red-500 bg-red-50 text-red-600"
                    }`}
                  >
                    <AlertDescription>{registrationStatus.message}</AlertDescription>
                  </Alert>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;