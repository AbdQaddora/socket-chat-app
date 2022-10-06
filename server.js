const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const moment = require('moment');
require('dotenv').config();

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
    // socket.on('disconnect', () => {
    //     io.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: 'user live the room', sender: 'server bot', time: `${moment().format('LT')}` });
    // })

    socket.on(EVENTS.USER_SEND_MESSAGE, (payload) => {
        io.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: payload.msg, sender: payload.sender, time: `${moment().format('LT')}` });
    })

    socket.on(EVENTS.NEW_USER, (newUser) => {
        socket.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: `Wellcome ${newUser} to our chat room 😍`, sender: 'server bot', time: `${moment().format('LT')}` });
        socket.broadcast.emit(EVENTS.SERVER_SEND_MESSAGE, { msg: `${newUser} has join the server`, sender: 'server bot', time: `${moment().format('LT')}` })
    })
})


