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

function removeUserOnline(userName, timestampUser) {
    const usersOnline = getState().usersOnline;
    let userIndex = usersOnline.findIndex(({ timestamp }) => timestamp === timestampUser);

    delete usersOnline[userIndex];

    //usersOnline.filter(user => user !== userName);
    //console.log(usersOnline);

    return usersOnline;
}

module.exports = {
    addUserOnline,
    getUsersOnline,
    removeUserOnline
};
