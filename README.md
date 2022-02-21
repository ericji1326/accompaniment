# accompaniment

![](accompaniment-demo.gif)

# Project Intro
They say that the music you listen to can be indicative of your personality type. I thought it would be interesting to create a web app that can match people together based on their song preferences. In this app, users will sign in and input three public spotify playlists. Upon submitting the playlists, the matching algorithm will run and the user will shortly see their matches (up to two people). The idea is that the users who get matched together will have a lot in common and would get along well as a result. The matching algorithm was implemented with a relatively simple machine learning algorithm called k-nearest neighbours. Using the Spotify API, the songs in the playlists are converted to a "song-meta-data" vector which encodes some properties of the song such as danceability score out of 1 which is represented as an element of the input vector.

# Project Techstack
I decided to make use of my ReactJS and Material UI skills to build a front end user interface and my Python/Flask skills to build a backend where the machine learning algorithm is executed. The authentication system and DB storage to store user emails, names and playlists are done with the help of Google Firebase.  

# Link to Active Site
Feel free to try out the website at: https://accompaniment.netlify.app/
Enjoy!
