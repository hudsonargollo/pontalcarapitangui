import json
import os

# MIMENU provisioning logic:
# 1. Read extracted_places.json
# 2. Map to Venue/Tenant structure
# 3. Use the onboarding batch setup logic to create menus and tables
# 4. For this simulation, we generate a mock structured menu for each based on their name

def provision_venues():
    extracted_path = '/root/ClubeMkt/mimenu/scripts/extracted_places.json'
    if not os.path.exists(extracted_path):
        print("Error: extracted_places.json not found")
        return

    with open(extracted_path, 'r', encoding='utf-8') as f:
        places = json.load(f)

    provisioned = []
    
    # Generic menu templates based on name keywords
    menu_templates = {
        'burger': [
            {'name': 'Hamburguesas', 'items': [
                {'name': 'Clásica Simple', 'price': 32},
                {'name': 'Doble Cheddar & Bacon', 'price': 45},
                {'name': 'BBQ Smoky Special', 'price': 48}
            ]},
            {'name': 'Bebidas', 'items': [
                {'name': 'Gaseosa 500ml', 'price': 10},
                {'name': 'Cerveza Chopp', 'price': 22}
            ]}
        ],
        'pizza': [
            {'name': 'Pizzas', 'items': [
                {'name': 'Muzarella Familiar', 'price': 55},
                {'name': 'Pepperoni Hot', 'price': 65},
                {'name': 'Napolitana Special', 'price': 60}
            ]},
            {'name': 'Bebidas', 'items': [
                {'name': 'Gaseosa 2L', 'price': 18},
                {'name': 'Cerveza Litro', 'price': 25}
            ]}
        ],
        'cafe': [
            {'name': 'Cafetería', 'items': [
                {'name': 'Capuccino Italiano', 'price': 18},
                {'name': 'Latte Vainilla', 'price': 20},
                {'name': 'Espresso Doble', 'price': 14}
            ]},
            {'name': 'Pastelería', 'items': [
                {'name': 'Cheesecake de Frutos Rojos', 'price': 24},
                {'name': 'Brownie con Helado', 'price': 22}
            ]}
        ],
        'default': [
            {'name': 'Menú Sugerido', 'items': [
                {'name': 'Combo Ejecutivo', 'price': 35},
                {'name': 'Especial de la Casa', 'price': 45}
            ]},
            {'name': 'Bebidas', 'items': [
                {'name': 'Refresco Natural', 'price': 12},
                {'name': 'Agua Mineral', 'price': 8}
            ]}
        ]
    }

    for i, place in enumerate(places):
        slug = place['url'].split('/')[-2]
        name = place['name']
        
        # Determine template
        template_key = 'default'
        if 'burger' in name.lower(): template_key = 'burger'
        elif 'pizza' in name.lower(): template_key = 'pizza'
        elif 'cafe' in name.lower() or 'coffee' in name.lower(): template_key = 'cafe'
        
        template = menu_templates[template_key]
        
        # Build structure matching MIMENU types
        categories = []
        for idx, cat_data in enumerate(template):
            cat_id = f"cat-{slug}-{idx}"
            items = []
            for item_idx, item_data in enumerate(cat_data['items']):
                items.append({
                    'id': f"item-{slug}-{idx}-{item_idx}",
                    'venue_id': f"venue-{slug}",
                    'category_id': cat_id,
                    'name': item_data['name'],
                    'description': f"Delicioso {item_data['name']} preparado con calidad en {name}.",
                    'price': item_data['price'],
                    'image_url': place['image_url'] or "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                    'is_available': True,
                    'hotness_score': 3,
                    'velocity_24h': 5,
                    'baseline_14d:': 2,
                    'reviews_count': 0,
                    'average_rating:': 5.0
                })
            
            categories.append({
                'id': cat_id,
                'venue_id': f"venue-{slug}",
                'key': cat_data['name'].lower(),
                'name': cat_data['name'],
                'order_index': idx + 1,
                'items': items
            })

        venue_config = {
            'id': f"venue-{slug}",
            'slug': slug,
            'name': name,
            'tagline': f"Bienvenidos a {name}",
            'city': 'Santa Cruz de la Sierra',
            'whatsapp': place['whatsapp'],
            'currency': 'Bs.',
            'primary_color': '#D97706',
            'background_theme': 'light' if template_key == 'cafe' else 'dark',
            'is_active': True,
            'categories': categories,
            'tables': 10 # Default table count
        }
        
        provisioned.append(venue_config)

    output_path = '/root/ClubeMkt/mimenu/src/data/provisioned_venues.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(provisioned, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully provisioned {len(provisioned)} venues to {output_path}")

if __name__ == '__main__':
    provision_venues()
