package com.parkping.backend.controller;

import com.parkping.backend.model.Vehicle;
import com.parkping.backend.service.PingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ping")
@RequiredArgsConstructor
public class PingController {

    private final PingService pingService;

    @GetMapping("/{token}")
    public ResponseEntity<?> getVehicleInfo(@PathVariable String token) {
        try {
            Vehicle vehicle = pingService.getVehicleByToken(token);
            // Return only safe info
            return ResponseEntity.ok(Map.of(
                    "name", vehicle.getName(),
                    "status", vehicle.getStatus()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/{token}")
    public ResponseEntity<?> sendPing(@PathVariable String token, HttpServletRequest request) {
        try {
            String clientIp = request.getRemoteAddr();
            Long logId = pingService.triggerPing(token, clientIp);
            return ResponseEntity.ok(Map.of("message", "Notification sent", "logId", logId));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Rate limit")) {
                return ResponseEntity.status(429).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/call/{token}")
    public ResponseEntity<?> sendCall(@PathVariable String token, HttpServletRequest request) {
        try {
            String clientIp = request.getRemoteAddr();
            Long logId = pingService.triggerCall(token, clientIp);
            return ResponseEntity.ok(Map.of("message", "Call initiated", "logId", logId));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Rate limit")) {
                return ResponseEntity.status(429).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{logId}")
    public ResponseEntity<?> getStatus(@PathVariable Long logId) {
        return ResponseEntity.ok(Map.of("status", pingService.getPingStatus(logId)));
    }

    @PostMapping("/escalate/{logId}")
    public ResponseEntity<?> escalate(@PathVariable Long logId) {
        pingService.escalatePing(logId);
        return ResponseEntity.ok("Escalated");
    }
}
