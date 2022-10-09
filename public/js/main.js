import { EVENTS } from './events.js';
import { showNewMessageInDOM, showImageMessageInDOM } from './addToDOM.js';

const socket = io();

// just for image sending
const sendImgSocket = io();

let user = window.location.search.split('=')[1];
let image = undefined;

socket.emit(EVENTS.NEW_USER, user.replaceAll('+', '_'));

const messageForm = document.getElementById('msg-form');
const messageForm_input = document.getElementById('msg_input');

// RECIVING AN MESSAGE
socket.on(EVENTS.SERVER_SEND_MESSAGE, (payload) => {
    showNewMessageInDOM(payload);
})

// SENDEING AN MESSAGE
messageForm && messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (image !== undefined) {
        const payload = {
            body: image,
            memtType: image.type,
            name: image.name,
            uid: socket.id
        }

        sendImgSocket.emit(EVENTS.USER_SEND_IMAGE, payload);
        image = undefined;
        messageForm_input.value = '';
    } else {
        const msg = messageForm_input.value;
        if (msg !== '') {
            socket.emit(EVENTS.USER_SEND_MESSAGE, msg);
            messageForm_input.value = '';
            messageForm_input.focus();
        }
    }
});

// RECIVING AN IMAGE
socket.on(EVENTS.SERVER_SEND_IMAGE, (payload) => {
    const blob = new Blob([payload.body], { type: payload.type });
    showImageMessageInDOM({ ...payload, blob });
})

// SEND IMAGE
const messageForm_Image_input = document.getElementById('image_input');
messageForm_Image_input && messageForm_Image_input.addEventListener('change', () => {
    image = messageForm_Image_input.files[0];
    messageForm_input.value = image.name;
});





