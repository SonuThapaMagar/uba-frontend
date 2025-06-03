import React from "react";

type Props = {
  mode: "login" | "signup";
};

const AuthForm: React.FC<Props> = ({ mode }) => {
  return (
    <form className="w-full max-w-sm space-y-4">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      {mode === "signup" && <input type="text" placeholder="Full Name" />}
      <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
    </form>
  );
};

export default AuthForm;
