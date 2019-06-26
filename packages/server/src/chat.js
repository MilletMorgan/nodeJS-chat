//*********************//
// APP tChat SOCKET.IO //
//*********************//
const { addMessage, getMessages } = require("./db/messagesRepository");
const { getUsersOnline, removeUserOnline } = require('./db/usersOnlineRepository');

const Chat = (server) => {
    const io = require('socket.io')(server, { path: '/api/socket' });

    const getUsersNames = () => [...new Set(getUsersOnline().map(user => user.name))];

    const rooms = ['room1','room2','room3'];

    io.on('connection', socket => {
        let currentUser = { name: null, timestamp: null };
        let currentRoom;

        socket.on('room', room => {
            socket.room = 'room1';
            socket.join('room1');
            currentRoom = socket.room;

            saveNewMessage({
                author: 'ConnectionBot',
                content: `Connecter à la room : ${socket.room}`,
                date: new Date().getDate(),
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes(),
            });

            console.log("Join room " + socket.room);
        });

        socket.on('switchRoom', (currentRoom, newsroom) => {
            socket.leave(socket.room);
            socket.join(newsroom);
            socket.room = newsroom;


            saveNewMessage({
                author: 'ConnectionBot',
                content: `Connecter à la room : ${socket.room}`,
                date: new Date().getDate(),
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes(),
            });

            console.log("Join room " + socket.room);
        });

        const saveNewMessage = (message) => {
            addMessage(socket.room, message);
            io.emit('MESSAGE', message);
        };

        //socket.to(currentRoom).emit('ALLUSERS', db.users);

        io.emit('USERS_ONLINE', getUsersOnline());

        socket.broadcast.to('room2').emit('MESSAGES', getMessages(socket.room), console.log(socket.room));

        socket.broadcast.to('room1').on('SEND_MESSAGE', saveNewMessage, console.log(socket.room));

        socket.on('NEW_USER', (userName, timestamp) => {
            currentUser = { name: userName, timestamp: timestamp };
            console.log(currentUser.name);

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
        });

        const disconnectUser = () => {
            removeUserOnline(currentUser.timestamp);
            io.emit('USERS_ONLINE', getUsersOnline());

            console.log(currentUser.name + "s'est déconnécté");

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
        };

        socket.on('USER_LEAVE', disconnectUser);
        socket.on('disconnect', disconnectUser);
    });
};

module.exports = Chat;
