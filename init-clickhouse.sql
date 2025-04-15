-- Create test tables
CREATE TABLE IF NOT EXISTS default.users (
    id UInt32,
    username String,
    email String,
    created_at DateTime
) ENGINE = MergeTree()
ORDER BY id;

CREATE TABLE IF NOT EXISTS default.orders (
    id UInt32,
    user_id UInt32,
    product_name String,
    amount Decimal(10, 2),
    order_date DateTime
) ENGINE = MergeTree()
ORDER BY id;

-- Insert sample data
INSERT INTO default.users (id, username, email, created_at)
VALUES
    (1, 'john_doe', 'john@example.com', '2023-01-01 10:00:00'),
    (2, 'jane_smith', 'jane@example.com', '2023-01-02 11:30:00'),
    (3, 'bob_wilson', 'bob@example.com', '2023-01-03 09:15:00'),
    (4, 'alice_johnson', 'alice@example.com', '2023-01-04 14:45:00'),
    (5, 'charlie_brown', 'charlie@example.com', '2023-01-05 16:20:00');

INSERT INTO default.orders (id, user_id, product_name, amount, order_date)
VALUES
    (1, 1, 'Laptop', 999.99, '2023-01-10 08:30:00'),
    (2, 1, 'Mouse', 29.99, '2023-01-10 08:35:00'),
    (3, 2, 'Keyboard', 79.99, '2023-01-11 10:15:00'),
    (4, 3, 'Monitor', 299.99, '2023-01-12 11:45:00'),
    (5, 4, 'Headphones', 89.99, '2023-01-13 13:20:00'),
    (6, 5, 'Tablet', 449.99, '2023-01-14 15:10:00'),
    (7, 5, 'Case', 19.99, '2023-01-14 15:15:00');