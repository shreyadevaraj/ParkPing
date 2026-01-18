package com.parkping.backend.repository;

import com.parkping.backend.model.PingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface PingLogRepository extends JpaRepository<PingLog, Long> {
    int countByClientIpAndTimestampAfter(String clientIp, LocalDateTime timestamp);

    void deleteByVehicleId(Long vehicleId);

    java.util.List<PingLog> findByVehicleIdAndStatus(Long vehicleId, String status);

    java.util.Optional<PingLog> findTopByVehicleUserPhoneNumberOrderByTimestampDesc(String phoneNumber);
}
