const session = require('express-session');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport/lib');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Authentication = (app, db) => {
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
};

module.exports = Authentication;
