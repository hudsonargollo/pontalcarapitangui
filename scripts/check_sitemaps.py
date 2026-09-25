import urllib.request
import re

for sitemap_url in [
    'https://mundocamba.com/sitemap.xml',
    'https://mundocamba.com/sitemap_index.xml',
    'https://mundocamba.com/wp-sitemap.xml',
    'https://mundocamba.com/wp-sitemap-posts-place-1.xml',
    'https://mundocamba.com/wp-sitemap-taxonomies-place-city-1.xml',
    'https://mundocamba.com/wp-sitemap-taxonomies-place-category-1.xml'
]:
    req = urllib.request.Request(sitemap_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            urls = re.findall(r'<loc>(https?://[^<]+)</loc>', content)
            print(f"Sitemap {sitemap_url}: Found {len(urls)} URLs")
            if 'place-1' in sitemap_url or 'posts-place' in sitemap_url or len(urls) > 0:
                print(" Sample URLs:", urls[:5])
    except Exception as e:
        print(f"Sitemap {sitemap_url}: Error {e}")
