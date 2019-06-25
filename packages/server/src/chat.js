//*********************//
// APP tChat SOCKET.IO //
//*********************//
const { addMessage, getMessages } = require("./db/messagesRepository");
const { getUsersOnline, removeUserOnline } = require('./db/usersOnlineRepository');

const Chat = (server) => {
    const io = require('socket.io')(server, { path: '/api/socket' });

    const getUsersNames = () => [...new Set(getUsersOnline().map(user => user.name))];

    io.on('connection', socket => {
        let currentUser = { name: null, timestamp: null };
        let currentRoom;

        socket.on('room', room => {
            socket.join(room);
            currentRoom = room;
            socket.room = room;
        });

        socket.on('switchRoom', (currentRoom, newsroom) => {
            socket.leave(currentRoom);
            socket.join(newsroom);
            socket.room = newsroom;
        });

        const saveNewMessage = (message) => {
            addMessage(socket.room, message);
            io.emit('MESSAGE', message);
        };

        io.emit('USERS_ONLINE', getUsersOnline());
        socket.emit('MESSAGES', getMessages());

        socket.on('SEND_MESSAGE', saveNewMessage);

        //socket.to(currentRoom).emit('ALLUSERS', db.users);

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
