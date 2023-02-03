package com.example.chatapp.controllers;

import com.example.chatapp.models.ChatMessage;
import com.example.chatapp.repositories.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping(path = "/api/messages")
public class MessagesController {
    private final MessageRepository messageRepository;
    public MessagesController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    @GetMapping()
    public List<ChatMessage> getChatMessages() {
        return messageRepository.findAll();
    }
}
