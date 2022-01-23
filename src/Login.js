import "./Styling/Login.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, loginWithEmailAndPassword, signInWithGoogle } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  // Setting State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  function emailChangeHandler(event) {
    setEmail(event.target.value);
  }
  function passwordChangeHandler(event) {
    setPassword(event.target.value);
  }

  useEffect(() => {
    if (loading) {
      // Add a loading screen in the future
      return;
    }
    // If user is authenticated, redirect user to dashboard
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={emailChangeHandler}
          placeholder="Email Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={passwordChangeHandler}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => loginWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login With Google
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Login;
