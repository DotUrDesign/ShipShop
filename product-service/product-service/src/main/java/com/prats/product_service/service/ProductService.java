package com.prats.product_service.service;


import com.prats.product_service.dto.ProductRequest;
import com.prats.product_service.dto.ProductResponse;
import com.prats.product_service.model.Product;
import com.prats.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        System.out.println("Product - " + productRequest.name() + " , " + productRequest.price() + " , " + productRequest.description());

        Product product = new Product();
        product.setName(productRequest.name());
        product.setDescription(productRequest.description());
        product.setPrice(productRequest.price());
        productRepository.save(product);
        System.out.println("Product created successfully");
        return new ProductResponse(product.getId(), product.getName(), product.getDescription(), product.getPrice());
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(product ->
                        new ProductResponse(product.getId(),product.getName(),product.getDescription(),product.getPrice())
                ).toList();
    }
}
