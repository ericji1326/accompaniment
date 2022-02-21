import React from "react";
import Typewriter from "typewriter-effect";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import "./Styling/Intro.css";
import FadeIn from "react-fade-in";
import "./Styling/Common.css";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SpotifyLogo from './assets/spotify.jpeg'
import { sizeHeight } from "@mui/system";

function Intro() {
  const navigate = useNavigate();

  function getStartedHandler() {
    navigate("/login");
  }

  return (
    <div className="overall">
      <div className="center">
        <div className="typewriter__container_main">
          <Box
            m={0}
            pt={5}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString("accompaniment").start();
              }}
            />
          </Box>
        </div>
        <FadeIn delay={2300} className="typewriter__container_secondary">
          <div>
            <Box
              m={0}
              pt={0}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              find friends through music
            </Box>
          </div>
        </FadeIn>
      </div>
      <div className="bottom_button">
        <Box m={-6} pt={20}>
          <PlayCircleOutlineIcon style={{fontSize: 60, color: "#444444"}} onClick={getStartedHandler}>
          </PlayCircleOutlineIcon>

          {/* <Button
            style={{
              borderRadius: 20,
              background: "#D9DADB",
              padding: "6px 20px",
              fontSize: "14px",
              textTransform: "lowercase",
              fontFamily: "Trebuchet MS",
            }}
            // className="button__container"
            variant="contained"
            color="black"
            size="medium"
            onClick={getStartedHandler}
          >
            get started
          </Button> */}
        </Box>
        <Box m={0} pt={10}>
          <img width="70%" src={require('./assets/spotify.jpeg')} />
        </Box>
      </div>
    </div>
  );
}

export default Intro;
