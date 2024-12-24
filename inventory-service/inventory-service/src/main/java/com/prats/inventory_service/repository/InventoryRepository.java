package com.prats.inventory_service.repository;

import com.prats.inventory_service.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query(value = "select case when count(*) > 0 then 1 else 0 end from t_inventory where sku_code=:skuCode and quantity >= :quantity", nativeQuery = true)
    Integer findIfSkuCodeExistsAndQuantityIsGreaterThanOrEqualTo(String skuCode, Integer quantity);
}
