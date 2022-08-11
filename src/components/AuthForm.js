import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {authService } from "../fBase";

const AuthForm = () => {
  const NAME_EMAIL = "email";
  const NAME_PWD = "password";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [newAccount, setNewAccount] = React.useState(false);
  const [error, setError] = React.useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === NAME_EMAIL) {
      setEmail(value);
    } else if (name === NAME_PWD) {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (newAccount) {
      //create account
      await createUserWithEmailAndPassword(authService, email, password)
        .then((userCredential) => {
          console.log(userCredential.user);
        })
        .catch((err) => {
          console.log("err", err);
          setError(err.message);
        });
    } else {
      // log in
      await signInWithEmailAndPassword(authService, email, password)
        .then((user) => {
          console.log("user", user);
        })
        .catch((err) => {
          console.log("err", err);
          setError(err.message);
        });
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  
  return (
    <>
    <form onSubmit={onSubmit} className="container">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={onChange}
        className="authInput"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        className="authInput"
        onChange={onChange}
      />
      <input
        type="submit"
        className="authInput authSubmit"
        value={newAccount ? "Create Account" : "Sign In"}
      />
      {error && <span className="authError">{error}</span>}
    </form>
    <span onClick={toggleAccount} className="authSwitch">
      {newAccount ? "Sign In" : "Create Account"}
    </span>
  </>
  );
};

export default AuthForm;
