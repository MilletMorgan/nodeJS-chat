const { getAllUsers, getUser } = require('./db/usersRepository');

const Models = (app) => {
    app.get('/api/admin', (req, res) => res.send(getAllUsers()));

    app.get('/api/user', (req, res) => res.send(getUser()));
};

module.exports = Models;

/**
 const findRoom = (db, actualRoom) => {
    db.rooms.forEach((room) => {
        console.log("actual room : " + actualRoom);

        if (actualRoom === room.name) {
            console.log("Find room : " + room.name);
            console.log("Messages : " + room.messages);
        } else {
            console.log("not Find room : " + actualRoom);
        }
    });
    //let room = db.rooms[0].name;
    //console.log("Find Room : " + room);
};



 function saveNewMessage()





 const db = {
    state: { "rooms": [], "users": [] },


    findRoom
};
 */
