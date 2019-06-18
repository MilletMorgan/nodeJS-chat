"use strict";

const Chat = require('./chat.js');
const Authentication = require('./authentication.js');

const express = require('express');
const fs = require('fs');

const history = require('connect-history-api-fallback');

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
try {
Authentication(app, db = loadDb(), saveDB);
Chat(server, db = loadDb(), saveDB);
} catch (e) {
    console.error(e);
}

if (process.env.NODE_ENV === 'production') {
    const { resolve, dirname } = require('path');
    const path = resolve(dirname(require.resolve(`spa/package.json`)), 'dist');

    app.use(history());
    app.use(express.static(path));

    const ngrok = require('ngrok');
    (async function() {
        console.log(await ngrok.connect(3000));
    })();
}
