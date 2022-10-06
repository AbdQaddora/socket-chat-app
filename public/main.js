const socket = io();
const EVENTS = {
    SERVER_SEND_MESSAGE: 'SERVER_SEND_MESSAGE',
    USER_SEND_MESSAGE: 'USER_SEND_MESSAGE',
    NEW_USER: 'NEW_USER'
}

let user = window.location.search.split('=')[1];
socket.emit(EVENTS.NEW_USER, user);

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
    const msg = messageForm_input.value;
    const payload = { msg, sender: user, time: `${moment().format('LT')}` };
    showNewMessageInDOM(payload)
    socket.emit(EVENTS.USER_SEND_MESSAGE, payload);
    messageForm_input.value = '';
    messageForm_input.focus();
});

