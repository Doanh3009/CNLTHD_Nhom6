package com.programmingtechie.orderservice.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockReservationResponse {
    private boolean reserved;
    private List<String> unavailableSkuCodes;
}
