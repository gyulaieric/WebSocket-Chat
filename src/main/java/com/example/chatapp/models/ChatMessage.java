package com.example.chatapp.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("messages")
public class ChatMessage {
    @Id
    private String id;
    private MessageType type;
    private String content;
    private String sender;

    public ChatMessage() { }

    public ChatMessage(String id, MessageType type, String content, String sender) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.sender = sender;
    }

    public String getId() {
        return id;
    }

    public MessageType getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public String getSender() {
        return sender;
    }

}
