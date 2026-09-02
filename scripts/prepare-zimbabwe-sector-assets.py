"""Resize selected Founder uploads without cropping, retouching or changing originals.

Usage: python scripts/prepare-zimbabwe-sector-assets.py <first-upload-folder> <second-upload-folder>
Only hashes and dimensions, never local source paths, enter the public manifest.
"""
from hashlib import sha256
from pathlib import Path
import json
import sys
from PIL import Image, ImageOps

first, second = (Path(value) for value in sys.argv[1:3])
sources = {
    "agriculture": first / "2-Photo-2.jpg",
    "mining": first / "3-Photo-3.jpg",
    "banking": first / "4-Photo-4.jpg",
    "public-enterprise": first / "5-Photo-5.jpg",
    "logistics": second / "3-Photo-3.jpg",
    "city": second / "4-Photo-4.jpg",
    "sports": second / "5-Photo-5.jpg",
}
target = Path(__file__).resolve().parent.parent / "public/assets/zimbabwe/sectors"
target.mkdir(parents=True, exist_ok=True)
manifest = []
for key, path in sources.items():
    before = sha256(path.read_bytes()).hexdigest()
    with Image.open(path) as original:
        source = ImageOps.exif_transpose(original).convert("RGB")
        files = []
        for width in (480, 960):
            assert width <= source.width, "Do not upscale source photography"
            resized = source.resize((width, round(source.height * width / source.width)), Image.Resampling.LANCZOS)
            for extension, options in (("jpg", {"quality": 88, "optimize": True, "progressive": True}), ("webp", {"quality": 85, "method": 6}), ("avif", {"quality": 70, "speed": 6})):
                output = target / f"{key}-{width}.{extension}"
                resized.save(output, **options)
                files.append({"file": output.name, "width": width, "height": resized.height, "bytes": output.stat().st_size})
        manifest.append({"key": key, "sourceSha256": before, "sourceWidth": source.width, "sourceHeight": source.height, "files": files})
    assert sha256(path.read_bytes()).hexdigest() == before
(target / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
