//*********************//
// APP tChat SOCKET.IO //
//*********************//
const Chat = (server, db, saveDB) => {
    const io = require('socket.io')(server, { path: '/api/socket' });
    let usersOnline = [];

    const getUsersNames = () => [...new Set(usersOnline.map(user => user.name))];

    io.on('connection', socket => {
        let currentUser;

        const saveNewMessage = (message) => {
            io.emit('MESSAGE', message);
            db.messages.push(message);
            saveDB();
        };

        socket.join('chat');

        socket.emit('MESSAGES', db.messages);

        socket.emit('ALLUSERS', db.users);

        socket.on('SEND_MESSAGE', saveNewMessage);

        socket.on('typing', (data) => {
            socket.emit('typing', (data));
        });

        socket.on('NEW_USER', (userName) => {
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
                    minute: new Date().getMinutes()
                });
            }
            usersOnline.push(currentUser);
            io.emit('USERS', getUsersNames());
        });

        const disconnectUser = () => {
            console.log(`${currentUser.name} got disconnect!`);

            usersOnline = usersOnline.filter(user => user !== currentUser);
            io.emit('USERS', getUsersNames());

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
