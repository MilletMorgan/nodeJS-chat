"use strict";

const Chat = require('./chat.js');
const Authentication = require('./authentication.js');

const express = require('express');
const fs = require('fs');

const history = require('connect-history-api-fallback');

const router = express.Router();
const app = express();

let db = loadDb();

//********//
// SERVER //
//*******//
app.use('/api', router);

let port = process.env.PORT || 3000;

function loadDb() {
    return fs.existsSync('./db.json')
        ? JSON.parse(fs.readFileSync('./db.json').toString())
        : { "rooms": [], "users": [] };
}

function saveDB() {
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

let server = app.listen(port, function () {
    //console.log(db.messages);
    console.log('Server listening on port ' + port);
});

router.get('/messages', (req, res) => res.json(db.messages));

router.get('/usersonline', (req, res) => res.json(db.usersonline));

router.get('/users', (req, res) => res.json(db.users));

try {
    Authentication(app, db, saveDB);
    Chat(server, db, saveDB);
} catch (e) {
    console.error(e);
}

if (process.env.NODE_ENV === 'production') {
    const { resolve, dirname } = require('path');
    const path = resolve(dirname(require.resolve(`spa/package.json`)), 'dist');

    app.use(history());
    app.use(express.static(path));

    const ngrok = require('ngrok');
    (async function () {
        console.log(await ngrok.connect(3000));
    })();
}
