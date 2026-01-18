package com.parkping.backend.controller;

import com.parkping.backend.service.PingService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/twilio")
@RequiredArgsConstructor
public class TwilioController {

    private final PingService pingService;

    @PostMapping(value = "/reply", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE })
    public void handleReply(@RequestParam("From") String from, @RequestParam("Body") String body) {
        System.out.println("Twilio Reply from: " + from + " Body: " + body);
        pingService.handleReply(from, body);
    }
}
