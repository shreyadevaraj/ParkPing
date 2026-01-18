package com.parkping.backend.service;

import com.parkping.backend.model.PingLog;
import com.parkping.backend.model.Vehicle;
import com.parkping.backend.repository.PingLogRepository;
import com.parkping.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PingService {

    private final VehicleRepository vehicleRepository;
    private final PingLogRepository pingLogRepository;
    private final NotificationService notificationService;
    private final TwilioService twilioService;

    // Retrieve public vehicle info (safe to expose)
    public Vehicle getVehicleByToken(String token) {
        return vehicleRepository.findByQrToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid QR Token"));
    }

    public Long triggerPing(String token, String clientIp) {
        Vehicle vehicle = getVehicleByToken(token);

        if (vehicle.getStatus() == Vehicle.Status.DND) {
            throw new RuntimeException("Owner has enabled Do Not Disturb.");
        }

        // Rate Limiting: Max 3 pings per 10 minutes from same IP
        int recentPings = pingLogRepository.countByClientIpAndTimestampAfter(clientIp,
                LocalDateTime.now().minusMinutes(10));
        if (recentPings >= 3) {
            throw new RuntimeException("Rate limit exceeded. Please try again later.");
        }

        // Log the ping
        PingLog log = new PingLog();
        log.setVehicle(vehicle);
        log.setTimestamp(LocalDateTime.now());
        log.setClientIp(clientIp);
        log.setStatus("SENT");
        log = pingLogRepository.save(log);

        // Send notification
        notificationService.sendNotification(vehicle.getUser().getPhoneNumber(),
                "Kindly move your vehicle at the earliest, as it is blocking my vehicle and I am unable to proceed. Your cooperation is appreciated. ("
                        + vehicle.getName() + ")");

        return log.getId();
    }

    public Long triggerCall(String token, String clientIp) {
        Vehicle vehicle = getVehicleByToken(token);

        if (vehicle.getStatus() == Vehicle.Status.DND) {
            throw new RuntimeException("Owner has enabled Do Not Disturb.");
        }

        // Reuse rate limiting logic
        int recentPings = pingLogRepository.countByClientIpAndTimestampAfter(clientIp,
                LocalDateTime.now().minusMinutes(10));
        if (recentPings >= 3) {
            throw new RuntimeException("Rate limit exceeded. Please try again later.");
        }

        // Log the call as a ping for now
        PingLog log = new PingLog();
        log.setVehicle(vehicle);
        log.setTimestamp(LocalDateTime.now());
        log.setClientIp(clientIp);
        log.setStatus("SENT");
        log = pingLogRepository.save(log);

        // Initiate Call
        twilioService.makeCall(vehicle.getUser().getPhoneNumber());

        return log.getId();
    }

    public void handleReply(String fromNumber, String body) {
        // Find the latest ping associated with a vehicle owned by this number
        pingLogRepository.findTopByVehicleUserPhoneNumberOrderByTimestampDesc(fromNumber)
                .ifPresent(log -> {
                    log.setStatus("COMING");
                    pingLogRepository.save(log);
                });
    }

    public void escalatePing(Long logId) {
        pingLogRepository.findById(logId).ifPresent(log -> {
            log.setStatus("ESCALATED");
            pingLogRepository.save(log);
            // In a real app, send email/SMS to management here
            System.out.println("Management Notified for vehicle: " + log.getVehicle().getName());
        });
    }

    public String getPingStatus(Long logId) {
        return pingLogRepository.findById(logId)
                .map(PingLog::getStatus)
                .orElse("UNKNOWN");
    }
}
