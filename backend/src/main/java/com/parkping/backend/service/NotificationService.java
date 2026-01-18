package com.parkping.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final TwilioService twilioService;

    @Autowired
    public NotificationService(TwilioService twilioService) {
        this.twilioService = twilioService;
    }

    public void sendNotification(String phoneNumber, String message) {
        try {
            // Basic sanitization
            String targetPhone = phoneNumber;
            if (targetPhone != null && !targetPhone.startsWith("+") && targetPhone.length() == 10) {
                targetPhone = "+91" + targetPhone;
            } else if (targetPhone != null && targetPhone.startsWith("91") && targetPhone.length() == 12) {
                targetPhone = "+" + targetPhone;
            }

            System.out.println("DEBUG: Attempting to send SMS via Twilio to: " + targetPhone);

            twilioService.sendSms(targetPhone, message);

        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("SMS Service Error: " + e.getMessage());
        }
    }
}
