package com.parkping.backend.repository;

import com.parkping.backend.model.Vehicle;
import com.parkping.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUser(User user);

    List<Vehicle> findAllByUserId(Long userId);

    Optional<Vehicle> findByQrToken(String qrToken);
}
