-- PONTAL Carapitangui Menu Population
-- Based on the PDF catalog provided

-- Clear existing menu items and categories (if migrating)
DELETE FROM menu_items WHERE category_id IN (SELECT id FROM menu_categories);
DELETE FROM menu_categories;

-- Insert Categories
INSERT INTO menu_categories (name, display_order) VALUES
('Frios', 1),
('Petiscos', 2),
('Pratos Kids', 3),
('Sobremesas', 4),
('Drinks Autorais Pontal', 5),
('Drinks Clássicos', 6),
('Drinks Pontal Experiência', 7),
('Ice Drinks', 8),
('Bebidas sem Álcool', 9),
('Soft Drinks', 10),
('Cervejas', 11),
('Destilados', 12),
('Vinhos e Espumantes', 13)
ON CONFLICT DO NOTHING;

-- Get category IDs for insertion
WITH categories AS (
  SELECT id, name FROM menu_categories
)

-- Insert Menu Items
INSERT INTO menu_items (name, description, price, category_id, available, sort_order) 
SELECT 
  item_name,
  description,
  price,
  (SELECT id FROM categories WHERE name = category_name),
  true,
  sort_order
FROM (
  -- FRIOS
  VALUES
  ('Frios', 'Vinagrete de Polvo', 'Com torradas', 138, 1),
  ('Frios', 'Ceviche de Peixe Branco', 'Com torradas', 85, 2),
  
  -- PETISCOS
  ('Petiscos', 'Fritas Carapitangui', 'Batatas fritas com carne serenada desfiada e molho de alho negro', NULL, 1),
  ('Petiscos', 'Dadinho de Tapioca', 'Com geleia de pimenta biquinho', NULL, 2),
  ('Petiscos', 'Isca de Peixe', NULL, 89, 3),
  ('Petiscos', 'Lula à Dorê', NULL, 95, 4),
  ('Petiscos', 'Camarão Crocante', 'Empanado com tapioca', 169, 5),
  ('Petiscos', 'Bolinho de Bacalhau Português', '5 unidades', 69, 6),
  ('Petiscos', 'Casquinha de Siri', NULL, 49, 7),
  ('Petiscos', 'Carne de Sol Acebolada com Fritas', NULL, 79, 8),
  ('Petiscos', 'Filé Mignon Aperitivo com Fritas', NULL, 92, 9),
  ('Petiscos', 'Aipim Frito', NULL, 55, 10),
  ('Petiscos', 'Batata Frita', NULL, 45, 11),
  
  -- ESPECIAL 2 PESSOAS
  ('Petiscos', 'Camarão Carapitangui', 'Gratinado com catúpiry ao creme e champignon', 210, 12),
  ('Petiscos', 'Misto do Mar', 'Frutos do mar com arroz branco e legumes', 299, 13),
  ('Petiscos', 'Filé de Peixe Branco Grelhado', 'Arroz branco e legumes, molho de champignon e alcaparras servida a parte', 198, 14),
  ('Petiscos', 'Salmão Tropical', 'Arroz branco e legumes, molho de champignon e alcaparras servida a parte', 198, 15),
  ('Petiscos', 'Filé Mignon ao Gorgonzola', 'Servido com Arroz e Fritas', 189, 16),
  ('Petiscos', 'Frango à Parmegiana', 'Servido com Arroz e Fritas', 169, 17),
  
  -- PRATOS KIDS
  ('Pratos Kids', 'Filezinho de Peixe', 'Acompanha arroz, feijão e batata frita', 69, 1),
  ('Pratos Kids', 'Filezinho de Carne', 'Acompanha arroz, feijão e batata frita', 69, 2),
  
  -- SOBREMESAS
  ('Sobremesas', 'Cocada de Forno Artesanal', 'Com sorvete e calda tropical de maracujá', 35, 1),
  ('Sobremesas', 'Açaí', '3 bolas com granola', 35, 2),
  ('Sobremesas', 'Picolé', NULL, 15, 3),
  ('Sobremesas', 'Brigadeiro de Colher', NULL, 15, 4),
  
  -- DRINKS AUTORAIS PONTAL
  ('Drinks Autorais Pontal', 'Caipitão', 'rum, limão, gengibre, espuma de gengibre e água tônica', 45, 1),
  ('Drinks Autorais Pontal', 'Oxe Mate', 'rum, mate, limão, hortelã e água com gás', 45, 2),
  ('Drinks Autorais Pontal', 'Do Chef', 'saquê e uva roxa macerada', 45, 3),
  ('Drinks Autorais Pontal', 'Netuno Maré', 'netuno, vodka, caju e hortelã', 45, 4),
  ('Drinks Autorais Pontal', 'Lá Ele', 'blend de conhaques, abacaxi e gengibre', 45, 5),
  ('Drinks Autorais Pontal', 'Tadala Sour', 'whisky, limão, gengibre, hortelã, guaraná em pó e tadalafila', 45, 6),
  
  -- DRINKS CLÁSSICOS
  ('Drinks Clássicos', 'Caipirinha Especial Pontal', 'Cachaça especial', 39, 1),
  ('Drinks Clássicos', 'Caipivódka', 'Nacional', 39, 2),
  ('Drinks Clássicos', 'Caipivódka', 'Importada', 45, 3),
  ('Drinks Clássicos', 'Mojito', NULL, 40, 4),
  ('Drinks Clássicos', 'Margarita', NULL, 45, 5),
  ('Drinks Clássicos', 'Pina Colada', NULL, 45, 6),
  ('Drinks Clássicos', 'Sex on the Beach', NULL, 45, 7),
  ('Drinks Clássicos', 'Moscow Mule', NULL, 45, 8),
  ('Drinks Clássicos', 'Negroni', NULL, 45, 9),
  
  -- DRINKS PONTAL EXPERIÊNCIA
  ('Drinks Pontal Experiência', 'Blue Lagoon', 'Citrus + Curaçao Blue Monin +Vodka', 49, 1),
  ('Drinks Pontal Experiência', 'Gin Love', 'Gin + Grenadine Monin + Tônica', 49, 2),
  ('Drinks Pontal Experiência', 'Aperol Spritz', NULL, 49, 3),
  ('Drinks Pontal Experiência', 'Morena Carapitangui', 'Vodka + Monin Tangerina + Manjericão + Tônica', 49, 4),
  ('Drinks Pontal Experiência', 'Gin Tônica', NULL, 49, 5),
  
  -- ICE DRINKS
  ('Ice Drinks', 'Frozen', 'mel de cacau ou morango com gin ou vodka', 49, 1),
  ('Ice Drinks', 'Frozen', 'mel de cacau ou morango com gin ou vodka - Importada', 55, 2),
  ('Ice Drinks', 'Pontal Sunset', 'mel de cacau + gengibre + capim santo + hortelã', 49, 3),
  ('Ice Drinks', 'Pontal Sunset', 'mel de cacau + gengibre + capim santo + hortelã - Importada', 55, 4),
  
  -- BEBIDAS SEM ÁLCOOL
  ('Bebidas sem Álcool', 'Água', 'sem gás', 7, 1),
  ('Bebidas sem Álcool', 'Água', 'com gás', 8, 2),
  ('Bebidas sem Álcool', 'Coco Verde', NULL, 15, 3),
  ('Bebidas sem Álcool', 'Água Tônica', NULL, 10, 4),
  ('Bebidas sem Álcool', 'Suco', 'Morango, cajá ou limão', 18, 5),
  ('Bebidas sem Álcool', 'Refrigerante', NULL, 10, 6),
  ('Bebidas sem Álcool', 'Energético', 'Red Bull', 22, 7),
  
  -- SOFT DRINKS
  ('Soft Drinks', 'Frozen Soft', '35', 35, 1),
  ('Soft Drinks', 'Mel de cacau / Morango', NULL, NULL, 2),
  ('Soft Drinks', 'Carapitangui Soft Beach', '35', 35, 3),
  ('Soft Drinks', 'Suco de laranja com Monin Grenadine decorado', NULL, NULL, 4),
  ('Soft Drinks', 'Pontal Soft Blue', '35', 35, 5),
  ('Soft Drinks', 'Citrus + Monin Curaçao Blue', NULL, NULL, 6),
  ('Soft Drinks', 'Das Deusas', '35', 35, 7),
  ('Soft Drinks', 'Açaí + morango + suco de laranja', NULL, NULL, 8),
  
  -- CERVEJAS
  ('Cervejas', 'Original', '600ml', 18, 1),
  ('Cervejas', 'Amstel', '600ml', 18, 2),
  ('Cervejas', 'Heineken', '600ml', 22, 3),
  ('Cervejas', 'Long Neck', '330ml', 16, 4),
  ('Cervejas', 'Long Neck Zero', '330ml', 16, 5),
  
  -- DESTILADOS (dose 50ml)
  ('Destilados', 'Campari', NULL, 32, 1),
  ('Destilados', 'Martini Vermouth', NULL, 28, 2),
  ('Destilados', 'Cachaça', NULL, 28, 3),
  ('Destilados', 'Cachaça Especial', NULL, 35, 4),
  ('Destilados', 'Vodka Smirnoff', NULL, 30, 5),
  ('Destilados', 'Vodka Absolut', NULL, 38, 6),
  ('Destilados', 'Gin importado', NULL, 39, 7),
  ('Destilados', 'Tequila Jose Cuervo (ouro/prata)', NULL, 35, 8),
  ('Destilados', 'Licor a consultar', NULL, 32, 9),
  ('Destilados', 'Whisky 8 anos', NULL, 35, 10),
  ('Destilados', 'Whisky 12 anos', NULL, 39, 11),
  ('Destilados', 'Whisky 15 anos', NULL, 45, 12)
) AS menu_data(category_name, item_name, description, price, sort_order)
WHERE price IS NOT NULL
ON CONFLICT DO NOTHING;
