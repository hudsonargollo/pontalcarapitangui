import urllib.request
import re
from bs4 import BeautifulSoup
import json

def fetch_url(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def inspect_place(url):
    html = fetch_url(url)
    soup = BeautifulSoup(html, 'html.parser')
    
    title = soup.find('h1')
    title_text = title.get_text(strip=True) if title else 'No title'
    
    # Try finding category, address, phone, website, description, images
    print(f"=== PLACE: {title_text} ({url}) ===")
    
    # Meta or schema
    schema = soup.find('script', type='application/ld+json')
    if schema:
        try:
            schema_data = json.loads(schema.string)
            print("Schema data found:", schema_data.keys() if isinstance(schema_data, dict) else type(schema_data))
        except Exception as e:
            print("Schema parse error:", e)

    # All text content
    meta_desc = soup.find('meta', property='og:description')
    print("Meta description:", meta_desc['content'] if meta_desc else 'None')
    
    img = soup.find('meta', property='og:image')
    print("OG Image:", img['content'] if img else 'None')

    # Phone or whatsapp
    whatsapp_links = [a['href'] for a in soup.find_all('a', href=True) if 'wa.me' in a['href'] or 'whatsapp' in a['href']]
    print("WhatsApp links:", whatsapp_links)

    # Address / contact fields
    contact_fields = soup.find_all(class_=re.compile(r'contact|address|phone|location|category', re.I))
    for f in contact_fields[:5]:
        print(f"Field [{f.get('class')}]: {f.get_text(strip=True)[:100]}")

if __name__ == '__main__':
    sample_urls = [
        'https://mundocamba.com/place/volare-by-ale-peredo/',
        'https://mundocamba.com/place/papote-smoky-food-shop/',
        'https://mundocamba.com/place/pollos-de-oro-av-busch/'
    ]
    for u in sample_urls:
        inspect_place(u)
        print("\n" + "="*50 + "\n")
