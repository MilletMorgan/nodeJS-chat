const {
    getState,
    setState,
    saveDB
} = require('./db');


// FONCTIONNE //
function addUserOnline(userName, timestamp) {
    const usersOnline = getState().usersOnline;

    usersOnline.push({ "room": "globalRoom", useronline: [{ "timestamp": timestamp, "userName": userName }] });

    setState({ usersOnline });

    saveDB();
}

// FONCTIONNE //
function addRoomToUserOnline(timestamp, newroom) {
    const usersOnline = getState().usersOnline;

    usersOnline.forEach((user, index) => {
        //console.log("addRoomToUserOnline : ", user.useronline[0].timestamp);
        if (timestamp === user.useronline[0].timestamp) {
            usersOnline[index].room = newroom;

            setState({ usersOnline });
            saveDB();
        }
    });

    return usersOnline;
}

let allUser = [];

// FONCTIONNE A PEU PRÊT... //
function getUsersOnline(roomName) {
    const usersOnline = getState().usersOnline;

    usersOnline.forEach((user) => {
        allUser = [];
        if (user.room === roomName) {
            allUser.push(user.useronline);
        }
    });

    return allUser;
}

// FONCTIONNE
function removeUserOnline(timestamp) {
    const usersOnline = getState().usersOnline;

    usersOnline.forEach((user, index) => {
        if (timestamp === user.useronline[0].timestamp) {
            usersOnline.splice(index, 1);
            allUser.splice(index, 1);

            setState({ usersOnline });
            saveDB();
        }
    });

    return { usersOnline, allUser };
}

module.exports = {
    addUserOnline,
    getUsersOnline,
    removeUserOnline,
    addRoomToUserOnline
};
