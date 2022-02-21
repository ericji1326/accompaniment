import "./Styling/Login.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, loginWithEmailAndPassword, signInWithGoogle } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Button } from "@material-ui/core";
import FadeIn from "react-fade-in";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Styling/Common.css";

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
      return;
    }
    // If user is authenticated, redirect user to dashboard
    if (user) navigate("/dashboard");
  }, [user, loading]);

  function getHomeHandler() {
    navigate("/");
  }

  return (
    <div className="login">
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
              start by signing in
            </Box>
          </div>
        </FadeIn>
        <div className="textbox__container">
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
            className="login__textBox"
            value={email}
            onChange={emailChangeHandler}
            placeholder="Email Address"
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
            type="password"
            className="login__textBox"
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
            onClick={() => loginWithEmailAndPassword(email, password)}
            variant="contained"
            size="medium"
          >
            Login
          </Button>
          <div></div>
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
            Login With Google
          </Button>
          <div></div>
          <div className="link__text">
            <Link to="/reset" className="link">
              forgot password?
            </Link>
          </div>
          <div className="link__text">
            don't have an account?{" "}
            <Link className="link" to="/register">
              register
            </Link>{" "}
            now.
          </div>
        </div>
      </div>
      <div className="bottom">
        <Box m={-5} pt={0}>
          <ArrowBackIcon
            style={{ fontSize: 60, color: "#444444" }}
            onClick={getHomeHandler}
          ></ArrowBackIcon>
        </Box>
        {/* <Box m={0} pt={0}>
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
            color="black"
            size="medium"
            onClick={getHomeHandler}
          >
            go back
          </Button>
        </Box> */}
      </div>
    </div>
  );
}

export default Login;
