//*********************//
// APP tChat SOCKET.IO //
//*********************//
const { addMessage, getMessages } = require("./db/messagesRepository");
const { getUsersOnline, removeUserOnline, addRoomToUserOnline } = require('./db/usersOnlineRepository');

const Chat = (server) => {
    const io = require('socket.io')(server, { path: '/api/socket' });


    io.on('connection', socket => {
        socket.room = 'globalRoom';
        socket.join(socket.room);
        let currentUser = { name: null, timestamp: null };

        //const getUsersNames = () => [...new Set(getUsersOnline(socket.room).map(user => user.useronline[0].name))];

        //console.log("getUsersNames : ", getUsersNames());
        //console.log("getUsersOnline : ", gxetUsersOnline(socket.room));

        socket.on('switchRoom', (currentRoom, newsroom) => {
            let allUsers = [];
            if (currentRoom !== newsroom) {
                socket.leave(socket.room);
                socket.join(newsroom);
                socket.room = newsroom;

                io.sockets.in(socket.room).emit('MESSAGES', getMessages(socket.room));
                addRoomToUserOnline(currentUser.timestamp, socket.room);
                allUsers = getUsersOnline(socket.room);
                console.log("chat, getUsersOnline : ", allUsers);
                io.emit('USERS_ONLINE', allUsers);
            }

            /*
            saveNewMessage({
                author: 'ConnectionBot',
                content: `Connecter à la room : ${socket.room}`,
                date: new Date().getDate(),
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes(),
            });

             */

            //console.log("Join room " + socket.room);
        });

        const saveNewMessage = (message) => {
            //console.log("save new message function");
            addMessage(socket.room, message);
            io.emit('MESSAGE', message);
        };

        socket.broadcast.to(socket.room).on('SEND_MESSAGE', saveNewMessage);

        //io.emit('USERS_ONLINE', getUsersOnline(socket.room));

        //socket.broadcast.to('room2').emit('MESSAGES', getMessages(socket.room), console.log(socket.room));

        //socket.broadcast.to('room1').on('SEND_MESSAGE', saveNewMessage, console.log(socket.room));

        socket.on('NEW_USER', (userName, timestamp) => {
            currentUser = { name: userName, timestamp: timestamp };

            /*
            if (!getUsersNames().includes(currentUser.name)) {
                saveNewMessage({
                    author: 'ConnectionBot',
                    content: `${currentUser.name} s'est connecté !`,
                    date: new Date().getDate(),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes(),
                });
            }

             */
        });

        const disconnectUser = () => {
            removeUserOnline(currentUser.timestamp);
            io.emit('USERS_ONLINE', getUsersOnline(socket.room));

            //console.log(currentUser.name + "s'est déconnécté");

            /*
            if (!getUsersNames().includes(currentUser.name)) {
                saveNewMessage({
                    author: 'ConnectionBot',
                    content: `${currentUser.name} s'est déconnecté !`,
                    date: new Date().getDate(),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes()
                });
            }

             */
        };

        socket.on('USER_LEAVE', disconnectUser);
        socket.on('disconnect', disconnectUser);
    });
};



module.exports = Chat;
