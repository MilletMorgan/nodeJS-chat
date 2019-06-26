const {
    getState,
    setState,
    saveDB
} = require('./db');

function addUserOnline(userName, timestamp) {
    const usersOnline = getState().usersOnline;

    usersOnline.push({ "timestamp": timestamp, "userName": userName });

    setState({ usersOnline });

    saveDB();
}

function getUsersOnline() {
    const usersOnline = getState().usersOnline;

    return usersOnline;
}

function removeUserOnline(timestamp) {
    const usersOnline = getState().usersOnline;

    usersOnline.forEach((user, index) => {
        if (timestamp === user.timestamp) {
            usersOnline.splice(index, 1);

            setState({ usersOnline });
            saveDB();
        }
    });

    return usersOnline;
}

module.exports = {
    addUserOnline,
    getUsersOnline,
    removeUserOnline
};
