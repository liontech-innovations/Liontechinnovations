import type { ZimbabweImageKey } from '../content/zimbabweIndustries';

const images: Record<ZimbabweImageKey, { width: number; height: number; alt: string; caption: string }> = {
  banking: { width: 960, height: 500, alt: 'Reserve Bank of Zimbabwe sign and national colours', caption: 'Financial-sector context. No affiliation with or endorsement by the Reserve Bank of Zimbabwe is implied.' },
  city: { width: 960, height: 515, alt: 'Harare central business district, glass towers and street traffic', caption: 'Harare business context. Buildings shown are not claimed as LionTech clients or premises.' },
  agriculture: { width: 960, height: 392, alt: 'Cultivated crop rows with surrounding hills', caption: 'Founder-supplied agriculture photograph, used as sector context.' },
  mining: { width: 960, height: 538, alt: 'Loader and haul truck working beside a rock face', caption: 'Founder-supplied mining photograph. No relationship with the operation shown is claimed.' },
  'public-enterprise': { width: 960, height: 640, alt: 'Institutional building with Zimbabwe flags', caption: 'Institutional context only. No government appointment or endorsement is implied.' },
  logistics: { width: 960, height: 963, alt: 'Illustration of road freight, cargo containers and an aircraft', caption: 'Founder-supplied logistics illustration; not a photograph of a LionTech operation.' },
  tourism: { width: 960, height: 550, alt: 'Victoria Falls and the Zambezi River seen from above', caption: 'Victoria Falls, Zimbabwe tourism context. No venue or operator partnership is claimed.' },
  sports: { width: 960, height: 518, alt: 'Sports equipment with Zimbabwe flag colours and the national bird motif', caption: 'Founder-supplied sports illustration. No club, association or venue relationship is claimed.' },
};

export function ZimbabweSectorImage({ imageKey }: { imageKey: ZimbabweImageKey }) {
  const image = images[imageKey];
  const base = imageKey === 'tourism' ? '/assets/zimbabwe/victoria-falls' : `/assets/zimbabwe/sectors/${imageKey}`;
  const sizes = '(min-width: 1100px) 520px, (min-width: 768px) 45vw, 100vw';
  return <figure className="lt-zw-sector-figure">
    <picture>
      <source type="image/avif" srcSet={`${base}-480.avif 480w, ${base}-960.avif 960w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`} sizes={sizes} />
      <img src={`${base}-960.jpg`} srcSet={`${base}-480.jpg 480w, ${base}-960.jpg 960w`} sizes={sizes} width={image.width} height={image.height} alt={image.alt} loading="eager" fetchPriority="high" decoding="async" />
    </picture>
    <figcaption>{image.caption}</figcaption>
  </figure>;
}
