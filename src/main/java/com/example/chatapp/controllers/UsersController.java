package com.example.chatapp.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/users")
public class UsersController {
    private final Map<String, String> connectedUsers = ChatController.connectedUsers;

    @GetMapping("/connected-users")
    public List<String> connectedUsers() {
        return new ArrayList<>(connectedUsers.values());
    }

    @DeleteMapping(path = "/delete-user/{sessionId}")
    public void deleteUser(@PathVariable String sessionId) {
        connectedUsers.remove(sessionId);
    }
}
