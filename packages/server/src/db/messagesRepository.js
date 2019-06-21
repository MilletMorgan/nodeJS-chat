const {
    getState,
    setState,
    saveDB,
} = require('./db');

function newRoom(name) {
    return { name, messages: [] };
}

function addMessage(roomName, message) {
    const rooms = getState().rooms;
    let roomIndex = rooms.findIndex(({ name }) => name === roomName);

    if (roomIndex === -1) {
        roomIndex = rooms.push(newRoom(roomName)) - 1;
    }

    rooms[roomIndex].messages.push(message);

    setState({ rooms });

    saveDB();
}

function getMessages(roomName) {
    const rooms = getState().rooms;
    const room = rooms.find(({ name }) => name === roomName);

    if (!room) {
        return [];
    }
    return room.messages;
}

module.exports = {
    addMessage,
    getMessages,
};
