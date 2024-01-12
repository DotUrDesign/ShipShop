const socket = io();
let customerName;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
do {
    customerName = prompt("Please enter your name: ");
}   while(!customerName)

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

function appendMessage(msg, className) {
    let mDiv = document.createElement('div');
    mDiv.classList.add(className, 'message')
    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    
    mDiv.innerHTML = markup;
    messageArea.appendChild(mDiv);
}

function sendMessage(message) {
    let msg = {
        user : customerName,
        message : message.trim()
    };

    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    socket.emit('message', msg);
}

socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
})

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter')
        sendMessage(e.target.value);
});
