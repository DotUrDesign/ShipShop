package com.prats.order_service.service;

import com.prats.order_service.client.InventoryClient;
import com.prats.order_service.dto.OrderResponse;
import com.prats.order_service.dto.OrderRequest;
import com.prats.order_service.model.Order;
import com.prats.order_service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private InventoryClient inventoryClient;

    public void placeOrder(OrderRequest orderRequest) {
        boolean ifExists = inventoryClient.isInStock(orderRequest.skuCode(), orderRequest.quantity());
        System.out.println("does exists - " + ifExists);
        if(ifExists) {
            Order order = new Order();
            order.setOrderNumber(orderRequest.orderNumber());
            order.setSkuCode(orderRequest.skuCode());
            order.setPrice(orderRequest.price());
            order.setQuantity(orderRequest.quantity());

            orderRepository.save(order);
        } else {
            throw new RuntimeException("Product with skuCode " + orderRequest.skuCode() + " is not in stock");
        }
    }
}
