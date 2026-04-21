package com.techshop.chatbotservice;

import com.techshop.chatbotservice.dto.ChatRequest;
import com.techshop.chatbotservice.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/ask")
    public ChatResponse ask(@RequestBody ChatRequest request) {
        String reply = chatbotService.askQuestion(request.getMessage());
        return new ChatResponse(reply);
    }
}