import "./Styling/Register.css";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./Firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  function nameChangeHandler(event) {
    setName(event.target.value);
  }

  function emailChangeHandler(event) {
    setEmail(event.target.value);
  }

  function passwordChangeHandler(event) {
    setPassword(event.target.value);
  }

  function submitHandler(event) {
    event.preventDefault();

    // Exit Early if Any Field is blank
    if (!name || !email || !password) {
      alert("Please Enter All Fields");
      return;
    }
    registerWithEmailAndPassword(name, email, password);

    setEmail(""); // Clearing after submitting expenses
    setName("");
    setPassword("");
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="register">
      <form className="form" onSubmit={submitHandler}>
        <div className="register__container">
          <input
            type="text"
            className="register__textBox"
            value={name}
            onChange={nameChangeHandler}
            placeholder="Full Name"
          />
          <input
            type="text"
            className="register__textBox"
            value={email}
            onChange={emailChangeHandler}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="register__textBox"
            value={password}
            onChange={passwordChangeHandler}
            placeholder="Password"
          />
          <button className="register__btn" type="submit">
            Register
          </button>
        </div>
      </form>

      <div className="register__container">
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Register;
