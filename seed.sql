INSERT INTO categories (name) VALUES
  ('Food & Dining'),
  ('Health & Wellness'),
  ('Home Services'),
  ('Education'),
  ('Retail')
ON CONFLICT (name) DO NOTHING;

INSERT INTO businesses
  (name, description, category_id, address, location, contact_number,
   whatsapp_number, website_url, image_url, is_featured)
SELECT v.name, v.description, c.id, v.address, v.location, v.contact_number,
       v.whatsapp_number, v.website_url, v.image_url, v.is_featured
FROM (VALUES
  ('Copper Kettle Cafe', 'Neighborhood cafe serving breakfast and fresh coffee.', 'Food & Dining', '12 Lake View Road', 'Chennai', '+91 90000 10001', '+91 90000 10001', 'https://copperkettle.example', NULL, TRUE),
  ('Mango Leaf Kitchen', 'Family restaurant offering seasonal South Indian meals.', 'Food & Dining', '45 Market Street', 'Coimbatore', '+91 90000 10002', '+91 90000 10002', NULL, NULL, FALSE),
  ('Harbor Bowl', 'Casual eatery specializing in rice bowls and fresh juices.', 'Food & Dining', '8 Marina Lane', 'Chennai', '+91 90000 10003', '+91 90000 10003', 'https://harborbowl.example', NULL, FALSE),
  ('Willow Wellness Studio', 'Small-group yoga and guided meditation classes.', 'Health & Wellness', '22 Garden Avenue', 'Madurai', '+91 90000 10004', '+91 90000 10004', 'https://willowwellness.example', NULL, TRUE),
  ('BrightPath Dental Care', 'General dentistry and preventive oral health services.', 'Health & Wellness', '19 Park Road', 'Coimbatore', '+91 90000 10005', '+91 90000 10005', NULL, NULL, FALSE),
  ('Blue Door Plumbing', 'Residential plumbing repairs and scheduled maintenance.', 'Home Services', '7 River Street', 'Salem', '+91 90000 10006', '+91 90000 10006', 'https://bluedoorplumbing.example', NULL, FALSE),
  ('NeatNest Electric', 'Licensed electricians for home installation and repairs.', 'Home Services', '31 Hill Road', 'Chennai', '+91 90000 10007', '+91 90000 10007', NULL, NULL, FALSE),
  ('Little Lantern Learning', 'After-school reading and creative learning programs.', 'Education', '5 School Lane', 'Madurai', '+91 90000 10008', '+91 90000 10008', 'https://littlelantern.example', NULL, TRUE),
  ('Paper & Pine Books', 'Independent bookshop with fiction, stationery, and local authors.', 'Retail', '16 Temple Street', 'Salem', '+91 90000 10009', '+91 90000 10009', 'https://paperandpine.example', NULL, FALSE),
  ('Everyday Clay', 'Handmade ceramics and useful pieces from local makers.', 'Retail', '28 Bazaar Road', 'Coimbatore', '+91 90000 10010', '+91 90000 10010', NULL, NULL, FALSE)
) AS v(name, description, category_name, address, location, contact_number,
       whatsapp_number, website_url, image_url, is_featured)
JOIN categories c ON c.name = v.category_name
WHERE NOT EXISTS (
  SELECT 1 FROM businesses existing WHERE existing.name = v.name
);
