package com.solvr.backend.service;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
 
import java.util.HashMap;
import java.util.Map;
 
@Service
public class EmailService {
 
    private final RestTemplate restTemplate = new RestTemplate();
 
    @Value("${brevo.api-key}")
    private String brevoApiKey;
 
    @Value("${brevo.sender-email}")
    private String senderEmail;
 
    @Value("${brevo.sender-name:Solvr}")
    private String senderName;
 
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
 
    public void sendEmail(
            String to,
            String subject,
            String body) {
 
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("accept", "application/json");
 
            Map<String, Object> sender = new HashMap<>();
            sender.put("name", senderName);
            sender.put("email", senderEmail);
 
            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", to);
 
            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", sender);
            payload.put("to", new Object[]{recipient});
            payload.put("subject", subject);
            payload.put("htmlContent", body);
 
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
 
            restTemplate.postForEntity(BREVO_API_URL, request, String.class);
 
        } catch (Exception e) {
            System.out.println("BREVO EMAIL ERROR: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}