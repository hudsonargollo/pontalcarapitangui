import urllib.request
import re
import json
import time

def fetch_html(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def get_places_from_sitemaps():
    all_place_urls = set()
    sitemaps = [
        'https://mundocamba.com/place-sitemap.xml',
        'https://mundocamba.com/place-sitemap2.xml',
        'https://mundocamba.com/wp-sitemap-posts-place-1.xml'
    ]
    
    for sitemap in sitemaps:
        print(f"Parsing sitemap: {sitemap}")
        content = fetch_html(sitemap)
        urls = re.findall(r'<loc>(https?://mundocamba\.com/place/[^<]+)</loc>', content)
        print(f" Found {len(urls)} place URLs")
        all_place_urls.update(urls)
        
    return sorted(list(all_place_urls))

def extract_details(url):
    html = fetch_html(url)
    if not html: return None
    
    # Simple RegEx extraction
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL | re.IGNORECASE)
    title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else ''
    
    # Image
    img_match = re.search(r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\'](.*?)[\"\']', html, re.IGNORECASE)
    img = img_match.group(1) if img_match else ''

    # WhatsApp (look for wa.me links)
    wa_match = re.findall(r'href=[\"\'](https?://(?:api\.)?whatsapp\.com/[^\"\']+|https?://wa\.me/(\d+)[^\"\']*)[\"\']', html, re.IGNORECASE)
    whatsapp = ""
    if wa_match:
        # wa_match is a list of tuples if multiple capturing groups
        whatsapp = wa_match[0][0]

    # Address / Category usually in specific blocks but lets look for text
    city_match = re.search(r'Santa Cruz de la Sierra', html, re.IGNORECASE)
    if not city_match:
        # If it doesn't mention SCZ, we might want to skip it if we want strict SCZ
        pass

    return {
        'url': url,
        'name': title,
        'image_url': img,
        'whatsapp': whatsapp,
        'source': 'mundocamba'
    }

if __name__ == '__main__':
    print("Collecting place URLs...")
    urls = get_places_from_sitemaps()
    print(f"Total places to process: {len(urls)}")
    
    results = []
    # Process first 100 for safety and speed in this step
    to_process = urls[:100]
    
    for i, url in enumerate(to_process):
        print(f"[{i+1}/{len(to_process)}] Extracting: {url}")
        details = extract_details(url)
        if details and details['whatsapp']: # Only keep those we can actually "onboard" (need contact)
            results.append(details)
        time.sleep(0.1) # Be nice
        
    with open('/root/ClubeMkt/mimenu/scripts/extracted_places.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(results)} valid places to extracted_places.json")
