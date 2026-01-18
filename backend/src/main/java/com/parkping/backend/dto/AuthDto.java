package com.parkping.backend.dto;

import com.parkping.backend.model.Vehicle;
import lombok.Data;

public class AuthDto {
    @Data
    public static class LoginRequest {
        private String phoneNumber;
        private String otp;
    }

    @Data
    public static class SendOtpRequest {
        private String phoneNumber;
        @com.fasterxml.jackson.annotation.JsonProperty("isLogin")
        private boolean isLogin; // true = check if user exists, false = check if user DOES NOT exist
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String phoneNumber;
        private String otp;
        private String vehicleName; // Name for the first vehicle
        private Vehicle.VehicleType vehicleType;
    }
}
