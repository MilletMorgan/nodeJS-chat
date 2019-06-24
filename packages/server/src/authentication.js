const session = require('express-session');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport/lib');

const { addUserOnline } = require('./db/usersOnlineRepository');
const { addUser, getUserForLogin } = require("./db/usersRepository");

const Authentication = (app, db) => {
    getUserForLogin();

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        db.users.forEach((user) => {
            if (user.id === id) return done(null, user);
        });
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(session({
        genid: () => {
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
                addUserOnline(user.name, user.timestamp);
                return res.redirect('/api/authrequired');
            });
        })(req, res, next);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.post('/api/register', (req, res) => {
        const { name, email, password } = req.body;
        addUser({ name, email, password });
        res.json({ name, email });
    });

    app.get('/api/authrequired', (req, res) => res.send(req.user) ? req.isAuthenticated() : res.redirect('/'));
};

module.exports = Authentication;
