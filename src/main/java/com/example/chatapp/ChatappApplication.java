package com.example.chatapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class ChatappApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatappApplication.class, args);
	}

}
