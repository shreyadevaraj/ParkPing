package com.parkping.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Vehicle vehicle;

    private LocalDateTime timestamp;
    private String clientIp;

    private String status; // SENT, COMING, ESCALATED
    private LocalDateTime lastUpdated;

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = "SENT";
        }
        if (this.lastUpdated == null) {
            this.lastUpdated = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
