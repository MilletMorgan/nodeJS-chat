"use strict";

const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport/lib');
const axios = require('axios');
const fs = require('fs');

let db;
let dbUsers;

const router = express.Router();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    axios.get(`http://localhost:5000/users/${id}`)
        .then(res => done(null, res.data))
        .catch(error => done(error, false));
});

const app = express();

//const server = http.createServer(app);

//app.set('view engine', 'ejs');

app.use(express.json());

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

router.get('/', (req, res) => {
    //res.send(`You got home page!\n`);
    const data = "Hello";
    //res.render(path.join(__dirname, './views/index.ejs'), {data: data});
});

router.post('/user', (req, res) => {
    axios.post(`http://localhost:5000/users`, {
        'name': req.body.name,
        'email': req.body.email,
        'password': req.body.password
    })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    //console.log(req.body);
    //res.json(req.body);
});

router.get('/messages', (req, res) => {
    res.json(db.messages);
});

router.get('/users', (req, res) => {
    res.json(db.users);
});

router.get('/login', (req, res) => {
    console.log(req.body);
    //res.send(`You got the login page!\n`);
    //res.render(path.join(__dirname, './views/login.ejs'));
    axios.get(`http://localhost:5000/users?email=${email}`)
        .then(res => {
            const user = res.data[0];
            console.log(null, user);
            //return done(null, user);
        });
    //.catch(error => done(error));

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info) {
            return res.send(info.message);
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
            return res.redirect('/');
        });
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

router.post('/postdata', () => {
    db.push("/test1", "super test");
});


//********//
// SERVER //
//*******//
app.use('/api', router);

let port = process.env.PORT || 3000;

let server = app.listen(port, function () {
    db = fs.existsSync('./db.json') ? JSON.parse(fs.readFileSync('./db.json').toString()) : {messages: []};
    dbUsers = fs.existsSync('./dbUsers.json') ? JSON.parse(fs.readFileSync('./dbUsers.json').toString()) : {users: []};
    console.log('Server listening on port ' + port);
});

//*********************//
// APP tChat SOCKET.IO //
//*********************//
const io = require('socket.io')(server, {path: '/api/socket'});

io.on('connection', socket => {


    console.log(socket.id);

    socket.emit('MESSAGES', db.messages);

    socket.on('SEND_MESSAGE', ({author, content, hour, minute}) => {
        io.emit('MESSAGE', {author, content, hour, minute});
        db.messages.push({author, content, hour, minute});
        fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
    });

    socket.emit('USERS', db.users);

    socket.on('CONNECT', ({ author }) => {
        io.emit('USER', { author });

        //if ({ author } !== db.users.hasOwnProperty({author})) {
            db.users.push({ author });
            fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
        //}
    });

    socket.on('REGISTER', ({ name, email, password }) => {
        io.emit('USER', { name, email, password});
        db.users.push({ name, email, password });
        fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
    })
});


//*******************************************//
// AUTHENTIFICATION AVEC JWT, VUEX, SQLITEDB //
//*******************************************//
/*
const db = new DB("sqlitedb");
const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
    db.insert([
            req.body.name,
            req.body.email,
            bcrypt.hashSync(req.body.password, 8)
        ],
        function (err) {
            if (err) return res.status(500).send("There was a problem registering the user.");
            db.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send("There was a problem getting user");
                let token = jwt.sign({id: user.id}, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({auth: true, token: token, user: user});
            });
        });
});

router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({auth: false, token: null});
        let token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({auth: true, token: token, user: user});
    });
});

const checkToken = (req, res, next) => {

    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
};
router.get('/profile', checkToken, (req, res) => {
    jwt.verify(req.token, 'privatekey', (err, authorizedData) => {
        if (err) {
            console.log('ERROR: could not connect to the protected route');
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Successful log in',
                authorizedData
            });
            console.log('SUCCESS: Connected to protected route');
        }
    });
    /!*
    db.selectUserById(req.body.id, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

    })
     *!/
});
*/

//*********************//
// ANCIEN APP tChat SOCKET.IO //
//*********************//
/*
io.sockets.on('connection', socket => {
    socket.on('new', pseudo => {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new', pseudo);
    });
    socket.on('message', message => {
        message = ent.encode(message);
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
    });

});
 */

/**

 "use strict";

 const uuid = require('uuid/v4');
 const session = require('express-session');
 const FileStore = require('session-file-store')(session);
 const passport = require('passport/lib');
 const axios = require('axios');
 const path = require('path');
 const http = require('http');
 const express = require('express');
 const DB = require('../db/db');
 const config = require('./config');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const bodyParser = require('body-parser');
 const db = new DB("sqlitedb")
 const app = express();
 const router = express.Router();

 router.use(bodyParser.urlencoded({ extended: false }));
 router.use(bodyParser.json());

 const enableCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
};
 app.use(enableCrossDomain);

 router.post('/register', function (req, res) {
    db.insert([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8)
    ],
        function (err) {
            if (err) return res.status(500).send("There was a problem during registering the user.")
            db.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send("There was a problem getting user")
                let token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400
                });
                res.status(200).send({ auth: true, token: token, user: user});
            });
        });
});

 router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token, user: user });
    });
});

 app.use(router);

 let port = process.env.PORT || 3000;
 let server = app.listen(port, function () {
    console.log('Server listening on port ' + port)
});

 app.use('/', router);

 server.listen(3000, () => {
    console.log('Listening on localhost:3000')
});
 */
