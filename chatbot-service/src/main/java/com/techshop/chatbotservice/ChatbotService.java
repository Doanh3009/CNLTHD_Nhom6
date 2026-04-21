package com.techshop.chatbotservice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    private final WebClient webClient;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model.name}")
    private String modelName;

    public ChatbotService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String askQuestion(String question) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", "Ban la nhan vien ho tro cua TechShop. Hay tra loi ngan gon bang tieng Viet: " + question);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", List.of(message));

            Map response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, Object> resMessage = (Map<String, Object>) firstChoice.get("message");
                return resMessage.get("content").toString();
            }

            return "Khong the nhan phan hoi tu chatbot.";

        } catch (Exception e) {
            return "He thong chatbot dang bao tri. Vui long thu lai sau.";
        }
    }
}