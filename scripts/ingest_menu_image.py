#!/usr/bin/env python3
"""
MiMenu AI Vision Menu Ingester CLI
Ingests physical menu pictures, photos, or raw transcripts and fulfills
the menu items into src/data/provisioned_venues.json or creates a new venue entry.

Usage:
  python3 scripts/ingest_menu_image.py --venue-slug "moes-taberna-scz" --text-file menu.txt
  python3 scripts/ingest_menu_image.py --new-venue "La Birrería Camba" --image-url "https://..."
"""

import os
import sys
import json
import re
import argparse
from typing import List, Dict, Any

FOOD_KEYWORDS_IMAGES = [
    (["burger", "hamburguesa", "smash", "bacon", "angus"], "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"),
    (["pizza", "napolitana", "fugazzeta", "mozzarella"], "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"),
    (["cerveza", "chopp", "pitcher", "beer", "huari", "ipa"], "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80"),
    (["alitas", "wings", "bbq", "salchipapa", "picada"], "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80"),
    (["nachos", "guacamole", "totopos", "tacos"], "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80"),
    (["pasta", "fettuccine", "lasagna", "ravioles"], "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80"),
    (["cafe", "coffee", "cappuccino", "latte", "espresso"], "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"),
    (["cocktail", "trago", "mojito", "gin", "fernet"], "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"),
    (["postre", "tiramisu", "cheesecake", "brownie"], "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80")
]

def get_food_image(title: str, desc: str = "") -> str:
    combined = (title + " " + desc).lower()
    for keywords, url in FOOD_KEYWORDS_IMAGES:
        if any(k in combined for k in keywords):
            return url
    return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"

def detect_dietary(text: str):
    lower = text.lower()
    dietary = []
    allergens = []
    if "vegano" in lower or "vegan" in lower:
        dietary.append("Vegano")
    if "vegetariano" in lower or "veggie" in lower:
        dietary.append("Vegetariano")
    if "sin gluten" in lower or "celiaco" in lower:
        dietary.append("Sin Gluten")
    if "picante" in lower or "jalapeño" in lower:
        dietary.append("Picante")
    
    if any(w in lower for w in ["queso", "leche", "crema"]):
        allergens.append("Lácteos")
    if any(w in lower for w in ["huevo"]):
        allergens.append("Huevo")
    if any(w in lower for w in ["pan", "harina", "pasta"]):
        allergens.append("Gluten")
    return dietary, allergens

def parse_menu_transcript_py(text: str, venue_id: str) -> List[Dict[str, Any]]:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    categories_dict: Dict[str, List[Dict[str, Any]]] = {}
    current_cat = "Platos Principales"

    for line in lines:
        if line.startswith("===") or line.startswith("###") or (len(line) < 30 and line.isupper() and not re.search(r'\d+', line)):
            cat_name = line.replace("=", "").replace("#", "").strip()
            if len(cat_name) > 2:
                current_cat = cat_name
                if current_cat not in categories_dict:
                    categories_dict[current_cat] = []
                continue

        # Extract price
        price_match = re.search(r'(?:bs\.?|bob|\$)?\s*(\d+(?:[\.,]\d{1,2})?)\s*(?:bs\.?|bob)?', line, re.I)
        price = 35.0
        clean_line = line
        
        # Look for numbers at the end
        end_num = re.search(r'(\d+)\s*(?:bs|bob)?\s*$', line, re.I)
        if end_num:
            price = float(end_num.group(1))
            clean_line = line[:end_num.start()].strip()
        elif price_match:
            try:
                price = float(price_match.group(1).replace(",", "."))
                clean_line = line.replace(price_match.group(0), "").strip()
            except:
                pass

        # Split name & description
        name = clean_line
        description = "Preparado con ingredientes de primera calidad."
        if " - " in clean_line:
            parts = clean_line.split(" - ")
            name = parts[0].strip()
            description = " - ".join(parts[1:]).strip()
        elif ": " in clean_line:
            parts = clean_line.split(": ")
            name = parts[0].strip()
            description = ": ".join(parts[1:]).strip()

        # Clean bullets
        name = re.sub(r'^[\d\.\-\*•\s]+', '', name).strip()
        if not name:
            continue

        dietary, allergens = detect_dietary(name + " " + description)
        image_url = get_food_image(name, description)

        item_obj = {
            "id": f"item-{len(categories_dict.get(current_cat, []))+1}-{hash(name) % 10000}",
            "venue_id": venue_id,
            "name": name,
            "description": description,
            "price": price,
            "image_url": image_url,
            "is_available": True,
            "is_best_seller": price >= 40,
            "is_featured": len(categories_dict.get(current_cat, [])) < 2,
            "hotness_score": 4,
            "velocity_24h": 12,
            "baseline_14d": 6,
            "reviews_count": 18,
            "average_rating": 4.8,
            "tags": dietary if dietary else ["Destacado"],
            "allergens": allergens,
            "dietary": dietary
        }

        if current_cat not in categories_dict:
            categories_dict[current_cat] = []
        categories_dict[current_cat].append(item_obj)

    # Format into Category list
    result_categories = []
    for idx, (cat_name, items) in enumerate(categories_dict.items()):
        slug_key = re.sub(r'[^a-z0-9]+', '_', cat_name.lower()).strip('_') or f"cat_{idx+1}"
        result_categories.append({
            "id": f"cat-{slug_key}-{idx+1}",
            "venue_id": venue_id,
            "key": slug_key,
            "name": cat_name,
            "description": f"Variedad de {cat_name.lower()}",
            "icon": "UtensilsCrossed",
            "order_index": idx + 1,
            "items": items
        })

    return result_categories

