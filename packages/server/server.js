const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport/lib');
const LocalStrategy = require('passport-local/lib').Strategy;
const axios = require('axios');
const bcrypt = require('bcrypt-nodejs');
const path = require('path');
const router = express.Router();
const http = require('http');

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) => {
        axios.get(`http://localhost:5000/users?email=${email}`)
            .then(res => {
                const user = res.data[0];
                if (!user) {
                    return done(null, false, {message: 'Invalid credentials.\n'});
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, {message: 'Invalid credentials.\n'});
                }
                return done(null, user);
            })
            .catch(error => done(error));
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    axios.get(`http://localhost:5000/users/${id}`)
        .then(res => done(null, res.data))
        .catch(error => done(error, false))
});

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    genid: (req) => {
        return uuid()
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

router.get('/', (req, res) => {
    //res.send(`You got home page!\n`);
    const data = "Hello";
    res.render(path.join(__dirname, './views/index.ejs'), {data: data});
});

router.get('/login', (req, res) => {
    //res.send(`You got the login page!\n`);
    res.render(path.join(__dirname, './views/login.ejs'));
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info) {
            return res.send(info.message)
        }
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/authrequired');
        })
    })(req, res, next);
});

router.get('/authrequired', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('you hit the authentication endpoint\n');
    } else {
        res.send('TEST');
        //res.redirect('/');
    }
});

app.use('/', router);


const io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('new', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new', pseudo);
    });
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

});

server.listen(3000, () => {
    console.log('Listening on localhost:3000')
});