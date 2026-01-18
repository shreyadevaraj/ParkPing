package com.parkping.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "My Car", "Honda Civic"

    @Enumerated(EnumType.STRING)
    private VehicleType type; // 2_WHEELER, 4_WHEELER, OTHER

    @Column(nullable = false, unique = true)
    private String qrToken;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum Status {
        ACTIVE,
        DND
    }

    public enum VehicleType {
        TWO_WHEELER,
        FOUR_WHEELER,
        OTHER
    }

    @PrePersist
    public void generateToken() {
        if (this.qrToken == null) {
            this.qrToken = UUID.randomUUID().toString();
        }
    }
}
