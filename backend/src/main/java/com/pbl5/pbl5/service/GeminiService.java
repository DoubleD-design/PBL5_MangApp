package com.pbl5.pbl5.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    
    private static final String API_KEY = "AIzaSyCgcgDiHN9qq1htdYq8_6yN2GShmHV3lcE";
    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public List<Integer> getMangaRecommendations(String userReadingHistory, String availableMangas) {
        try {
            String prompt = buildPrompt(userReadingHistory, availableMangas);
            String response = callGeminiAPI(prompt);
            return parseRecommendationResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Error getting manga recommendations from Gemini API", e);
        }
    }
    
    private String buildPrompt(String userReadingHistory, String availableMangas) {
        return String.format(
            "User has recently read these manga: %s\n\n" +
            "Here are available manga in the database: %s\n\n" +
            "Based on the user's reading history, recommend exactly 5 manga IDs from the available manga that they might like. " +
            "Return ONLY a JSON array of 5 integer IDs, nothing else. Example format: [1, 2, 3, 4, 5]",
            userReadingHistory,
            availableMangas
        );
    }
    
    private String callGeminiAPI(String prompt) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 100);
        requestBody.put("generationConfig", generationConfig);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        String url = API_URL + "?key=" + API_KEY;
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        
        if (response.getStatusCode() == HttpStatus.OK) {
            return extractTextFromResponse(response.getBody());
        } else {
            throw new RuntimeException("Gemini API call failed with status: " + response.getStatusCode());
        }
    }
    
    private String extractTextFromResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode candidates = root.get("candidates");
        if (candidates != null && candidates.isArray() && candidates.size() > 0) {
            JsonNode content = candidates.get(0).get("content");
            if (content != null) {
                JsonNode parts = content.get("parts");
                if (parts != null && parts.isArray() && parts.size() > 0) {
                    JsonNode text = parts.get(0).get("text");
                    if (text != null) {
                        return text.asText();
                    }
                }
            }
        }
        throw new RuntimeException("Unable to extract text from Gemini API response");
    }
    
    private List<Integer> parseRecommendationResponse(String response) throws Exception {
        // Clean the response to extract just the JSON array
        String cleanResponse = response.trim();
        if (cleanResponse.startsWith("```json")) {
            cleanResponse = cleanResponse.substring(7);
        }
        if (cleanResponse.endsWith("```")) {
            cleanResponse = cleanResponse.substring(0, cleanResponse.length() - 3);
        }
        cleanResponse = cleanResponse.trim();
        
        // Parse the JSON array
        JsonNode jsonArray = objectMapper.readTree(cleanResponse);
        if (jsonArray.isArray()) {
            List<Integer> recommendations = new java.util.ArrayList<>();
            for (JsonNode node : jsonArray) {
                if (node.isInt()) {
                    recommendations.add(node.asInt());
                }
            }
            return recommendations;
        } else {
            throw new RuntimeException("Invalid response format from Gemini API");
        }
    }
}