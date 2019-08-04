package br.com.rocha.dan.config;

import static org.springframework.util.StringUtils.isEmpty;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import br.com.rocha.dan.domain.WebSocketChatMessage;

@Component
public class WebSocketChatEventListener {

    @Autowired
    private SimpMessageSendingOperations simpMessageSendingOperations;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(!isEmpty(username)) {

            WebSocketChatMessage chatMessage = new WebSocketChatMessage();
            chatMessage.setType("Leave");
            chatMessage.setSender(username);

            simpMessageSendingOperations.convertAndSend("/topic/chat-messages", chatMessage);
        }
    }
}
