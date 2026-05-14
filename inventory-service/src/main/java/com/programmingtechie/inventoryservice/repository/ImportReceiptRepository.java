package com.programmingtechie.inventoryservice.repository;

import com.programmingtechie.inventoryservice.model.ImportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, Long> {
    List<ImportReceipt> findAllByOrderByImportDateDesc();
    Optional<ImportReceipt> findByReceiptNumber(String receiptNumber);
}

