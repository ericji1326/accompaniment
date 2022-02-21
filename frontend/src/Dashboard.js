import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Styling/Dashboard.css";
import { auth, db, logout } from "./Firebase";
import {
  query,
  collection,
  getDocs,
  setDoc,
  where,
  doc,
} from "firebase/firestore";
import axios from "axios";
import { Box, Button } from "@material-ui/core";
import FadeIn from "react-fade-in/lib/FadeIn";
import CircularProgress from "@mui/material/CircularProgress";

function Dashboard() {
  const controller = new AbortController(); // Controller to Cancel HTTP Request
  controller.abort();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState(""); // USER NAME STATE
  const navigate = useNavigate();
  const user_id = user?.uid; // USER UID

  // GATHER MATCHES
  const [matches, setMatches] = useState([]); // Matches

  const [renderDash, setRenderDash] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  async function userStatus() {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }

  function backToSubmitHandler() {
    setMatches([]);
    setRenderDash(true);
    setIsLoading(false); // Turn off Loading Screen
  }

  // Playlist Handling
  const [playlist1, setPlaylist1] = useState("");
  const [playlist2, setPlaylist2] = useState("");
  const [playlist3, setPlaylist3] = useState("");
  function playlist1ChangeHandler(event) {
    setPlaylist1(event.target.value);
  }
  function playlist2ChangeHandler(event) {
    setPlaylist2(event.target.value);
  }
  function playlist3ChangeHandler(event) {
    setPlaylist3(event.target.value);
  }

  async function submitPlaylists(event) {
    event.preventDefault();
    const topPlaylists = [playlist1, playlist2, playlist3];
    try {
      const userDocRef = doc(db, "playlists", user?.uid);
      setDoc(
        userDocRef,
        { user_id: user?.uid, name: name, playlists: topPlaylists },
        { merge: true }
      );
    } catch (err) {
      alert(err);
    }

    setIsLoading(true);

    // Fetch From Backend
    try {
      const { data } = await axios(
        `https://accompaniment-backend.herokuapp.com/flask/findmatch?uid=${user_id}&playlist1=${playlist1}&playlist2=${playlist2}&playlist3=${playlist3}`
      );
      console.log(`https://accompaniment-backend.herokuapp.com/flask/findmatch?uid=${user_id}&playlist1=${playlist1}&playlist2=${playlist2}&playlist3=${playlist3}`);
      console.log("LEGNTH");
      console.log(data.topTwoMatches.length);
      console.log(data.topTwoMatches[0][0]);
      console.log(data.topTwoMatches[0][1]);
      console.log(data.topTwoMatches[1][0]);
      console.log(data.topTwoMatches[1][1]);
      var match = [];
      for (var i = 0; i < 2; i++) {
        if (data.topTwoMatches[i]==="undefined" ||  data.topTwoMatches[i][0]==="None") {
          match.push("None");
        } else {
          const match_uid = data.topTwoMatches[i][0];
          const q = query(
            collection(db, "users"),
            where("uid", "==", match_uid)
          );
          const doc = await getDocs(q);
          const match_data = doc.docs[0].data();
          const match_name = match_data.name;
          const match_email = match_data.email;
          const match_string = `${match_name} - ${match_email}`;
          match.push(match_string);
          if (data.topTwoMatches[i][1]===6) {
            break;
          }
        }
      }
      if (match.length === 1) {
        match.push("None");
      }
      console.log(match);
      setMatches(match);
      setIsLoading(false);
      setRenderDash(false);
      controller.abort();
    } catch (err) {
      alert(err);
      setIsLoading(false);
      controller.abort();
    }
  }

  // var match2_uid = "";
  // const match1_uid = data.topTwoMatches[0][0];
  // if (data.topTwoMatches.length > 1) {
  //   match2_uid = data.topTwoMatches[1][0]; // Must check if this does or does not exist
  // }
  // console.log(match1_uid);
  // console.log(match2_uid);
  // // No Matches
  // if (match1_uid === "None") {
  //   setMatch1("None");
  //   setMatch2("None");
  // }
  // // One Match
  // else if (match2_uid === "") {
  //   setMatch2("None");
  //   const q1 = query(
  //     collection(db, "users"),
  //     where("uid", "==", match1_uid)
  //   );
  //   const doc1 = await getDocs(q1);
  //   const match1_data = doc1.docs[0].data();
  //   const match1_name = match1_data.name;
  //   const match1_email = match1_data.email;
  //   setMatch1(`${match1_name} - ${match1_email}`);
  // }
  // Two Matches
  // else {
  //   const q1 = query(
  //     collection(db, "users"),
  //     where("uid", "==", match1_uid)
  //   );
  //   const q2 = query(
  //     collection(db, "users"),
  //     where("uid", "==", match2_uid)
  //   );
  //   const doc1 = await getDocs(q1);
  //   const doc2 = await getDocs(q2);
  //   const match1_data = doc1.docs[0].data();
  //   const match2_data = doc2.docs[0].data();
  //   const match1_name = match1_data.name;
  //   const match1_email = match1_data.email;
  //   const match2_name = match2_data.name;
  //   const match2_email = match2_data.email;
  //   setMatch1(`${match1_name} - ${match1_email}`);
  //   setMatch1(`${match2_name} - ${match2_email}`);

  async function fetchUserName() {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data?.name);
    } catch (err) {
      console.error(err);
      fetchUserName();
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  const noMatch = matches[0] === "None";
  const oneMatch = matches[0] !== "None" && matches[1] === "None";

  return (
    <div>
      {renderDash ? (
        <div className="dashboard">
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
                  Hello {name}, what are your top 3 Spotify playlists?
                </Box>
              </div>
            </FadeIn>

            <form onSubmit={submitPlaylists}>
              <div className="textbox__container">
                <input
                  style={{
                    borderRadius: 20,
                    background: "#EFEDE7",
                    padding: "6px 20px",
                    fontSize: "14px",
                    textTransform: "lowercase",
                    fontFamily: "Trebuchet MS",
                    fontStyle: "italic",
                  }}
                  className="playlist__textBox"
                  variant="contained"
                  color="black"
                  type="text"
                  placeholder="playlist 1 url"
                  value={playlist1}
                  onChange={playlist1ChangeHandler}
                />
                <input
                  style={{
                    borderRadius: 20,
                    background: "#EFEDE7",
                    padding: "6px 20px",
                    fontSize: "14px",
                    textTransform: "lowercase",
                    fontFamily: "Trebuchet MS",
                    fontStyle: "italic",
                  }}
                  className="playlist__textBox"
                  variant="contained"
                  color="black"
                  type="text"
                  placeholder="playlist 2 url"
                  value={playlist2}
                  onChange={playlist2ChangeHandler}
                />
                <input
                  style={{
                    borderRadius: 20,
                    background: "#EFEDE7",
                    padding: "6px 20px",
                    fontSize: "14px",
                    textTransform: "lowercase",
                    fontFamily: "Trebuchet MS",
                    fontStyle: "italic",
                  }}
                  variant="contained"
                  className="playlist__textBox"
                  color="black"
                  type="text"
                  placeholder="playlist 3 url"
                  value={playlist3}
                  onChange={playlist3ChangeHandler}
                />
              </div>
              <Box m={0} pt={0}>
                <Button
                  style={{
                    borderRadius: 20,
                    background: "#EFEDE7",
                    padding: "6px 20px",
                    fontSize: "14px",
                    textTransform: "lowercase",
                    fontFamily: "Trebuchet MS",
                  }}
                  variant="contained"
                  size="medium"
                  type="submit"
                >
                  {isLoading && (
                    <CircularProgress
                      sx={{ color: "black", mr: 1 }}
                      size={20}
                    />
                  )}
                  Submit Playlists
                </Button>
              </Box>
            </form>
            <Box m={2} pt={10}>
              <Button
                style={{
                  borderRadius: 20,
                  background: "#EFEDE7",
                  padding: "6px 20px",
                  fontSize: "14px",
                  textTransform: "lowercase",
                  fontFamily: "Trebuchet MS",
                }}
                variant="contained"
                size="medium"
                type="submit"
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </div>
        </div>
      ) : (
        // Render Matches When They Are Found
        <div className="dashboard">
          <div className="center">
            <Box
              m={0}
              pt={0}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {noMatch ? (
                <FadeIn delay={60}>
                  <div>sorry {name}, there are not enough users yet :c</div>
                </FadeIn>
              ) : oneMatch ? (
                <FadeIn delay={60}>
                  <div>congrats {name}! <br/><br/>your match is:</div>
                  <div>{matches[0]}</div>
                </FadeIn>
              ) : (
                <FadeIn delay={60}>
                  <div>Congrats {name}! <br/><br/>your matches are:</div>
                  <div>{matches[0]}</div>
                  <div>{matches[1]}</div>
                </FadeIn>
              )}
            </Box>

            <Box m={0} pt={10}>
              <Button
                style={{
                  borderRadius: 20,
                  background: "#EFEDE7",
                  padding: "6px 20px",
                  fontSize: "14px",
                  textTransform: "lowercase",
                  fontFamily: "Trebuchet MS",
                }}
                variant="contained"
                size="medium"
                type="submit"
                onClick={backToSubmitHandler}
              >
                Re-submit
              </Button>
            </Box>
            <Box m={0} pt={0}>
              <Button
                style={{
                  borderRadius: 20,
                  background: "#EFEDE7",
                  padding: "6px 20px",
                  fontSize: "14px",
                  textTransform: "lowercase",
                  fontFamily: "Trebuchet MS",
                }}
                variant="contained"
                size="medium"
                type="submit"
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
