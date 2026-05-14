package com.programmingtechie.inventoryservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "import_receipt_items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImportReceiptItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String skuCode;
    private String productName;
    private BigDecimal importPrice;
    private Integer quantity;
}

