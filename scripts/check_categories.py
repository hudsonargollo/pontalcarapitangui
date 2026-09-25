import urllib.request
import re
import json

def fetch_html(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error {url}: {e}")
        return ""

home_html = fetch_html("https://mundocamba.com/")
categories = re.findall(r'href=[\"\'](https?://mundocamba\.com/place-category/[^/\"\']+/?)[\"\']', home_html)
all_places_links = re.findall(r'href=[\"\'](https?://mundocamba\.com/place/[^/\"\']+/?)[\"\']', home_html)

print(f"Categories found on home: {len(set(categories))}")
for c in set(categories):
    print(" Category:", c)

print(f"Direct place links on home: {len(set(all_places_links))}")