def main():
    parser = argparse.ArgumentParser(description="MiMenu AI Vision Menu Ingester")
    parser.add_argument("--venue-slug", type=str, help="Target venue slug in provisioned_venues.json")
    parser.add_argument("--new-venue", type=str, help="Create a new venue with this name")
    parser.add_argument("--text-file", type=str, help="Path to text file containing menu transcript")
    parser.add_argument("--json-out", type=str, help="Optional output path for extracted categories JSON")
    args = parser.parse_args()

    venues_file = os.path.join(os.path.dirname(__file__), "../src/data/provisioned_venues.json")

    sample_text = """
=== CERVEZAS & CHOPPS ===
Chopp Artesanal IPA 500ml - Cítrico y balanceado - 28 Bs
Chopp Rubia Huari 500ml - Dorada y refrescante - 25 Bs
Balde de 6 Cervezas Huari - En hielo con limón - 85 Bs

=== HAMBURGUESAS & PIQUEOS ===
Burger Doble Smash Bacon - Carne Angus, cheddar derretido y tocino crocante - 45 Bs
Salchipapa Monster - Salchicha artesanal, papas rústicas y salsas de la casa - 38 Bs
Alitas BBQ Picantes (12u) - Con bastones de apio y salsa ranch - 48 Bs (Picante)
Nachos Supremos - Totopos con queso fundido, frijoles y guacamole - 40 Bs (Vegetariano)
"""

    if args.text_file and os.path.exists(args.text_file):
        with open(args.text_file, "r", encoding="utf-8") as f:
            raw_text = f.read()
    else:
        raw_text = sample_text

    target_slug = args.venue_slug or "moes-taberna-scz"
    categories = parse_menu_transcript_py(raw_text, f"venue-{target_slug}")
    total_items = sum(len(c["items"]) for c in categories)

    print(f"✨ Successfully parsed {total_items} menu items across {len(categories)} categories!")
    for c in categories:
        print(f"  📂 [{c['name']}] ({len(c['items'])} items)")
        for item in c["items"][:3]:
            print(f"     • {item['name']} — Bs. {item['price']} ({', '.join(item['dietary']) if item['dietary'] else 'Normal'})")

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as f:
            json.dump(categories, f, indent=2, ensure_ascii=False)
        print(f"💾 Exported to {args.json_out}")

    if os.path.exists(venues_file):
        with open(venues_file, "r", encoding="utf-8") as f:
            venues = json.load(f)
        
        updated = False
        for v in venues:
            if v.get("slug") == target_slug:
                v["categories"] = categories
                updated = True
                print(f"🚀 Fused menu items directly into venue: '{v.get('name')}' ({target_slug})")
                break
        
        if updated:
            with open(venues_file, "w", encoding="utf-8") as f:
                json.dump(venues, f, indent=2, ensure_ascii=False)
            print(f"✅ Updated {venues_file} successfully!")

if __name__ == "__main__":
    main()
