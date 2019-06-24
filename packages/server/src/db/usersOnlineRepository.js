const {
    getState,
    setState,
    saveDB
} = require('./db');

const { getUserTimestamp } = require('./usersOnlineRepository');

function addUserOnline(userName, timestamp) {
    const usersOnline = getState().usersOnline;

    usersOnline.push({ "timestamp": timestamp, "userName": userName });

    setState({ usersOnline });

    saveDB();
}

function getUsersOnline() {
    const usersOnline = getState().usersOnline;

    //console.log(usersOnline);

    return usersOnline;
}

function removeUserOnline(timestamp) {
    const usersOnline = getState().usersOnline;
    usersOnline.forEach((user, index) => {
        if (timestamp === timestamp) {

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
