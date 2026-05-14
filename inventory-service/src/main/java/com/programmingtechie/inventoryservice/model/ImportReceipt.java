package com.programmingtechie.inventoryservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "import_receipts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImportReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String receiptNumber;
    private LocalDateTime importDate;
    private LocalDateTime completedAt;
    private String status;
    private String note;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "receipt_id")
    private List<ImportReceiptItem> items;
}

