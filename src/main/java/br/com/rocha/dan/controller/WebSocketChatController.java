package br.com.rocha.dan.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import br.com.rocha.dan.domain.WebSocketChatMessage;

@Controller
public class WebSocketChatController {

	@MessageMapping("/chat.sendMessage")
	@SendTo("/topic/chat-messages")
	public WebSocketChatMessage sendMessage(@Payload WebSocketChatMessage webSocketChatMessage) {
		return webSocketChatMessage;
	}

	@MessageMapping("/chat.createUser")
	@SendTo("/topic/chat-messages")
	public WebSocketChatMessage addUser(@Payload WebSocketChatMessage webSocketChatMessage,
			SimpMessageHeaderAccessor headerAccessor) {
		headerAccessor.getSessionAttributes().put("username", webSocketChatMessage.getSender());
		return webSocketChatMessage;
	}

}
