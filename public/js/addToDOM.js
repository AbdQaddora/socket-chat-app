const messageContainer = document.getElementById('messages-container');
// Text msg
export const showNewMessageInDOM = (payload) => {
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

// image msg
export const showImageMessageInDOM = (payload) => {
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
           <img alt="${imgName}" class="rounded" id="${containerId}" onclick="showImageInModal(this.src)"/>
        </span>
    </div>
    `;
}

