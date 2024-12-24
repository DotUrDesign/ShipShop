package com.prats.order_service;

import static org.hamcrest.MatcherAssert.assertThat;

import com.prats.order_service.stub.InventoryStubs;
import org.junit.jupiter.api.BeforeEach;
import org.hamcrest.Matchers;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.MySQLContainer;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;


@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWireMock(port = 0)
class OrderServiceApplicationTests {

	/*
	-- Creates an instance of a Dockerized MySQL database for testing. The container is configured to use the "mysql:8.3.0" image.

	-- @ServiceConnection - Tells springboot that this MySQLContainer should be used to provide the database connection properties for the application during tests.
	 */
	@ServiceConnection
	static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.3.0");

	/*
	@LocalServerPort
	-- Injects a random port assigned to the application
	-- This allows you RestAssured to point to the correct port.
	 */
	@LocalServerPort
	private Integer port;

	@BeforeEach
	void setup() {
		RestAssured.baseURI = "http://localhost/";
		RestAssured.port = port;
	}

	static {
		mySQLContainer.start();
	}

	@Test
	void shouldSubmitOrder() {
		String requestBody = """
    			   "order_number" : "HHH",
				   "sku_code" : "HHH",
				   "price" : 3000,
				   "quantity" : 1
				""";

		InventoryStubs.stubInventoryCall("iphone_15", 1);

		var responseBodyString = RestAssured.given()
				.contentType("application/json")
				.body(requestBody)
				.when()
				.post("/api/order")
				.then()
				.log().all()
				.statusCode(201)
				.extract()
				.body().asString();

		assertThat(responseBodyString, Matchers.is("Order placed successfully!"));
	}

}
