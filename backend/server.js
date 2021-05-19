"use strict";

const app = require('./app');
const { PORT } = require("./config");

const serverInstance = app.listen(PORT, () => {
    console.log("Started on port " + PORT);
});

const io = require("socket.io")(serverInstance, {
    cors: {
        origins: ["http://c2-scheduler.surge.sh", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

const rooms = {};
const chatrooms = {};

io.on("connection", socket => {
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.on("join chat-room", roomID => {
        if (chatrooms[roomID]) {
            chatrooms[roomID].push(socket.id);
            socket.join(roomID);
        } else {
            chatrooms[roomID] = [socket.id];
            socket.join(roomID);
        }
    });

    socket.on("send-chat-message", (room, username, message) => {
        io.to(room).emit("chat-message", {username, message});
    });

    socket.on('disconnect', () => {
        for(const room in chatrooms){
            if (chatrooms[room].includes(socket.id)){
                chatrooms[room].splice(chatrooms[room].indexOf(socket.id), 1);
            }
        }
    });
});