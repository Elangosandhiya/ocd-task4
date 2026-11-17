CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS businesses (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category_id BIGINT NOT NULL REFERENCES categories(id),
  address VARCHAR(300) NOT NULL,
  location VARCHAR(100) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  website_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS businesses_name_idx ON businesses (name);
CREATE INDEX IF NOT EXISTS businesses_category_id_idx ON businesses (category_id);
CREATE INDEX IF NOT EXISTS businesses_location_idx ON businesses (location);
CREATE INDEX IF NOT EXISTS businesses_is_featured_idx ON businesses (is_featured);
