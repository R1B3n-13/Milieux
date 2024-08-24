CREATE TABLE IF NOT EXISTS product (
    id INT NOT NULL,
    prod_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    descr TEXT,
    img_url VARCHAR(255),   -- Changed from imgUrl to img_url
    store_id INTEGER NOT NULL,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ui_type INT NOT NULL,
    ui_font VARCHAR(100),
    ui_font_special VARCHAR(100),
    ui_accent_color VARCHAR(7), -- This assumes storing color as HEX
    ui_base_color VARCHAR(7), -- This assumes storing color as HEX
    ui_secondary_color VARCHAR(7), -- This assumes storing color as HEX
    banner TEXT,
    banner_subtext TEXT,
    logo_url VARCHAR(255),
    ui_images TEXT[], -- Storing list of images as an array of text
    top_items INTEGER[] -- Storing list of top items as an array of integers
);

CREATE TABLE IF NOT EXISTS review (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating NUMERIC(3, 1) NOT NULL CHECK (rating >= 0 AND rating <= 10), -- Assuming rating is a decimal value between 0 and 10
    review TEXT
);

-- CREATE TABLE IF NOT EXISTS store (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     address VARCHAR(255) NOT NULL,
--     phone VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     logo VARCHAR(255),
--     owner_id INT NOT NULL,
--     ui_type INT NOT NULL,
--     ui_base_color TEXT[]
-- );

-- CREATE TABLE IF NOT EXISTS reviews (
--     id SERIAL PRIMARY KEY,
--     product_id INT NOT NULL,
--     user_id INT NOT NULL,
--     rating INT NOT NULL,
--     review TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (product_id) REFERENCES product(id),
--     -- Assuming you have a user table, replace this with the actual reference
--     FOREIGN KEY (user_id) REFERENCES user(id)
-- );

-- CREATE TABLE IF NOT EXISTS orders (
--     id SERIAL PRIMARY KEY,
--     user_id INT NOT NULL,
--     product_id INT NOT NULL,
--     quantity INT NOT NULL,
--     total DECIMAL(10, 2) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES user(id),
--     FOREIGN KEY (product_id) REFERENCES product(id)
-- );
