import urllib.request
import re
import os

url = "https://vcm.uss.cl"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8')
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
        print("Found images:", len(imgs))
        for img in imgs:
            if any(k in img.lower() for k in ['logo', 'vcm', 'uss', 'marca']):
                print("Candidate:", img)
except Exception as e:
    print("Error fetching vcm.uss.cl:", e)
