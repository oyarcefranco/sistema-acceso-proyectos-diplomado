import urllib.request
import re

url = "https://vcm.uss.cl"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode("utf-8", errors="ignore")
        print("Page length:", len(html))
        logos = re.findall(r'https?://[^\s"\'<>]+\.(?:png|svg|jpg|webp)', html, re.I)
        vcm_logos = [l for l in logos if any(k in l.lower() for k in ['logo', 'brand', 'uss', 'vcm'])]
        print("Logos found:", set(vcm_logos[:10]))
        colors = re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b', html)
        from collections import Counter
        print("Most common colors:", Counter(colors).most_common(10))
except Exception as e:
    print("Error:", e)
