CREATE table product_table(
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    countInStock INTEGER NOT NULL default 0,
    details VARCHAR(255),
    category VARCHAR(255),
    rating DECIMAL(3,2)
);
