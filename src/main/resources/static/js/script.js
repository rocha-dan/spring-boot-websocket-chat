'use strict';

var welcomeForm = document.querySelector('#welcomeForm');
var dialogueForm = document.querySelector('#btnSendMessage');
welcomeForm.addEventListener('submit', connect, true)
dialogueForm.addEventListener('submit', sendMessage, true)

var stompClient = null;
var name = null;

function connect(event) {
	name = document.querySelector('#name').value.trim();

	if (name) {
		document.querySelector('#welcome-page').classList.add('hidden');
		document.querySelector('#dialogue-page').classList.remove('hidden');

		var socket = new SockJS('/stompWebsocket');
		stompClient = Stomp.over(socket);

		stompClient.connect({}, connectionSuccess);
	}
	event.preventDefault();
}

function connectionSuccess() {
	stompClient.subscribe('/topic/chat-messages', onMessageReceived);

	stompClient.send("/app/chat.createUser", {}, JSON.stringify({
		sender : name,
		type : 'newUser'
	}))
	
	sleep(1000);
	
	send(event, '#inputHomePageMessage');

}

$( "#btnSendMessage" ).click( function( event ) {
    event.preventDefault();
    sendMessage(event);
  } );

$( "#btnEnterAndSendMessage" ).click( function( event ) {
    event.preventDefault();
    connect(event);
  } );

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function sendMessage(event) {
	send(event, '#chatMessage');
}


function send(event, id) {
	var messageContent = document.querySelector(id).value.trim();

	if (messageContent && stompClient) {
		var chatMessage = {
			sender : name,
			content : document.querySelector(id).value,
			type : 'CHAT'
		};

		stompClient.send("/app/chat.sendMessage", {}, JSON
				.stringify(chatMessage));
		document.querySelector(id).value = '';
	}
	event.preventDefault();
}


function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);

	var messageElement = document.createElement('li');

	if (message.type === 'newUser') {
		messageElement.classList.add('event-data');
		message.content = message.sender + ' entrou do chat';
	} else if (message.type === 'Leave') {
		messageElement.classList.add('event-data');
		message.content = message.sender + ' saiu do chat';
	} else {
		messageElement.classList.add('message-data');

		var element = document.createElement('i');
		var text = document.createTextNode(message.sender[0]);
		
		element.appendChild(img_create('https://api.adorable.io/avatars/40/'+message.sender+'.png', message.sender,message.sender));

		messageElement.appendChild(element);

		var usernameElement = document.createElement('span');
		var usernameText = document.createTextNode(message.sender);
		usernameElement.appendChild(usernameText);
		messageElement.appendChild(usernameElement);
	}

	var textElement = document.createElement('p');
	var messageText = document.createTextNode(message.content);
	textElement.appendChild(messageText);

	messageElement.appendChild(textElement);

	document.querySelector('#messageList').appendChild(messageElement);
	document.querySelector('#messageList').scrollTop = document
			.querySelector('#messageList').scrollHeight;

}

function img_create(src, alt, title) {
    var img = document.createElement('img');
    img.src = src;
    if ( alt != null ) img.alt = alt;
    if ( title != null ) img.title = title;
    return img;
}
