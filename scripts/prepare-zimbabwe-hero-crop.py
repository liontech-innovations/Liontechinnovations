"""Reproduce the hero-only crop from the original Harare photo; no retouching.

Usage: python scripts/prepare-zimbabwe-hero-crop.py <original-photo-path>
The source is verified and never overwritten. The reference is composition-only.
"""
from hashlib import sha256
from pathlib import Path
import sys
from PIL import Image, ImageOps

source = Path(sys.argv[1])
expected = "90f103d64c45fe8a10a5ccf7648877564574e206465c862393bb5c2b04238de7"
assert sha256(source.read_bytes()).hexdigest() == expected, "Unexpected source photo"
original = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
assert original.size == (960, 1280)
# Both edges are cropped: left corner fragments and the right green facade.
# Desktop trades some upper sky for width; both crops retain the vehicle roofs.
crops = {"desktop": (90, 350, 676, 1280), "mobile": (90, 0, 676, 1280)}
target = Path(__file__).resolve().parent.parent / "public/assets/zimbabwe"
for variant, bounds in crops.items():
    crop = original.crop(bounds)
    for width in (480, 586):
        resized = crop.resize((width, round(crop.height * width / crop.width)), Image.Resampling.LANCZOS)
        base = target / f"harare-hero-{variant}{'-480' if width == 480 else ''}.jpg"
        resized.save(base, quality=91, optimize=True, progressive=True)
        resized.save(target / f"harare-hero-{variant}-{width}.webp", quality=87, method=6)
        resized.save(target / f"harare-hero-{variant}-{width}.avif", quality=80, speed=6)
    print(f"{variant}: {bounds}; 480/586px JPEG/WebP/AVIF.")
assert sha256(source.read_bytes()).hexdigest() == expected, "Source changed"
print("Original unchanged; no retouching, distortion, generation or extension.")
