import urllib.request
import re
import json
from html.parser import HTMLParser

def fetch_url(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def extract_place_details(url):
    html = fetch_url(url)
    
    # Title
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL | re.IGNORECASE)
    title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else ''
    
    # Meta description
    desc_match = re.search(r'<meta[^>]+property=[\"\']og:description[\"\'][^>]+content=[\"\'](.*?)[\"\']', html, re.IGNORECASE)
    if not desc_match:
        desc_match = re.search(r'<meta[^>]+content=[\"\'](.*?)[\"\'][^>]+property=[\"\']og:description[\"\']', html, re.IGNORECASE)
    desc = desc_match.group(1) if desc_match else ''
    
    # Image
    img_match = re.search(r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\'](.*?)[\"\']', html, re.IGNORECASE)
    if not img_match:
        img_match = re.search(r'<meta[^>]+content=[\"\'](.*?)[\"\'][^>]+property=[\"\']og:image[\"\']', html, re.IGNORECASE)
    img = img_match.group(1) if img_match else ''

    # WhatsApp or phone
    wa_match = re.findall(r'href=[\"\'](https?://(?:api\.)?whatsapp\.com/[^\"\']+|https?://wa\.me/[^\"\']+)[\"\']', html, re.IGNORECASE)
    tel_match = re.findall(r'href=[\"\']tel:([^\"\']+)[\"\']', html, re.IGNORECASE)
    
    # Category / tags
    categories = re.findall(r'rel=[\"\']tag[\"\'][^>]*>(.*?)</a>', html, re.IGNORECASE)
    if not categories:
        categories = re.findall(r'href=[\"\']https?://mundocamba\.com/place-category/([^/\"\']+)[\"\']', html, re.IGNORECASE)
    
    # Address / location text
    address_match = re.search(r'(?:Dirección|Ubicación|Address)[\s\S]*?<[^>]+>([^<]+(?:Av\.|Calle|Barrio|Anillo|Equipetrol|Radial|Santa Cruz)[^<]*)', html, re.IGNORECASE)
    address = address_match.group(1).strip() if address_match else "Santa Cruz de la Sierra, Bolivia"

    return {
        'url': url,
        'title': title,
        'description': desc,
        'image': img,
        'whatsapp': wa_match[0] if wa_match else '',
        'phone': tel_match[0] if tel_match else '',
        'categories': list(set(categories)),
        'address': address
    }

if __name__ == '__main__':
    urls = [
        'https://mundocamba.com/place/volare-by-ale-peredo/',
        'https://mundocamba.com/place/papote-smoky-food-shop/',
        'https://mundocamba.com/place/pollos-de-oro-av-busch/'
    ]
    for u in urls:
        data = extract_place_details(u)
        print(json.dumps(data, indent=2, ensure_ascii=False))
        print("="*40)
