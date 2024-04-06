-- Create schema
CREATE SCHEMA grocery_booking_schema;

-- Create tables
CREATE TABLE grocery_booking_schema.user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role character varying(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('Admin', 'User')) -- Ensure role is either 'Admin' or 'User'
);

-- Add sample users
INSERT INTO
    grocery_booking_schema.user (username, password, role, created_at, updated_at)
VALUES
    (
        'admin@example.com',
        'admin_password',
        'Admin',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user@example.com',
        'user_password',
        'User',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

CREATE TABLE grocery_booking_schema.grocery_items (
    
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT price_positive CHECK (price >= 0),
    CONSTRAINT quantity_positive CHECK (quantity >= 0)
);

CREATE TABLE grocery_booking_schema."order" (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES grocery_booking_schema.user(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_total_amount CHECK (total_amount >= 0) -- Ensure total_amount is non-negative
);

CREATE INDEX idx_user_id ON grocery_booking_schema."order"(user_id);

CREATE TABLE grocery_booking_schema.order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    item_id INTEGER,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_total_price CHECK (total_price >= 0),
    FOREIGN KEY (order_id) REFERENCES grocery_booking_schema."order"(id),
    FOREIGN KEY (item_id) REFERENCES grocery_booking_schema.grocery_items(id)
);