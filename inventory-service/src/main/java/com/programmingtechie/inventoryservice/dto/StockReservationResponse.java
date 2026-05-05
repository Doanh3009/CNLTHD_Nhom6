package com.programmingtechie.inventoryservice.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockReservationResponse {
    private boolean reserved;
    private List<String> unavailableSkuCodes;
}
