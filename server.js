// First we need to set some constant variables

// *Creates our express server
const express = require("express")

// *An "app" variable used with the above function
const app = express()

// *Used to get a server, needed with socket.io. We are passing in our "app" object to the server here as well to be used with socket.io
const server = require("http").Server(app)

//  *Needed to let socket.io know what server is being used and how to interact with it.
const io = require("socket.io")(server)

// *Renaming V4 function to uuidV4 for better clarity on what it is.
const {v4: uuidV4} = require("uuid")

// Creating the server code and routing

/* *Setting up the Express server so the a route at the home page. This is for our view engine.js library. So we set this to the following,
    and the corresponding folder will be named "view*/
app.set("view engine", "ejs")

/* *Here we're setting up the route to the static folder Express will use for the static files. The folder is named "public". 
Our .js and .css files will be in this folder.
*/
app.use(express.static("public"))

/* *This will create a new room and redirects the user(s) to that room. Remember this route would normally be some kind of home page (since its just "/"),
    but since we don't have one, when going to the home page, a new chat room is generated and the user is redirected.
*/
app.get("/", (require, response)=>{
    // Redirects the user to /room and puts them in a dynamically created room. Since we want some form of room ID here. This is where the uuidV4 library comes in.
    response.redirect(`/${uuidV4()}`)
})

/* *Creating a route for our rooms. Here we have a dynamic parameter that get passed into the URL. The function takes a request and gives a response.
*/
app.get("/:room", (require, response)=>{
    // This gets the roomiD from the "/:room" parameter
    response.render("room", {roomId: require.params.room})
})

io.on("connection", socket =>{
    socket.on("join-room", (roomId, userID)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit("user-connected", userID)

        socket.on("disconnect", ()=>{
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })
})

// Dictates what port we'll be running our server on.
server.listen(3000)

/* *The video chat is peer to peer, and doesn't actually communicate through the server. The server is used just to set up the rooms. 
    No traffic is being sent through the server
 */