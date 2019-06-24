const bcrypt = require('bcrypt');
const passport = require('passport/lib');
const LocalStrategy = require('passport-local').Strategy;
const { addUserOnline } = require('./usersOnlineRepository');

const {
    getState,
    setState,
    saveDB
} = require('./db');

function addUser({ name, email, password }) {
    const users = getState().users;
    let id;

    if (typeof users !== 'undefined' && users.length > 0) {
        let getLastId = users[users.length - 1].id;
        id = getLastId + 1;
    } else {
        id = 0;
    }
    let timestamp = Date.now();

    bcrypt.hash(password, 10, function (err, password) {
        users.push({ id, timestamp, name, email, password });
        setState({ users });
        saveDB();
    });
}

function getUserForLogin() {
    const users = getState().users;

    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
            users.forEach((user) => {
                if (email === user.email) {
                    if (!user) return done(null, false, { message: 'Invalid credentials.\n' });
                    if (!bcrypt.compareSync(password, user.password))
                        return done(null, false, { message: 'Invalid credentials.\n' });
                    return done(null, user);
                }
            });
        }
    ));
}

module.exports = {
    addUser,
    getUserForLogin
};
