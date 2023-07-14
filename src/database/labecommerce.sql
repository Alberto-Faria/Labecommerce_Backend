-- Active: 1689364229435@@127.0.0.1@3306


CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL
);
INSERT INTO users (id, name, email, password)
VALUES ("u001", "Alberto", "alberto@gmail.com","123456"),
        ("u002", "Clebia", "clebia@gmail.com","112233"),
        ("u003", "Nathalia", "nathalia@gmail.com","356423"),
        ("u004", "Nicole", "nicole@gmail.com","123456");

SELECT * FROM users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL
);  

INSERT INTO products (id, name, price, description, category, image_url)
VALUES (
        "p001", 
        "Mouse Sem Fio", 
        24,
        "Mouse Sem Fio 2.4 Ghz 1200 DPI Usb, Preto, normal", 
        "Informática",
        "https://m.media-amazon.com/images/I/81+qAtwLvZL._AC_SX679_.jpg"
    ), (
        "p002", 
        "Headphone Fone de Ouvido", 
        188, 
        "Fone de Ouvido Havit HV-H2002d, Gamer, com Microfone",
        "Informática",
        "https://m.media-amazon.com/images/I/71sV-QnV8TL._AC_SX679_.jpg"
    ), (
        "p003", 
        "Notebook Gamer ", 
        4784, 
        "Notebook Gamer Nitro 5, CI5 11400H, 8GB, 1TB SDD",
        "Informática",
        "https://m.media-amazon.com/images/I/71LhzBuoJRS._AC_SX679_.jpg"
    ), (
        "p004", 
        "KIT TECLADO MOUSE GAMER", 
        71,
        "Exbom KIT TECLADO MOUSE GAMER COMPUTADOR USB ABNT2 LED PRETO",
        "Informática",
        "https://m.media-amazon.com/images/I/41YrIUsnwJL._AC_.jpg"
    ), (
        "p005", 
        "HD Externo Toshiba", 
        645, 
        "HD Externo Toshiba 4TB Canvio Basics Preto",
        "Informática",
        "https://m.media-amazon.com/images/I/71GQPPIN9xL._AC_SX679_.jpg"
    ), (
        "p006", 
        "HD SSD Kingston", 
        154, 
        "HD SSD Kingston SA400S37 480GB",
        "Informática",
        "https://m.media-amazon.com/images/I/81Yleainj1L._AC_SX679_.jpg"
    );

-- Get All Users
SELECT * FROM users;

-- Get All Products
SELECT * FROM products;


--Search product by name
SELECT * FROM  products WHERE name LIKE "%Notebook Gamer%";

-- Create User
INSERT INTO users(id, name, email, password)
VALUES ("u005", "Caio", "caio@gmail.com", "123456");

-- Create Product
INSERT INTO products(id, name, price, description, category, image_url)
VALUES ("p007", "Mouse Pad", 30, "Mouse Pad Professional Gaming, Havit, HV-MP830, 30x90 cm", "Informática", "https://m.media-amazon.com/images/I/51sIK8S+2-L._AC_.jpg");    

-- Get Products by IDENTIFIED
SELECT * FROM products
WHERE id = "p001";

-- Delete User by id
DELETE FROM users
WHERE id = "u001";

-- Delete Product by id
DELETE FROM products
WHERE id = "p006";

-- Edit User by id
UPDATE users
SET password = "0606068"
WHERE id = "u001";

-- Edit Product by id
UPDATE products
SET price = 50
WHERE id = "p001";

-- Get All Users(refatorado)
SELECT * FROM users ORDER BY email ASC;

-- Get All Products(refatorado)
SELECT * FROM products ORDER BY price ASC
LIMIT 20 OFFSET 1;

-- Get All Products(refatorado)
SELECT * FROM products 
WHERE price >= 100 AND price <= 300
ORDER BY price ASC;

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    paid INTEGER NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

SELECT * FROM purchases;

INSERT INTO purchases(id, buyer, total_price, paid)
VALUES ("c001", "u001", 24, 0),
        ("c002", "u001", 188, 0),
        ("c003", "u002", 4784, 0),
        ("c004", "u002", 71, 0),
        ("c005", "u003", 645, 0),
        ("c006", "u003", 154, 0),
        ("c007", "u004", 30, 0);

--Atualizar purchases com pagamento = 1 e data atualizada da entrega
UPDATE purchases
SET paid = 1, created_at = DATETIME('now')
WHERE id = "c003";

--Query de consulta com JOIN das tabelas (users e purchases)
SELECT 
users.id AS idUsers,
purchases.id,
purchases.total_price,
purchases.created_at,
purchases.paid
FROM purchases
JOIN users ON purchases.buyer = users.id
WHERE users.id = "u003";    

-- Tabela de relação
CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL, 
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    );

SELECT * FROM purchases_products;

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES ("c001","p001", 2),
        ("c002","p001", 4),
        ("c003", "p002", 3);

--Consulta com INNER JOIN de 3 tabelas
SELECT
purchases.id,
purchases.buyer,
purchases.total_price,
purchases.created_at,
purchases.paid,
purchases_products.product_id AS productId,
purchases_products.quantity,
products.name,
products.price,
products.description,
products.category
FROM purchases
LEFT JOIN purchases_products 
ON purchases_products.purchase_id = purchases.id
INNER JOIN products 
ON purchases_products.product_id = products.id;


