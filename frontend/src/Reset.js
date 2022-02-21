import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "./Firebase";
import "./Styling/Reset.css";
import "./Styling/Common.css";
import { Box, Button } from "@material-ui/core";
import Typewriter from "typewriter-effect";
import FadeIn from "react-fade-in/lib/FadeIn";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  function returnToLoginHandler() {
    navigate("/login");
  }

  function navigateToRegistrationHandler() {
    navigate("/register");
  }

  return (
    <div className="reset">
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
              reset your account here
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
            variant="contained"
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
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
            onClick={() => sendPasswordReset(email)}
            variant="contained"
            size="medium"
          >
            Send password reset email
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
            onClick={navigateToRegistrationHandler}
            variant="contained"
            size="medium"
          >
            don't have an account?
          </Button>
        </div>
      </div>
      <div className="bottom">
        <Box m={0} pt={15}>
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
            onClick={returnToLoginHandler}
          >
            back to login
          </Button>
        </Box>
      </div>
    </div>
  );
}
export default Reset;
