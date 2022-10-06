const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const moment = require('moment');
require('dotenv').config();

const { addNewUser, getCurrentUser, removeUser } = require('./users');

const PORT = process.env.PORT || 8000;
const EVENTS = {
    SERVER_SEND_MESSAGE: 'SERVER_SEND_MESSAGE',
    USER_SEND_MESSAGE: 'USER_SEND_MESSAGE',
    NEW_USER: 'NEW_USER'
}

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server is listen on port ${PORT}`);
})

const io = socketio(server);

io.on('connection', (socket) => {
    const uid = socket.id;
    socket.on(EVENTS.NEW_USER, (newUser) => {
        const user = addNewUser(uid, newUser);
        socket.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: `Wellcome ${user.userName} to our chat room 😍`, sender: 'server bot', time: `${moment().format('LT')}` });
        socket.broadcast.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: `${user.userName}  has joined the chat`, sender: 'server bot', time: `${moment().format('LT')}` })
    })

    socket.on(EVENTS.USER_SEND_MESSAGE, (msg) => {
        const user = getCurrentUser(uid);
        console.log(user);
        io.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: msg, sender: user.userName, time: `${moment().format('LT')}` });
    })

    socket.on('disconnect', () => {
        const user = removeUser(uid);
        io.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: `${user.userName} left the room`, sender: 'server bot', time: `${moment().format('LT')}` });
    })
})


