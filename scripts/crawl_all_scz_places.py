import urllib.request
import re
import json
import time

def fetch_html(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def get_all_scz_places():
    page = 1
    all_place_urls = set()
    
    while True:
        url = f"https://mundocamba.com/place-city/santa-cruz-de-la-sierra/page/{page}/" if page > 1 else "https://mundocamba.com/place-city/santa-cruz-de-la-sierra/"
        print(f"Fetching listing page {page}: {url}")
        html = fetch_html(url)
        if not html:
            break
            
        # Extract place links
        place_links = re.findall(r'href=[\"\'](https?://mundocamba\.com/place/[a-zA-Z0-9_-]+/)[\"\']', html)
        new_links = set(place_links) - all_place_urls
        print(f"Page {page} found {len(place_links)} place links ({len(new_links)} new)")
        
        if not new_links:
            print("No more new places found. Reached the end of pagination.")
            break
            
        all_place_urls.update(new_links)
        page += 1
        time.sleep(0.5)
        
    print(f"\nTotal unique Santa Cruz places found across {page-1} pages: {len(all_place_urls)}")
    return sorted(list(all_place_urls))

if __name__ == '__main__':
    places = get_all_scz_places()
    print("Places list sample (first 15):")
    for p in places[:15]:
        print(" -", p)
    with open('/root/ClubeMkt/mimenu/scripts/scz_places_urls.json', 'w', encoding='utf-8') as f:
        json.dump(places, f, indent=2)
