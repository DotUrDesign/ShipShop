package com.prats.inventory_service.service;


import com.prats.inventory_service.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public boolean isInStock(String skuCode, Integer quantity) {
        System.out.println("SkuCode - " + skuCode);
        System.out.println("quantity - " + quantity);
        Integer ifExists = inventoryRepository.findIfSkuCodeExistsAndQuantityIsGreaterThanOrEqualTo(skuCode, quantity);
        if(ifExists == 1)
            return true;
        return false;
    }
}
