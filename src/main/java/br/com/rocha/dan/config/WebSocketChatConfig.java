package br.com.rocha.dan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketChatConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/stompWebsocket").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.setApplicationDestinationPrefixes("/app");
		registry.enableStompBrokerRelay("/topic")
			.setRelayHost("owl.rmq.cloudamqp.com")
		.setRelayPort(61613)
		.setClientLogin("hmsedciv")
		.setClientPasscode("ThEi8Jme6oQNOU344QovZjVQb830ix-5");

	}
}
