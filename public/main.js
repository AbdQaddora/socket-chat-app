const socket = io();
const EVENTS = {
    SERVER_SEND_MESSAGE: 'SERVER_SEND_MESSAGE',
    USER_SEND_MESSAGE: 'USER_SEND_MESSAGE',
    USER_SEND_IMAGE: 'USER_SEND_IMAGE',
    SERVER_SEND_IMAGE: 'SERVER_SEND_IMAGE',
    NEW_USER: 'NEW_USER'
}

let user = window.location.search.split('=')[1];
let image = undefined;

socket.emit(EVENTS.NEW_USER, user.replaceAll('+', '_'));

const messageContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('msg-form');
const messageForm_input = document.getElementById('msg_input');

// RECIVING AN MESSAGE
socket.on(EVENTS.SERVER_SEND_MESSAGE, (payload) => {
    showNewMessageInDOM(payload);
})

const showNewMessageInDOM = (payload) => {
    const div = document.createElement('div');
    div.innerHTML = GenerateNewMessageBlock(payload.msg, payload.sender, payload.time);
    messageContainer.appendChild(div);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const GenerateNewMessageBlock = (msg, sender, time) => {
    return `
    <div class="message mb-3 bg-light p-2 ps-3 pe-3 rounded border d-flex flex-column">
    <span class="message-info text-success text-uppercase">
    ${sender} <span class="text-info text-uppercase">${time}</span>
    </span>
    <span class="message-data">${msg}</span>
    </div>
    `;
}

// SENDEING AN MESSAGE
messageForm && messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (image !== undefined) {
        const payload = {
            body: image,
            memtType: image.type,
            name: image.name
        }

        socket.emit(EVENTS.USER_SEND_IMAGE, payload);
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
// RECIVING AN UMAGE
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


const showImageMessageInDOM = (payload) => {
    const div = document.createElement('div');
    const imageIdInDom = `${Math.random() * Math.random()}`
    div.innerHTML = GenerateNewImageMessageBlock(payload.name, payload.sender, payload.time, imageIdInDom);
    messageContainer.appendChild(div);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    showBlobInImage(payload.blob, imageIdInDom);
}

const showBlobInImage = (blob, containerId) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const imageContainer = document.getElementById(containerId);
        imageContainer.src = reader.result;
    }
}
const GenerateNewImageMessageBlock = (imgName, sender, time, containerId) => {
    return `
    <div class="message mb-3 bg-light p-2 ps-3 pe-3 rounded border d-flex flex-column">
    <span class="message-info text-success text-uppercase mb-1">
    ${sender} <span class="text-info text-uppercase">${time}</span>
    </span>
    <span class="message-data img-msg">
           <img alt="${imgName}" class="rounded" id="${containerId}"/>
        </span>
    </div>
    `;
}




