"""Deterministic web derivatives of the five supplied assets (Pillow, no generation).

Usage: python scripts/prepare-zimbabwe-assets.py <attachment-directory> <font-directory>
The originals stay untouched. No runtime image dependency is added to the site.
"""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
fonts = Path(sys.argv[2])
target = root / "public" / "assets" / "zimbabwe"
target.mkdir(parents=True, exist_ok=True)
photos = {
    "harare-hero": "2-Photo-2.jpg",
    "harare-business-district": "3-Photo-3.jpg",
    "harare-digital-future": "5-Photo-5.jpg",
    "harare-infrastructure-cta": "4-Photo-4.jpg",
}
for name, filename in photos.items():
    original = ImageOps.exif_transpose(Image.open(source / filename)).convert("RGB")
    for width in (480, 960):
        resized = original.resize((width, round(original.height * width / original.width)), Image.Resampling.LANCZOS)
        resized.save(target / f"{name}{'-480' if width == 480 else ''}.jpg", quality=91, optimize=True, progressive=True)
        resized.save(target / f"{name}-{width}.webp", quality=87, method=6)
        resized.save(target / f"{name}-{width}.avif", quality=80, speed=6)
    print(f"Prepared {name}: JPEG, WebP, AVIF at 480/960px")

mark = ImageOps.exif_transpose(Image.open(source / "1-Photo-1.jpg")).convert("RGB")
mark.thumbnail((320, 320), Image.Resampling.LANCZOS)
mark.save(target / "zimbabwe-map-flag.jpg", quality=94, optimize=True)

# The social card uses only the approved city photo, existing logo and text.
hero = ImageOps.exif_transpose(Image.open(source / "2-Photo-2.jpg")).convert("RGB")
card = ImageOps.fit(hero, (1200, 630), Image.Resampling.LANCZOS, centering=(0.5, 0.57)).convert("RGBA")
scrim = Image.new("RGBA", card.size)
draw = ImageDraw.Draw(scrim)
for x in range(card.width):
    alpha = round(245 - 165 * (x / card.width) ** 1.8)
    draw.line((x, 0, x, 630), fill=(3, 10, 20, alpha))
card = Image.alpha_composite(card, scrim)
logo = Image.open(root / "public/assets/liontechlogo.png").convert("RGBA")
logo.thumbnail((300, 85), Image.Resampling.LANCZOS)
card.alpha_composite(logo, (58, 45))
draw = ImageDraw.Draw(card)
regular = lambda size: ImageFont.truetype(str(fonts / "segoeui.ttf"), size)
bold = lambda size: ImageFont.truetype(str(fonts / "seguisb.ttf"), size)
draw.text((60, 174), "LIONTECH ZIMBABWE", font=bold(21), fill="#E0BF6D")
draw.text((56, 235), "Corporate AI &", font=bold(54), fill="#F2EEE5")
draw.text((56, 302), "Digital Modernisation", font=bold(54), fill="#F2EEE5")
draw.line((60, 406, 210, 406), fill="#C8A24A", width=3)
draw.text((60, 448), "UK Registered · Zimbabwe Focus", font=regular(27), fill="#EEF1F3")
draw.text((60, 560), "liontechinnovations.co.uk/zimbabwe", font=regular(20), fill="#E0BF6D")
card.convert("RGB").save(target / "zimbabwe-og.png", optimize=True)
print("Prepared zimbabwe-map-flag.jpg and 1200x630 zimbabwe-og.png")
