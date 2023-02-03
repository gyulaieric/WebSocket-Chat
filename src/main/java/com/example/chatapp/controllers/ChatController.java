package com.example.chatapp.controllers;

import com.example.chatapp.models.ChatMessage;
import com.example.chatapp.repositories.MessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Controller
public class ChatController {
    public static Map<String, String> connectedUsers = new ConcurrentHashMap<>();
    private final MessageRepository messageRepository;

    public ChatController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        messageRepository.save(chatMessage);
        return chatMessage;
    }

    @MessageMapping("chat.newUser")
    @SendTo("/topic/public")
    public ChatMessage newUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String username = chatMessage.getSender();
        connectedUsers.put(sessionId, username);
        headerAccessor.getSessionAttributes().put("username", username);
        messageRepository.save(chatMessage);
        return chatMessage;
    }
}
