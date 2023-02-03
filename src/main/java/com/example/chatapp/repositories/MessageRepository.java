package com.example.chatapp.repositories;

import com.example.chatapp.models.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<ChatMessage, Integer> {

}
