package com.solvr.backend.service;
 
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
 
@Service
public class EmailService {
 
    private final Resend resend;
 
    public EmailService(@Value("${resend.api-key}") String apiKey) {
        this.resend = new Resend(apiKey);
    }
 
    public void sendEmail(
            String to,
            String subject,
            String body) {
 
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev")
                    .to(to)
                    .subject(subject)
                    .html(body)
                    .build();
 
            CreateEmailResponse response = resend.emails().send(params);
 
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}