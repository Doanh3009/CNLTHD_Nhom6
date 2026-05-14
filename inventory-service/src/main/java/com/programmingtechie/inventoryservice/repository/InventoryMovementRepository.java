package com.programmingtechie.inventoryservice.repository;

import com.programmingtechie.inventoryservice.model.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByOccurredAtBetweenOrderByOccurredAtDesc(LocalDateTime from, LocalDateTime to);
    List<InventoryMovement> findByOccurredAtAfter(LocalDateTime timestamp);
    boolean existsByReferenceNumberAndType(String referenceNumber, String type);
}

