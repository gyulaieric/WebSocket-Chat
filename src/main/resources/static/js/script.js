/*!
* Start Bootstrap - Simple Sidebar v6.0.5 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

'use strict'

let stompClient;
let username;
let sessionId;
let socket;

const baseUrl = 'https://websocket-chat-wbb4.onrender.com/api/';

const connect = (event) => {
    username = document.querySelector('#username').value.trim();

    if (username) {
        const login = document.querySelector('#login');
        login.classList.add('d-none');

        const messageControls = document.querySelector('#message-controls');
        messageControls.classList.remove('d-none');

        socket = new SockJS('/chat-app')
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnected, onError)
    }
    event.preventDefault();
}

const onConnected = () => {
    sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];

    const url = baseUrl + 'messages';
    
    const request = new Request(url);

    fetch(request).then((response) => response.json()).then((data) => {
        data.forEach(message => {
            if (message.type != 'CONNECT' && message.type != 'DISCONNECT') {
                loadMessage(message);
            }
        });
    }).then(() => {
        stompClient.subscribe('/topic/public', onMessageRecieved);
        stompClient.send('/app/chat.newUser', {}, JSON.stringify({sender: username, type:'CONNECT'}));

        const status = document.querySelector('#status');
        status.className = 'd-none';

        const disconnectButton = document.querySelector('#disconnect');
        disconnectButton.classList.remove('d-none');
    });
}

const disconnect = (event) => {
    const url = baseUrl + 'users/delete-user/' + sessionId;

    const request = new Request(url, {method: 'DELETE'});

    fetch(request).then(() => {
        stompClient.send('/app/chat.send', {}, JSON.stringify({sender: username, type: 'DISCONNECT'}));
        stompClient.disconnect();
    });

    const disconnectButton = document.querySelector('#disconnect');
    disconnectButton.classList.add('d-none');

    const list = document.querySelector('#user-list');
    list.innerHTML = '<a class="list-group-item p-3 text-light">Please connect to see online user list.</a>';

    const chat = document.querySelector('#chat');
    chat.textContent = '';

    const messageControls = document.querySelector('#message-controls');
    messageControls.classList.add('d-none');  

    const login = document.querySelector('#login');
    login.classList.remove('d-none'); 
}

const onError = (error) => {
    const status = document.querySelector('#status');
    status.innerHTML = 'Could not connect'
    status.style.color = 'red';
}

const sendMessage = (event) => {
    const messageInput = document.querySelector('#message');
    const messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        }
        stompClient.send('/app/chat.send', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

const onMessageRecieved = (payload) => {
    const message = JSON.parse(payload.body);
    loadMessage(message);

    if (message.type === 'CONNECT' || message.type === 'DISCONNECT') {
        loadUserList();
    }
}

function loadMessage(message) {
    const chatCard = document.createElement('div');
    chatCard.className = 'card-body'

    const flexBox = document.createElement('div');
    flexBox.className = 'd-flex justify-content-start mb-4';
    chatCard.appendChild(flexBox);

    const messageElement = document.createElement('div');
    messageElement.className = 'msg_container_send';

    flexBox.appendChild(messageElement);

    if (message.type === 'CONNECT') {
        flexBox.classList.replace('justify-content-start', 'justify-content-center');
        messageElement.classList.add('event-message');
        message.content = `<b>${message.sender}</b> connected`;
    }

    else if (message.type === 'DISCONNECT') {
        flexBox.classList.replace('justify-content-start', 'justify-content-center');
        messageElement.classList.add('event-message');
        message.content = `<b>${message.sender}</b> disconnected`;
    }

    else {
        messageElement.classList.add('chat-message');
        message.content = `<b>${message.sender}</b>: ${message.content}`;
    }

    messageElement.innerHTML = message.content;

    const chat = document.querySelector('#chat');
    chat.appendChild(flexBox);
    
    flexBox.scrollIntoView();
}

function loadUserList() {
    const url = baseUrl + 'users/connected-users';

    const request = new Request(url);

    const list = document.querySelector('#user-list');
    list.innerHTML = '';

    fetch(request).then((response) => response.json()).then((data) => {
        data.forEach(user => {
            const a = document.createElement('a');
            a.className = 'list-group-item p-3 text-light';
            a.innerHTML = '<span class="logged-in">●</span> ' + user;
            list.appendChild(a);
        });
    });
}

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', connect, true);

const disconnectButton = document.querySelector('#disconnect');
disconnectButton.addEventListener('click', disconnect, true);

const messageControls = document.querySelector('#message-controls');
messageControls.addEventListener('submit', sendMessage, true);

const textarea = document.querySelector('#message')
textarea.addEventListener('keydown', (e) => {
    if(e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        document.querySelector('#send').click();
    }
});

window.addEventListener('beforeunload', function (event) {
    const url = baseUrl + 'users/delete-user/' + sessionId;

    const request = new Request(url, {method: 'DELETE'});

    fetch(request).then(() => {
        stompClient.send('/app/chat.send', {}, JSON.stringify({sender: username, type: 'DISCONNECT'}));
        stompClient.disconnect();
    });

    event.returnValue = null;
})

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});
