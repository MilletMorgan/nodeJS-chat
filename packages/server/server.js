"use strict";

const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport/lib');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const router = express.Router();
const axios = require('axios');
let db;

const app = express();

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

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        db.users.forEach((user) => {
            if (email === user.email) {
                if (!user) return done(null, false, { message: 'Invalid credentials.\n' });
                if (!bcrypt.compareSync(password, user.password))
                    return done(null, false, { message: 'Invalid credentials.\n' });

                return done(null, user);
            }
        });
    }
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    db.users.forEach((user) => {
        if (user.id === id) return done(null, user);
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    genid: (req) => {
        return uuid();
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/login', (req, res) => {
    if (req.isAuthenticated()) res.send(req.user);
});

app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info) return res.send(info.message);
        if (err) return next(err);
        if (!user) return res.redirect('/login');
        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect('/api/authrequired');
        });
    })(req, res, next);
});

app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/api/register', (req, res, next) => res.send("/register"));

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    let getLastId = db.users[db.users.length - 1].id;
    let id = getLastId + 1;

    bcrypt.hash(password, 10, function (err, password) {
        db.users.push({ id, name, email, password });
        res.json({ name, email });
        saveDB();
    });
});

app.get('/api/authrequired', (req, res) => res.send(req.user) ? req.isAuthenticated() : res.redirect('/'));

app.use(express.json());

router.post('/user', (req, res) => {
    axios.post(`http://localhost:5000/users`, {
        'name': req.body.name,
        'email': req.body.email,
        'password': req.body.password
    }).then((response) => console.log(response))
        .catch((error) => console.log(error));
});

router.get('/messages', (req, res) => res.json(db.messages));

router.get('/usersonline', (req, res) => res.json(db.usersonline));

router.get('/users', (req, res) => res.json(db.users));

router.post('/postdata', () => db.push("/test1", "super test"));

//*********************//
// APP tChat SOCKET.IO //
// Register            //
//*********************//
const io = require('socket.io')(server, { path: '/api/socket' });
const usersOnline = [];

io.on('connection', socket => {
    let user_name;
    const saveNewMessage = (message) => {
        io.emit('MESSAGE', message);
        db.messages.push(message);
        saveDB();
    };

    socket.join('chat');

    socket.emit('MESSAGES', db.messages);

    socket.emit('ALLUSERS', db.users);

    socket.on('SEND_MESSAGE', saveNewMessage);

    socket.on('NEW_USER', (userName) => {
        console.log("new user : " + userName);
        usersOnline.push(userName);
        user_name = userName;
        io.emit('USERS', usersOnline);

        saveNewMessage({
            author: 'ConnectionBot',
            content: `${userName} s'est connecté !`,
            date: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            hour: new Date().getHours(),
            minute: new Date().getMinutes()
        });
    });

    socket.on('disconnect', () => {
        console.log(`${user_name} got disconnect!`);

        Array.prototype.remove = function () {
            let what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        usersOnline.remove(user_name);
        io.emit('USERS', usersOnline);

        saveNewMessage({
            author: 'ConnectionBot',
            content: `${user_name} s'est déconnecté !`,
            date: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            hour: new Date().getHours(),
            minute: new Date().getMinutes()
        });
    });
});
