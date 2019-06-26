const {
    getState,
    setState,
    saveDB
} = require('./db');

function addUserOnline(userName, timestamp) {
    const usersOnline = getState().usersOnline;

    usersOnline.push({ "room": null, useronline: [{ "timestamp": timestamp, "userName": userName }] });

    setState({ usersOnline });

    saveDB();
}

function addRoomToUserOnline(timestamp, newroom) {
    const usersOnline = getState().usersOnline;

    usersOnline.forEach((user, index) => {
        if (timestamp === user.useronline[index].timestamp) {
            usersOnline[index].room = newroom;

            setState({ usersOnline });
            saveDB();
        }
    });

    return usersOnline;
}

function getUsersOnline(roomName) {

    const usersOnline = getState().usersOnline;
    let room = null;
    usersOnline.forEach((user, index) => {
        room = user[index].find(({ room }) => room === roomName);
        console.log("room : ", user[index]);
    });

    console.log("room : ", usersOnline[0].room);

    if (!room) return [];

    return room.useronline;
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
    removeUserOnline,
    addRoomToUserOnline
};
