    package com.prats.order_service.dto;

    import com.fasterxml.jackson.annotation.JsonProperty;

    import java.math.BigDecimal;

    public record OrderRequest(Long id, @JsonProperty("order_number") String orderNumber, @JsonProperty("sku_code") String skuCode, BigDecimal price, Integer quantity) {
    }
