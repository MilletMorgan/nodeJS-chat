//*********************//
// APP tChat SOCKET.IO //
//*********************//
const Models = require('./models.js');
const { addMessage, getMessages } = require("./db/messagesRepository");

const Chat = (server) => {
    const io = require('socket.io')(server, { path: '/api/socket' });
    let usersOnline = [];

    const getUsersNames = () => [...new Set(usersOnline.map(user => user.name))];
    //const getUsersRooms = () => [...new Set(db.messages.map(user => user.room))];

    io.on('connection', socket => {
        let currentUser = { name: null };
        let currentRoom;

        socket.on('room', room => {
            socket.join(room);
            currentRoom = room;
            socket.room = room;
            console.log("Join room " + currentRoom);
        });

        socket.on('switchRoom', (currentRoom, newsroom) => {
            socket.leave(currentRoom);
            socket.join(newsroom);
            socket.room = newsroom;
            console.log("Quit room : " + currentRoom + ", join the new room : ", newsroom);
        });

        const saveNewMessage = (message) => {
            io.emit('MESSAGE', message);
            console.log("Save message, currentRoom : " + socket.room);
            addMessage(socket.room, message);
        };

        socket.to(socket.room).emit('MESSAGES', getMessages());

        //socket.to(currentRoom).emit('ALLUSERS', db.users);

        socket.to(socket.room).on('SEND_MESSAGE', saveNewMessage);

        socket.to(socket.room).on('NEW_USER', (userName) => {
            console.log("new user : " + userName);
            currentUser = { name: userName, timestamp: Date.now() };

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
            usersOnline.push(currentUser);
            socket.to(currentRoom).emit('USERS', getUsersNames());
        });

        const disconnectUser = () => {
            console.log(`${currentUser.name} got disconnect!`);

            usersOnline = usersOnline.filter(user => user !== currentUser);
            socket.to(currentRoom).emit('USERS', getUsersNames());

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
