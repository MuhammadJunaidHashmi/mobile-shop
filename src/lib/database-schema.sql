-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  storage VARCHAR(50),
  color VARCHAR(50),
  condition VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  tracking_number VARCHAR(100),
  cancellation_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, price, original_price, brand, model, storage, color, condition, images, specifications, stock_quantity, category) VALUES
('iPhone 15 Pro', 'Latest iPhone with titanium design and A17 Pro chip', 250000, 280000, 'Apple', 'iPhone 15 Pro', '256GB', 'Natural Titanium', 'new', ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'], '{"display": "6.1-inch Super Retina XDR", "camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto", "battery": "Up to 23 hours video playback", "processor": "A17 Pro chip"}', 10, 'smartphones'),
('Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen', 220000, 240000, 'Samsung', 'Galaxy S24 Ultra', '512GB', 'Titanium Black', 'new', ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'], '{"display": "6.8-inch Dynamic AMOLED 2X", "camera": "200MP Main, 50MP Periscope, 10MP Telephoto", "battery": "5000mAh", "processor": "Snapdragon 8 Gen 3"}', 8, 'smartphones'),
('OnePlus 12', 'Flagship killer with fast charging', 180000, 200000, 'OnePlus', 'OnePlus 12', '256GB', 'Silky Black', 'new', ARRAY['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500'], '{"display": "6.82-inch LTPO AMOLED", "camera": "50MP Main, 64MP Periscope, 48MP Ultra Wide", "battery": "5400mAh with 100W SuperVOOC", "processor": "Snapdragon 8 Gen 3"}', 12, 'smartphones'),
('iPhone 14', 'Reliable iPhone with A15 Bionic chip', 180000, 200000, 'Apple', 'iPhone 14', '128GB', 'Blue', 'new', ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'], '{"display": "6.1-inch Super Retina XDR", "camera": "12MP Main, 12MP Ultra Wide", "battery": "Up to 20 hours video playback", "processor": "A15 Bionic chip"}', 15, 'smartphones'),
('Google Pixel 8 Pro', 'AI-powered smartphone with excellent camera', 160000, 180000, 'Google', 'Pixel 8 Pro', '256GB', 'Obsidian', 'new', ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'], '{"display": "6.7-inch LTPO OLED", "camera": "50MP Main, 48MP Ultra Wide, 48MP Telephoto", "battery": "5050mAh", "processor": "Google Tensor G3"}', 6, 'smartphones');
