package com.parkping.backend.controller;

import com.parkping.backend.dto.AuthDto;
import com.parkping.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody AuthDto.SendOtpRequest request) {
        try {
            authService.sendOtp(request.getPhoneNumber(), request.isLogin());
            return ResponseEntity.ok().body("OTP sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest request) {
        try {
            String token = authService.verifyLogin(request.getPhoneNumber(), request.getOtp());
            if (token != null) {
                return ResponseEntity.ok().body(java.util.Map.of("token", token));
            }
            return ResponseEntity.status(401).body("Invalid OTP");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest request) {
        try {
            String token = authService.register(
                    request.getName(),
                    request.getPhoneNumber(),
                    request.getOtp(),
                    request.getVehicleName(),
                    request.getVehicleType());
            if (token != null) {
                return ResponseEntity.ok().body(java.util.Map.of("token", token));
            }
            return ResponseEntity.status(401).body("Invalid OTP");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.ok().body("Logged out");
    }
}
