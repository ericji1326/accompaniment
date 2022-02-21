import "./Styling/Register.css";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./Firebase";
import "./Styling/Common.css";
import FadeIn from "react-fade-in/lib/FadeIn";

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

  function getToLoginHandler() {
    navigate("/login");
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
      <div className="center">
      <FadeIn delay={0} className="typewriter__container_secondary">
          <div>
            <Box
              m={0}
              pt={0}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              create an account
            </Box>
          </div>
        </FadeIn>
        <form className="form" onSubmit={submitHandler}>
          <div className="register__container">
            <input
              style={{
                borderRadius: 20,
                background: "#EFEDE7",
                padding: "6px 20px",
                fontSize: "14px",
                fontFamily: "Trebuchet MS",
              }}
              // className="button__container"
              variant="contained"
              type="text"
              className="register__textBox"
              value={name}
              onChange={nameChangeHandler}
              placeholder="Full Name"
            />
            <input
              style={{
                borderRadius: 20,
                background: "#EFEDE7",
                padding: "6px 20px",
                fontSize: "14px",
                textTransform: "lowercase",
                fontFamily: "Trebuchet MS",
              }}
              // className="button__container"
              variant="contained"
              type="text"
              className="register__textBox"
              value={email}
              onChange={emailChangeHandler}
              placeholder="E-mail Address"
            />
            <input
              style={{
                borderRadius: 20,
                background: "#EFEDE7",
                padding: "6px 20px",
                fontSize: "14px",
                textTransform: "lowercase",
                fontFamily: "Trebuchet MS",
              }}
              // className="button__container"
              variant="contained"
              type="password"
              className="register__textBox"
              value={password}
              onChange={passwordChangeHandler}
              placeholder="Password"
            />
            <Button
              style={{
                borderRadius: 20,
                background: "#EFEDE7",
                padding: "6px 20px",
                fontSize: "14px",
                textTransform: "lowercase",
                fontFamily: "Trebuchet MS",
              }}
              type="submit"
              variant="contained"
              size="medium"
            >
              register
            </Button>
          </div>
        </form>
        <Button
          style={{
            borderRadius: 20,
            background: "#EFEDE7",
            padding: "6px 20px",
            fontSize: "14px",
            textTransform: "lowercase",
            fontFamily: "Trebuchet MS",
          }}
          onClick={signInWithGoogle}
          variant="contained"
          size="medium"
        >
          register with Google
        </Button>
      </div>
      <div className="bottom">
        <Box m={0} pt={0}>
          <Button
            style={{
              borderRadius: 20,
              background: "#9E9E9C",
              padding: "6px 20px",
              fontSize: "14px",
              textTransform: "lowercase",
              fontFamily: "Trebuchet MS",
            }}
            variant="contained"
            size="medium"
            onClick={getToLoginHandler}
          >
            back to login
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default Register;
