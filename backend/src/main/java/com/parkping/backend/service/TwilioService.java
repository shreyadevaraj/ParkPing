package com.parkping.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class TwilioService {

    @Value("${twilio.account_sid}")
    private String ACCOUNT_SID;

    @Value("${twilio.auth_token}")
    private String AUTH_TOKEN;

    @Value("${twilio.phone_number}")
    private String FROM_NUMBER;

    @PostConstruct
    public void init() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public void makeCall(String toPhoneNumber) {
        try {
            String message = "This is an automated call. Your vehicle is currently blocking another vehicle. Kindly move it at the earliest. Thank you.";
            String twiml = "<Response><Say>" + message + "</Say></Response>";
            String url = "http://twimlets.com/echo?Twiml=" + URLEncoder.encode(twiml, StandardCharsets.UTF_8);

            Call call = Call.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(FROM_NUMBER),
                    new java.net.URI(url))
                    .create();

            System.out.println("Call initiated: " + call.getSid());
        } catch (Exception e) {
            System.err.println("Error making call: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initiate call: " + e.getMessage());
        }
    }

    public void sendSms(String toPhoneNumber, String messageBody) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(FROM_NUMBER),
                    messageBody)
                    .create();

            System.out.println("SMS sent successfully: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send SMS: " + e.getMessage());
        }
    }
}
