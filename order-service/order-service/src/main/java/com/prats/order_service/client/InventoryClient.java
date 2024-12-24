package com.prats.order_service.client;

import feign.Request;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value="inventory", url="${inventory.url}")
public interface InventoryClient {

    @RequestMapping(method = RequestMethod.GET, value="/api/inventory")
    @CircuitBreaker(name="inventory", fallbackMethod = "fallbackMethod")
    @Retry(name = "inventory")
    boolean isInStock(@RequestParam String skuCode, @RequestParam Integer quantity);

    default boolean fallbackMethod(String code, Integer quantity, Throwable throwable) {
        System.out.println("Cannot get inventory for skucode {}, failure reason: {}" + code + throwable.getMessage());
        return false;
    }
}
