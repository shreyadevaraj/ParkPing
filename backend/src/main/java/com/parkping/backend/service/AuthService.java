package com.parkping.backend.service;

import com.parkping.backend.model.User;
import com.parkping.backend.model.Vehicle;
import com.parkping.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VehicleService vehicleService; // Inject to create initial vehicle
    private final NotificationService notificationService;

    private final com.parkping.backend.security.JwtUtils jwtUtils;
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public void sendOtp(String phoneNumber, boolean isLogin) {
        String formattedPhone = formatPhoneNumber(phoneNumber);
        Optional<User> user = userRepository.findByPhoneNumber(formattedPhone);
        if (isLogin && user.isEmpty()) {
            throw new RuntimeException("Account does not exist. Please sign up.");
        }
        if (!isLogin && user.isPresent()) {
            throw new RuntimeException("Account already exists. Please login.");
        }

        // Generate 4-digit random OTP
        String otp = String.format("%04d", random.nextInt(10000));
        otpStorage.put(formattedPhone, otp);

        // Send OTP via NotificationService
        String message = "Your OTP is: " + otp;
        notificationService.sendNotification(formattedPhone, message);

        System.out.println("OTP sent to " + formattedPhone + ": " + otp);
    }

    public String verifyLogin(String phoneNumber, String otp) {
        String formattedPhone = formatPhoneNumber(phoneNumber);
        String storedOtp = otpStorage.get(formattedPhone);

        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(formattedPhone); // Clear OTP after use
            User user = userRepository.findByPhoneNumber(formattedPhone)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return jwtUtils.generateToken(user.getPhoneNumber());
        }
        return null;
    }

    @Transactional
    public String register(String name, String phoneNumber, String otp, String vehicleName,
            Vehicle.VehicleType vehicleType) {
        String formattedPhone = formatPhoneNumber(phoneNumber);
        String storedOtp = otpStorage.get(formattedPhone);

        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(formattedPhone); // Clear OTP after use
            if (userRepository.findByPhoneNumber(formattedPhone).isPresent()) {
                throw new RuntimeException("User already exists");
            }

            User newUser = new User();
            newUser.setName(name);
            newUser.setPhoneNumber(formattedPhone);
            newUser = userRepository.save(newUser);

            // Create user's first vehicle if provided (Now optional)
            if (vehicleName != null && !vehicleName.trim().isEmpty()) {
                vehicleService.addVehicle(newUser, vehicleName, vehicleType);
            }

            return jwtUtils.generateToken(newUser.getPhoneNumber());
        }
        return null;
    }

    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null)
            return null;
        String trimmed = phoneNumber.trim();
        if (trimmed.startsWith("+91")) {
            return trimmed;
        } else if (trimmed.length() == 10) {
            return "+91" + trimmed;
        } else if (trimmed.startsWith("91") && trimmed.length() == 12) {
            return "+" + trimmed;
        }
        // Fallback for other cases or if already formatted differently, though we
        // prioritize Indian numbers as per request
        return trimmed;
    }
}
