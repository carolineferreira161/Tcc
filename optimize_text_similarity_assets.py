from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets')
target = Path('/home/ubuntu/text-similarity-lab/client/public/visuals')
target.mkdir(parents=True, exist_ok=True)

for name, size, quality in [
    ('text-similarity-mark.png', (320, 320), 90),
    ('editorial-paper-grid.png', (1600, 900), 78),
    ('document-scan-abstract.png', (1200, 900), 78),
]:
    image = Image.open(source / name)
    image.thumbnail(size, Image.Resampling.LANCZOS)
    output = target / name.replace('.png', '.webp')
    image.convert('RGB' if image.mode not in ('RGBA', 'LA') else image.mode).save(output, 'WEBP', quality=quality, method=6)
