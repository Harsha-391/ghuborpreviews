export interface SizeMeasurement {
  size: string;
  chest: string;
  length: string;
  acrossShoulder?: string;
  sleeve?: string;
  bottom?: string;
  neckline?: string;
  waist?: string;
  inseam?: string;
}

export interface CMSProductImage {
  id: string;
  url: string;
  alt: string;
  label: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  mrp?: string;
  image: string;
  backImage?: string;
  description: string;
  fullDescription: string;
  howToUse: string[];
  sizeScale: SizeMeasurement[];
  details: string[];
  fabric: string;
  weight: string;
  drop: string;
  category?: string;
  darkImage?: string;
  lightImage?: string;
  galleryDark?: string[];
  galleryLight?: string[];
  imagesDark?: CMSProductImage[];
  imagesLight?: CMSProductImage[];
}
