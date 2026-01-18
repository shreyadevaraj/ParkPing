package com.parkping.backend.controller;

import com.parkping.backend.model.User;
import com.parkping.backend.model.Vehicle;
import com.parkping.backend.service.VehicleService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@AuthenticationPrincipal User user, @RequestBody RequestDto request) {
        return ResponseEntity.ok(vehicleService.addVehicle(user, request.getName(), request.getType()));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getUserVehicles(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(vehicleService.getUserVehicles(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@AuthenticationPrincipal User user, @PathVariable Long id) {
        vehicleService.deleteVehicle(user, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Vehicle> toggleStatus(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.toggleStatus(user, id));
    }

    @Data
    static class RequestDto {
        private String name;
        private Vehicle.VehicleType type;
    }
}
