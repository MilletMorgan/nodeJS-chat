const fs = require('fs');

const dbPath = './db.json';

let state = { "rooms": [], "users": [], "usersOnline": [] };
let isDBLoaded = false;

function setState(newState) {
    state = { ...getState(), ...newState };
}

function getState() {
    return JSON.parse(JSON.stringify(state));
}

function loadDb() {
    if (fs.existsSync(dbPath)) {
        setState(JSON.parse(fs.readFileSync(dbPath).toString()));
    }
}

function saveDB() {
    fs.writeFileSync(dbPath, JSON.stringify(getState(), null, 2));
}

if (!isDBLoaded) {
    loadDb();
    isDBLoaded = true;
}

module.exports = {
    getState,
    setState,
    saveDB,
};
