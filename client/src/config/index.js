const signUpFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your Username",
    type: "text",
    componentType: "input",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your Email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your Password",
    type: "password",
    componentType: "input",
  },
];
const signInFormControls = [
  {
    name: "userEmail",
    label: "Email",
    placeholder: "Enter your Email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your Password",
    type: "password",
    componentType: "input",
  },
];

const initialSignInFormData = {
  userEmail: "",
  password: "",
};

const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
};

export { signUpFormControls, signInFormControls, initialSignInFormData, initialSignUpFormData };
