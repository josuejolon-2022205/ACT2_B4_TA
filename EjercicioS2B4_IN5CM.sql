CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    cantidad INT NOT NULL
);

-- Insertar datos de prueba
INSERT INTO productos (nombre, precio, cantidad) VALUES 
('Café', 2.50, 100),
('Queso', 5.00, 50);