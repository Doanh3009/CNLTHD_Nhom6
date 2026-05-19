package com.techshop.chatbotservice;

import com.techshop.chatbotservice.dto.ChatRequest;
import com.techshop.chatbotservice.dto.ChatResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotControllerTests {

    @Mock
    private ChatbotService chatbotService;

    private ChatbotController chatbotController;

    @BeforeEach
    void setUp() {
        chatbotController = new ChatbotController(chatbotService);
    }

    @Test
    void askDelegatesToChatbotService() {
        ChatRequest request = new ChatRequest();
        request.setMessage("Laptop for study");
        when(chatbotService.askQuestion("Laptop for study")).thenReturn(new ChatResponse("Try Dell XPS", List.of()));

        ChatResponse response = chatbotController.ask(request);

        assertEquals("Try Dell XPS", response.getReply());
        assertEquals(List.of(), response.getRecommendations());
    }
}
