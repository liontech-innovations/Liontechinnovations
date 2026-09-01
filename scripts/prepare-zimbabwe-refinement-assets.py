"""Prepare the supplied lower-section photograph and market marker; no retouching.

Usage: python scripts/prepare-zimbabwe-refinement-assets.py <victoria-falls.jpg> <zimbabwe.jpg>
Harare assets and original uploads are never modified.
"""
from hashlib import sha256
from pathlib import Path
import sys
from PIL import Image, ImageOps

sources = [Path(value) for value in sys.argv[1:3]]
expected = ["32b4cbae89280957009834ee1446881af1412afd7e598b413a2ec8c8448fafbf", "d06630891cee7db1fbc97a579c9717510bbedf47ff2d20fe1cb7b2459451c776"]
assert len(sources) == 2
assert [sha256(path.read_bytes()).hexdigest() for path in sources] == expected
target = Path(__file__).resolve().parent.parent / "public/assets/zimbabwe"
falls = ImageOps.exif_transpose(Image.open(sources[0])).convert("RGB")
for width in (480, 960, 1920):
    resized = falls.resize((width, round(falls.height * width / falls.width)), Image.Resampling.LANCZOS)
    resized.save(target / f"victoria-falls-{width}.jpg", quality=90, optimize=True, progressive=True)
    resized.save(target / f"victoria-falls-{width}.webp", quality=87, method=6)
    resized.save(target / f"victoria-falls-{width}.avif", quality=75, speed=6)
marker = ImageOps.exif_transpose(Image.open(sources[1])).convert("RGB")
for width in (320, 640):
    resized = marker.resize((width, round(marker.height * width / marker.width)), Image.Resampling.LANCZOS)
    resized.save(target / f"zimbabwe-market-marker-{width}.png", optimize=True)
assert [sha256(path.read_bytes()).hexdigest() for path in sources] == expected
print("Prepared nine Victoria Falls derivatives and two lossless map markers; original hashes unchanged.")
