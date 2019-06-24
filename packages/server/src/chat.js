//*********************//
// APP tChat SOCKET.IO //
//*********************//
const Models = require('./models.js');
const { addMessage, getMessages } = require("./db/messagesRepository");
const { addUserOnline, getUsersOnline, removeUserOnline } = require('./db/usersOnlineRepository');

const Chat = (server) => {
    const io = require('socket.io')(server, { path: '/api/socket' });
    let usersOnline = [];

    const getUsersNames = () => [...new Set(usersOnline.map(user => user.name))];
    //const getUsersRooms = () => [...new Set(db.messages.map(user => user.room))];

    io.on('connection', socket => {
        let currentUser = { name: null, timestamp: null };
        let currentRoom;

        socket.on('room', room => {
            socket.join(room);
            currentRoom = room;
            socket.room = room;
            //console.log("Join room " + currentRoom);
        });

        socket.on('switchRoom', (currentRoom, newsroom) => {
            socket.leave(currentRoom);
            socket.join(newsroom);
            socket.room = newsroom;
            //console.log("Quit room : " + currentRoom + ", join the new room : ", newsroom);
        });

        const saveNewMessage = (message) => {
            //console.log("Save message, currentRoom : " + socket.room);
            addMessage(socket.room, message);
            io.emit('MESSAGE', message);
        };

        const saveNewUserOnline = (userName, timestamp) => {
            addUserOnline(userName, timestamp);
            //io.emit('USERSONLINE', userName);
        };

        socket.emit('MESSAGES', getMessages());

        //socket.to(currentRoom).emit('ALLUSERS', db.users);

        socket.on('SEND_MESSAGE', saveNewMessage);

        socket.emit('GET_USERSONLINE',
            getUsersOnline(),
            console.log("getUsersOnline : " + getUsersOnline())
        );

        socket.on('NEW_USER', (userName) => {
            //console.log("new user : " + userName);
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

            //console.log("Current user : " + usersOnline);
            //usersOnline.push(currentUser);
            //console.log("Usersonline : " + usersOnline);

            socket.emit('USERS', getUsersOnline());
            saveNewUserOnline(currentUser.name, currentUser.timestamp);
        });

        const disconnectUser = () => {
            //console.log(`${currentUser.name} got disconnect!`);
            //usersOnline = usersOnline.filter(user => user !== currentUser);

            removeUserOnline(currentUser.name, currentUser.timestamp);
            socket.emit('USERS', getUsersOnline());

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
