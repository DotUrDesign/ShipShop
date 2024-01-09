create database shipshop_db;

create table customer_table(
    customer_id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email   VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    isLoggedIn BOOLEAN DEFAULT false
);

-- order_history INTEGER[] REFERENCES orders(order_id) default '{}'::integer[] NOT NULL,
--     cart integer[] REFERENCES shopping_cart(item_id) default '{}'::integer[] NOT NULL,

-- Add a UNIQUE constraint to the email column
ALTER TABLE customer_table
ADD CONSTRAINT unique_email_constraint UNIQUE (email);

