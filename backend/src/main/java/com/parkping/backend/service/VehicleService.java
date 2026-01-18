package com.parkping.backend.service;

import com.parkping.backend.model.User;
import com.parkping.backend.model.Vehicle;
import com.parkping.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final com.parkping.backend.repository.PingLogRepository pingLogRepository;

    public Vehicle addVehicle(User user, String name, Vehicle.VehicleType type) {
        Vehicle vehicle = new Vehicle();
        vehicle.setUser(user);
        vehicle.setName(name);
        vehicle.setType(type); // Set Type (can be null for legacy/simple adds if not forced)
        return vehicleRepository.save(vehicle);
    }

    // Legacy method overload for simple name-only add
    public Vehicle addVehicle(User user, String name) {
        return addVehicle(user, name, Vehicle.VehicleType.OTHER);
    }

    public List<Vehicle> getUserVehicles(User user) {
        return vehicleRepository.findAllByUserId(user.getId());
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteVehicle(User user, Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        if (!vehicle.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        pingLogRepository.deleteByVehicleId(vehicleId);
        vehicleRepository.delete(vehicle);
    }

    public Vehicle toggleStatus(User user, Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        if (!vehicle.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        vehicle.setStatus(vehicle.getStatus() == Vehicle.Status.ACTIVE ? Vehicle.Status.DND : Vehicle.Status.ACTIVE);
        return vehicleRepository.save(vehicle);
    }
}
