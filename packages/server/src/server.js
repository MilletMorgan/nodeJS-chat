"use strict";

const Chat = require('./chat.js');
const Authentication = require('./authentication.js');

const express = require('express');
const fs = require('fs');

const router = express.Router();
const app = express();

let db;

//********//
// SERVER //
//*******//
app.use('/api', router);

let port = process.env.PORT || 3000;

function loadDb() {
    return fs.existsSync('./db.json') ? JSON.parse(fs.readFileSync('./db.json').toString()) : {
        messages: [],
        users: [],
        usersonline: []
    };
}

function saveDB() {
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

let server = app.listen(port, function () {
    db = loadDb();
    console.log('Server listening on port ' + port);
});

Authentication(app, db = loadDb());

Chat(server, db = loadDb(), saveDB);
