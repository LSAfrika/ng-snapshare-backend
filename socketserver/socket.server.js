module.exports = (server)=> {

    console.log('socket file being reached:\n');
    const io = require("socket.io")(server,{cors:{origin:['http://localhost:4200']}});
    io.on("connection", (socket) => {
       socket.emit("hello", "world");
       console.log("New Connection",socket.id);
    });

    // put other things that use io here
}   