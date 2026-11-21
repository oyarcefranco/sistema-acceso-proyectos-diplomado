import urllib.request
import os

logos = {
    'logo-vcm-uss.webp': 'https://cdn.uss.cl/vcm/2025/08/logo-vcm-uss.webp',
    'USS_VcM_logo_responsive.png': 'https://cdn.uss.cl/vcm/2025/04/USS_VcM_logo_responsive.png',
    'vcm-fondo-blanco.png': 'https://cdn.uss.cl/vcm/2025/04/vcm-fondo-blanco.png',
    'logo-uss-ilumina-white.webp': 'https://cdn.uss.cl/vcm/2025/08/logo-uss-ilumina-white.webp'
}

os.makedirs('public/logos', exist_ok=True)

for name, url in logos.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        dest = os.path.join('public/logos', name)
        with urllib.request.urlopen(req, timeout=15) as resp, open(dest, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded {name} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")
