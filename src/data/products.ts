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

export const products: Product[] = [
  {
    "id": "product-black-1",
    "title": "REACHING FOR THE IMPOSSIBLE TEE",
    "price": "₹2,000",
    "mrp": "₹4,500",
    "image": "/black 1/ChatGPT Image Jul 11, 2026, 02_46_18 PM.png",
    "backImage": "/black 1/ChatGPT Image Jul 11, 2026, 02_50_38 PM.png",
    "description": "Premium heavy-weight graphic tee with 'Reaching For The Impossible' print.",
    "fullDescription": "An oversized streetwear tee cut from heavy 240 GSM combed cotton. Features a vintage acid-washed look with a large screenprinted illustration on the back depicting the lunar ship voyage with the gothic scripture text 'Reaching For The Impossible - Achieve Your Dreams'.",
    "howToUse": [
      "Wash cold inside out",
      "Tumble dry low or hang dry",
      "Iron low inside out"
    ],
    "sizeScale": [
      {
        "size": "S",
        "chest": "42 in",
        "length": "25.5 in",
        "acrossShoulder": "19.5 in",
        "sleeve": "8.0 in",
        "bottom": "43 in",
        "neckline": "7.5 in"
      },
      {
        "size": "M",
        "chest": "44 in",
        "length": "26.0 in",
        "acrossShoulder": "20.0 in",
        "sleeve": "8.5 in",
        "bottom": "45 in",
        "neckline": "7.5 in"
      },
      {
        "size": "L",
        "chest": "46 in",
        "length": "26.5 in",
        "acrossShoulder": "20.5 in",
        "sleeve": "9.0 in",
        "bottom": "47 in",
        "neckline": "7.5 in"
      },
      {
        "size": "XL",
        "chest": "48 in",
        "length": "27.0 in",
        "acrossShoulder": "21.0 in",
        "sleeve": "9.5 in",
        "bottom": "49 in",
        "neckline": "7.5 in"
      }
    ],
    "details": [
      "Distressed vintage wash effect",
      "High density graphic screenprint",
      "Thick 1.2-inch collar ribbing",
      "Oversized boxy streetwear fit"
    ],
    "fabric": "100% Combed Cotton Jersey",
    "weight": "240 GSM",
    "drop": "DROP 01",
    "category": "Tops",
    "darkImage": "/black 1/ChatGPT Image Jul 11, 2026, 02_46_18 PM.png",
    "lightImage": "/black 1/ChatGPT Image Jul 11, 2026, 02_46_18 PM.png",
    "galleryDark": [
      "/black 1/ChatGPT Image Jul 11, 2026, 02_50_38 PM.png",
      "/black 1/ChatGPT Image Jul 11, 2026, 03_22_14 PM.png",
      "/black 1/ChatGPT Image Jul 11, 2026, 03_46_07 PM.png",
      "/black 1/ChatGPT Image Jul 9, 2026, 05_37_12 PM.png",
      "/black 1/ChatGPT Image Jul 9, 2026, 05_38_30 PM.png"
    ],
    "galleryLight": [
      "/black 1/ChatGPT Image Jul 11, 2026, 02_50_38 PM.png",
      "/black 1/ChatGPT Image Jul 11, 2026, 03_22_14 PM.png",
      "/black 1/ChatGPT Image Jul 11, 2026, 03_46_07 PM.png",
      "/black 1/ChatGPT Image Jul 9, 2026, 05_37_12 PM.png",
      "/black 1/ChatGPT Image Jul 9, 2026, 05_38_30 PM.png"
    ],
    "imagesDark": [
      {
        "id": "product-black-1-dark-img-0",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 02_46_18 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Front View"
      },
      {
        "id": "product-black-1-dark-img-1",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 02_50_38 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Back View"
      },
      {
        "id": "product-black-1-dark-img-2",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 03_22_14 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-black-1-dark-img-3",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 03_46_07 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-black-1-dark-img-4",
        "url": "/black 1/ChatGPT Image Jul 9, 2026, 05_37_12 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-black-1-dark-img-5",
        "url": "/black 1/ChatGPT Image Jul 9, 2026, 05_38_30 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 4"
      }
    ],
    "imagesLight": [
      {
        "id": "product-black-1-light-img-0",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 02_46_18 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Front View"
      },
      {
        "id": "product-black-1-light-img-1",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 02_50_38 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Back View"
      },
      {
        "id": "product-black-1-light-img-2",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 03_22_14 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-black-1-light-img-3",
        "url": "/black 1/ChatGPT Image Jul 11, 2026, 03_46_07 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-black-1-light-img-4",
        "url": "/black 1/ChatGPT Image Jul 9, 2026, 05_37_12 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-black-1-light-img-5",
        "url": "/black 1/ChatGPT Image Jul 9, 2026, 05_38_30 PM.png",
        "alt": "REACHING FOR THE IMPOSSIBLE TEE",
        "label": "Detail View 4"
      }
    ]
  },
  {
    "id": "product-black-4",
    "title": "DOMINION OF DEATH TEE (BLACK)",
    "price": "₹2,000",
    "mrp": "₹4,500",
    "image": "/black 4/ChatGPT Image Jul 11, 2026, 02_00_34 PM.png",
    "backImage": "/black 4/ChatGPT Image Jul 11, 2026, 12_50_50 PM.png",
    "description": "Vintage-washed graphic t-shirt featuring 'Dominion of Death' gothic scriptures.",
    "fullDescription": "A statement piece cut from ultra-soft 240 GSM cotton. It features a custom vintage wash, drop shoulder structure, and high-fidelity screenprinting depicting a grim reaper skull graphic alongside gothic scripture: 'Dominion of Death - Longing for yet another chance to live thy life.'",
    "howToUse": [
      "Machine wash cold inside out",
      "Do not bleach",
      "Iron low on reverse side"
    ],
    "sizeScale": [
      {
        "size": "S",
        "chest": "42 in",
        "length": "25.5 in",
        "acrossShoulder": "19.5 in",
        "sleeve": "8.0 in",
        "bottom": "43 in",
        "neckline": "7.5 in"
      },
      {
        "size": "M",
        "chest": "44 in",
        "length": "26.0 in",
        "acrossShoulder": "20.0 in",
        "sleeve": "8.5 in",
        "bottom": "45 in",
        "neckline": "7.5 in"
      },
      {
        "size": "L",
        "chest": "46 in",
        "length": "26.5 in",
        "acrossShoulder": "20.5 in",
        "sleeve": "9.0 in",
        "bottom": "47 in",
        "neckline": "7.5 in"
      },
      {
        "size": "XL",
        "chest": "48 in",
        "length": "27.0 in",
        "acrossShoulder": "21.0 in",
        "sleeve": "9.5 in",
        "bottom": "49 in",
        "neckline": "7.5 in"
      }
    ],
    "details": [
      "Custom acid wash wash treatment",
      "Detailed soft-hand screenprint details",
      "Reinforced shoulder seams",
      "Boxy drop-shoulder silhouette"
    ],
    "fabric": "100% Combed Cotton Jersey",
    "weight": "240 GSM",
    "drop": "DROP 01",
    "category": "Tops",
    "darkImage": "/black 4/ChatGPT Image Jul 11, 2026, 02_00_34 PM.png",
    "lightImage": "/black 4/ChatGPT Image Jul 11, 2026, 02_00_34 PM.png",
    "galleryDark": [
      "/black 4/ChatGPT Image Jul 11, 2026, 12_50_50 PM.png",
      "/black 4/ChatGPT Image Jul 11, 2026, 12_52_59 PM.png",
      "/black 4/ChatGPT Image Jul 11, 2026, 12_58_52 PM.png",
      "/black 4/ChatGPT Image Jul 9, 2026, 05_15_05 PM.png",
      "/black 4/ChatGPT Image Jul 9, 2026, 05_24_51 PM.png"
    ],
    "galleryLight": [
      "/black 4/ChatGPT Image Jul 11, 2026, 12_50_50 PM.png",
      "/black 4/ChatGPT Image Jul 11, 2026, 12_52_59 PM.png",
      "/black 4/ChatGPT Image Jul 11, 2026, 12_58_52 PM.png",
      "/black 4/ChatGPT Image Jul 9, 2026, 05_15_05 PM.png",
      "/black 4/ChatGPT Image Jul 9, 2026, 05_24_51 PM.png"
    ],
    "imagesDark": [
      {
        "id": "product-black-4-dark-img-0",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 02_00_34 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Front View"
      },
      {
        "id": "product-black-4-dark-img-1",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 12_50_50 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Back View"
      },
      {
        "id": "product-black-4-dark-img-2",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 12_52_59 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 1"
      },
      {
        "id": "product-black-4-dark-img-3",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 12_58_52 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 2"
      },
      {
        "id": "product-black-4-dark-img-4",
        "url": "/black 4/ChatGPT Image Jul 9, 2026, 05_15_05 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 3"
      },
      {
        "id": "product-black-4-dark-img-5",
        "url": "/black 4/ChatGPT Image Jul 9, 2026, 05_24_51 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 4"
      }
    ],
    "imagesLight": [
      {
        "id": "product-black-4-light-img-0",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 02_00_34 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Front View"
      },
      {
        "id": "product-black-4-light-img-1",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 12_50_50 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Back View"
      },
      {
        "id": "product-black-4-light-img-2",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 12_52_59 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 1"
      },
      {
        "id": "product-black-4-light-img-3",
        "url": "/black 4/ChatGPT Image Jul 11, 2026, 12_58_52 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 2"
      },
      {
        "id": "product-black-4-light-img-4",
        "url": "/black 4/ChatGPT Image Jul 9, 2026, 05_15_05 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 3"
      },
      {
        "id": "product-black-4-light-img-5",
        "url": "/black 4/ChatGPT Image Jul 9, 2026, 05_24_51 PM.png",
        "alt": "DOMINION OF DEATH TEE (BLACK)",
        "label": "Detail View 4"
      }
    ]
  },
  {
    "id": "product-blue",
    "title": "BEAST RED PRINT TEE",
    "price": "₹2,000",
    "mrp": "₹4,500",
    "image": "/blue/ChatGPT Image Jul 11, 2026, 05_30_19 PM.png",
    "backImage": "/blue/ChatGPT Image Jul 11, 2026, 05_30_25 PM.png",
    "description": "Contrast red-print graphic tee featuring the Beast emblem layout.",
    "fullDescription": "This oversized boxy fit t-shirt features repeated red 'BEAST' text block printing on a dark blue vintage washed cotton jersey. Accented with screenprinted graphics of a perched raven and walking wolf, this piece highlights clean lines and high contrast streetwear design.",
    "howToUse": [
      "Wash cold with similar colors",
      "Do not dry clean",
      "Iron inside out only"
    ],
    "sizeScale": [
      {
        "size": "S",
        "chest": "42 in",
        "length": "25.5 in",
        "acrossShoulder": "19.5 in",
        "sleeve": "8.0 in",
        "bottom": "43 in",
        "neckline": "7.5 in"
      },
      {
        "size": "M",
        "chest": "44 in",
        "length": "26.0 in",
        "acrossShoulder": "20.0 in",
        "sleeve": "8.5 in",
        "bottom": "45 in",
        "neckline": "7.5 in"
      },
      {
        "size": "L",
        "chest": "46 in",
        "length": "26.5 in",
        "acrossShoulder": "20.5 in",
        "sleeve": "9.0 in",
        "bottom": "47 in",
        "neckline": "7.5 in"
      },
      {
        "size": "XL",
        "chest": "48 in",
        "length": "27.0 in",
        "acrossShoulder": "21.0 in",
        "sleeve": "9.5 in",
        "bottom": "49 in",
        "neckline": "7.5 in"
      }
    ],
    "details": [
      "High-contrast repeated 'BEAST' graphic",
      "Raven and wolf illustration screenprint",
      "Durable double-stitched hem",
      "Vintage washed heavy jersey"
    ],
    "fabric": "100% Combed Cotton Jersey",
    "weight": "240 GSM",
    "drop": "DROP 01",
    "category": "Tops",
    "darkImage": "/blue/ChatGPT Image Jul 11, 2026, 05_30_19 PM.png",
    "lightImage": "/blue/ChatGPT Image Jul 11, 2026, 05_30_19 PM.png",
    "galleryDark": [
      "/blue/ChatGPT Image Jul 11, 2026, 05_30_25 PM.png",
      "/blue/ChatGPT Image Jul 11, 2026, 05_39_53 PM.png",
      "/blue/ChatGPT Image Jul 11, 2026, 05_42_20 PM.png",
      "/blue/ChatGPT Image Jul 9, 2026, 05_30_28 PM.png",
      "/blue/ChatGPT Image Jul 9, 2026, 05_43_22 PM.png"
    ],
    "galleryLight": [
      "/blue/ChatGPT Image Jul 11, 2026, 05_30_25 PM.png",
      "/blue/ChatGPT Image Jul 11, 2026, 05_39_53 PM.png",
      "/blue/ChatGPT Image Jul 11, 2026, 05_42_20 PM.png",
      "/blue/ChatGPT Image Jul 9, 2026, 05_30_28 PM.png",
      "/blue/ChatGPT Image Jul 9, 2026, 05_43_22 PM.png"
    ],
    "imagesDark": [
      {
        "id": "product-blue-dark-img-0",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_30_19 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Front View"
      },
      {
        "id": "product-blue-dark-img-1",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_30_25 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Back View"
      },
      {
        "id": "product-blue-dark-img-2",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_39_53 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-blue-dark-img-3",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_42_20 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-blue-dark-img-4",
        "url": "/blue/ChatGPT Image Jul 9, 2026, 05_30_28 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-blue-dark-img-5",
        "url": "/blue/ChatGPT Image Jul 9, 2026, 05_43_22 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 4"
      }
    ],
    "imagesLight": [
      {
        "id": "product-blue-light-img-0",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_30_19 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Front View"
      },
      {
        "id": "product-blue-light-img-1",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_30_25 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Back View"
      },
      {
        "id": "product-blue-light-img-2",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_39_53 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-blue-light-img-3",
        "url": "/blue/ChatGPT Image Jul 11, 2026, 05_42_20 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-blue-light-img-4",
        "url": "/blue/ChatGPT Image Jul 9, 2026, 05_30_28 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-blue-light-img-5",
        "url": "/blue/ChatGPT Image Jul 9, 2026, 05_43_22 PM.png",
        "alt": "BEAST RED PRINT TEE",
        "label": "Detail View 4"
      }
    ]
  },
  {
    "id": "product-red",
    "title": "DOMINION OF DEATH TEE (RED)",
    "price": "₹2,000",
    "mrp": "₹4,500",
    "image": "/red/987037e7-2f37-40b5-83cd-a3cfc54a95bb.png",
    "backImage": "/red/ChatGPT Image Jul 11, 2026, 12_47_21 PM.png",
    "description": "Limited Red Edition of the 'Dominion of Death' gothic print tee.",
    "fullDescription": "A limited run crimson red streetwear tee. Features the classic 'Dominion of Death' skull illustration and gothic scripture layout screenprinted in high-contrast white and cream on our signature 240 GSM heavy combed cotton.",
    "howToUse": [
      "Machine wash cold inside out",
      "Tumble dry low",
      "Iron warm on reverse"
    ],
    "sizeScale": [
      {
        "size": "S",
        "chest": "42 in",
        "length": "25.5 in",
        "acrossShoulder": "19.5 in",
        "sleeve": "8.0 in",
        "bottom": "43 in",
        "neckline": "7.5 in"
      },
      {
        "size": "M",
        "chest": "44 in",
        "length": "26.0 in",
        "acrossShoulder": "20.0 in",
        "sleeve": "8.5 in",
        "bottom": "45 in",
        "neckline": "7.5 in"
      },
      {
        "size": "L",
        "chest": "46 in",
        "length": "26.5 in",
        "acrossShoulder": "20.5 in",
        "sleeve": "9.0 in",
        "bottom": "47 in",
        "neckline": "7.5 in"
      },
      {
        "size": "XL",
        "chest": "48 in",
        "length": "27.0 in",
        "acrossShoulder": "21.0 in",
        "sleeve": "9.5 in",
        "bottom": "49 in",
        "neckline": "7.5 in"
      }
    ],
    "details": [
      "Limited crimson red dye way",
      "High density white and cream screenprint",
      "Oversized boxy fit",
      "Pre-shrunk to retain shape"
    ],
    "fabric": "100% Combed Cotton Jersey",
    "weight": "240 GSM",
    "drop": "DROP 01",
    "category": "Tops",
    "darkImage": "/red/987037e7-2f37-40b5-83cd-a3cfc54a95bb.png",
    "lightImage": "/red/987037e7-2f37-40b5-83cd-a3cfc54a95bb.png",
    "galleryDark": [
      "/red/ChatGPT Image Jul 11, 2026, 12_47_21 PM.png",
      "/red/ChatGPT Image Jul 13, 2026, 03_31_58 PM.png",
      "/red/ChatGPT Image Jul 13, 2026, 03_32_14 PM.png",
      "/red/ChatGPT Image Jul 9, 2026, 05_14_32 PM.png",
      "/red/ChatGPT Image Jul 9, 2026, 05_23_06 PM.png"
    ],
    "galleryLight": [
      "/red/ChatGPT Image Jul 11, 2026, 12_47_21 PM.png",
      "/red/ChatGPT Image Jul 13, 2026, 03_31_58 PM.png",
      "/red/ChatGPT Image Jul 13, 2026, 03_32_14 PM.png",
      "/red/ChatGPT Image Jul 9, 2026, 05_14_32 PM.png",
      "/red/ChatGPT Image Jul 9, 2026, 05_23_06 PM.png"
    ],
    "imagesDark": [
      {
        "id": "product-red-dark-img-0",
        "url": "/red/987037e7-2f37-40b5-83cd-a3cfc54a95bb.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Front View"
      },
      {
        "id": "product-red-dark-img-1",
        "url": "/red/ChatGPT Image Jul 11, 2026, 12_47_21 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Back View"
      },
      {
        "id": "product-red-dark-img-2",
        "url": "/red/ChatGPT Image Jul 13, 2026, 03_31_58 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 1"
      },
      {
        "id": "product-red-dark-img-3",
        "url": "/red/ChatGPT Image Jul 13, 2026, 03_32_14 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 2"
      },
      {
        "id": "product-red-dark-img-4",
        "url": "/red/ChatGPT Image Jul 9, 2026, 05_14_32 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 3"
      },
      {
        "id": "product-red-dark-img-5",
        "url": "/red/ChatGPT Image Jul 9, 2026, 05_23_06 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 4"
      }
    ],
    "imagesLight": [
      {
        "id": "product-red-light-img-0",
        "url": "/red/987037e7-2f37-40b5-83cd-a3cfc54a95bb.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Front View"
      },
      {
        "id": "product-red-light-img-1",
        "url": "/red/ChatGPT Image Jul 11, 2026, 12_47_21 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Back View"
      },
      {
        "id": "product-red-light-img-2",
        "url": "/red/ChatGPT Image Jul 13, 2026, 03_31_58 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 1"
      },
      {
        "id": "product-red-light-img-3",
        "url": "/red/ChatGPT Image Jul 13, 2026, 03_32_14 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 2"
      },
      {
        "id": "product-red-light-img-4",
        "url": "/red/ChatGPT Image Jul 9, 2026, 05_14_32 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 3"
      },
      {
        "id": "product-red-light-img-5",
        "url": "/red/ChatGPT Image Jul 9, 2026, 05_23_06 PM.png",
        "alt": "DOMINION OF DEATH TEE (RED)",
        "label": "Detail View 4"
      }
    ]
  },
  {
    "id": "product-white-1",
    "title": "MORBID PERSONALITY TEE",
    "price": "₹2,000",
    "mrp": "₹4,500",
    "image": "/white 1/ChatGPT Image Jul 11, 2026, 02_18_09 PM.png",
    "backImage": "/white 1/ChatGPT Image Jul 11, 2026, 02_20_12 PM.png",
    "description": "Heavyweight white tee featuring the 'Morbid Personality' artwork print.",
    "fullDescription": "A clean off-white heavy cotton jersey tee featuring drop shoulders and a premium drape. The center back graphic shows a detailed sketch-work character design coupled with high-contrast red scripture printing: 'Shall we say morbid personality'.",
    "howToUse": [
      "Wash cold inside out",
      "Tumble dry low",
      "Do not iron print directly"
    ],
    "sizeScale": [
      {
        "size": "S",
        "chest": "42 in",
        "length": "25.5 in",
        "acrossShoulder": "19.5 in",
        "sleeve": "8.0 in",
        "bottom": "43 in",
        "neckline": "7.5 in"
      },
      {
        "size": "M",
        "chest": "44 in",
        "length": "26.0 in",
        "acrossShoulder": "20.0 in",
        "sleeve": "8.5 in",
        "bottom": "45 in",
        "neckline": "7.5 in"
      },
      {
        "size": "L",
        "chest": "46 in",
        "length": "26.5 in",
        "acrossShoulder": "20.5 in",
        "sleeve": "9.0 in",
        "bottom": "47 in",
        "neckline": "7.5 in"
      },
      {
        "size": "XL",
        "chest": "48 in",
        "length": "27.0 in",
        "acrossShoulder": "21.0 in",
        "sleeve": "9.5 in",
        "bottom": "49 in",
        "neckline": "7.5 in"
      }
    ],
    "details": [
      "Premium off-white dye way",
      "Red script and sketch character print",
      "Comfortable wide-shoulder silhouette",
      "Thick tight crewneck rib"
    ],
    "fabric": "100% Heavy Combed Cotton",
    "weight": "240 GSM",
    "drop": "DROP 01",
    "category": "Tops",
    "darkImage": "/white 1/ChatGPT Image Jul 11, 2026, 02_18_09 PM.png",
    "lightImage": "/white 1/ChatGPT Image Jul 11, 2026, 02_18_09 PM.png",
    "galleryDark": [
      "/white 1/ChatGPT Image Jul 11, 2026, 02_20_12 PM.png",
      "/white 1/ChatGPT Image Jul 11, 2026, 02_33_39 PM.png",
      "/white 1/ChatGPT Image Jul 11, 2026, 02_38_56 PM.png",
      "/white 1/ChatGPT Image Jul 9, 2026, 05_26_52 PM.png",
      "/white 1/ChatGPT Image Jul 9, 2026, 05_27_12 PM.png"
    ],
    "galleryLight": [
      "/white 1/ChatGPT Image Jul 11, 2026, 02_20_12 PM.png",
      "/white 1/ChatGPT Image Jul 11, 2026, 02_33_39 PM.png",
      "/white 1/ChatGPT Image Jul 11, 2026, 02_38_56 PM.png",
      "/white 1/ChatGPT Image Jul 9, 2026, 05_26_52 PM.png",
      "/white 1/ChatGPT Image Jul 9, 2026, 05_27_12 PM.png"
    ],
    "imagesDark": [
      {
        "id": "product-white-1-dark-img-0",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_18_09 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Front View"
      },
      {
        "id": "product-white-1-dark-img-1",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_20_12 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Back View"
      },
      {
        "id": "product-white-1-dark-img-2",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_33_39 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-white-1-dark-img-3",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_38_56 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-white-1-dark-img-4",
        "url": "/white 1/ChatGPT Image Jul 9, 2026, 05_26_52 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-white-1-dark-img-5",
        "url": "/white 1/ChatGPT Image Jul 9, 2026, 05_27_12 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 4"
      }
    ],
    "imagesLight": [
      {
        "id": "product-white-1-light-img-0",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_18_09 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Front View"
      },
      {
        "id": "product-white-1-light-img-1",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_20_12 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Back View"
      },
      {
        "id": "product-white-1-light-img-2",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_33_39 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-white-1-light-img-3",
        "url": "/white 1/ChatGPT Image Jul 11, 2026, 02_38_56 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-white-1-light-img-4",
        "url": "/white 1/ChatGPT Image Jul 9, 2026, 05_26_52 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-white-1-light-img-5",
        "url": "/white 1/ChatGPT Image Jul 9, 2026, 05_27_12 PM.png",
        "alt": "MORBID PERSONALITY TEE",
        "label": "Detail View 4"
      }
    ]
  },
  {
    "id": "product-white-2",
    "title": "VIGILANTE SCRIP TEE",
    "price": "₹2,000",
    "mrp": "₹4,500",
    "image": "/white 2/ChatGPT Image Jul 11, 2026, 05_08_07 PM.png",
    "backImage": "/white 2/ChatGPT Image Jul 11, 2026, 05_10_25 PM.png",
    "description": "Off-white script graphic tee featuring 'Vigilante' print.",
    "fullDescription": "An artistic graphic tee presenting a collage of handwriting script overlays, abstract ink splatters, and a central surrealist character. Framed with red prints reading 'VIGILANTE' and 'Call me crazy but there is something terribly wrong with this world!'.",
    "howToUse": [
      "Wash cold inside out",
      "Hang dry recommended",
      "Iron low on reverse"
    ],
    "sizeScale": [
      {
        "size": "S",
        "chest": "42 in",
        "length": "25.5 in",
        "acrossShoulder": "19.5 in",
        "sleeve": "8.0 in",
        "bottom": "43 in",
        "neckline": "7.5 in"
      },
      {
        "size": "M",
        "chest": "44 in",
        "length": "26.0 in",
        "acrossShoulder": "20.0 in",
        "sleeve": "8.5 in",
        "bottom": "45 in",
        "neckline": "7.5 in"
      },
      {
        "size": "L",
        "chest": "46 in",
        "length": "26.5 in",
        "acrossShoulder": "20.5 in",
        "sleeve": "9.0 in",
        "bottom": "47 in",
        "neckline": "7.5 in"
      },
      {
        "size": "XL",
        "chest": "48 in",
        "length": "27.0 in",
        "acrossShoulder": "21.0 in",
        "sleeve": "9.5 in",
        "bottom": "49 in",
        "neckline": "7.5 in"
      }
    ],
    "details": [
      "Surrealist ink splatter character artwork",
      "Detailed cursive script background print",
      "Red VIGILANTE block letters",
      "Premium boxy fit with clean seams"
    ],
    "fabric": "100% Heavy Combed Cotton",
    "weight": "240 GSM",
    "drop": "DROP 01",
    "category": "Tops",
    "darkImage": "/white 2/ChatGPT Image Jul 11, 2026, 05_08_07 PM.png",
    "lightImage": "/white 2/ChatGPT Image Jul 11, 2026, 05_08_07 PM.png",
    "galleryDark": [
      "/white 2/ChatGPT Image Jul 11, 2026, 05_10_25 PM.png",
      "/white 2/ChatGPT Image Jul 11, 2026, 05_18_12 PM.png",
      "/white 2/ChatGPT Image Jul 11, 2026, 05_20_23 PM.png",
      "/white 2/ChatGPT Image Jul 9, 2026, 05_33_48 PM.png",
      "/white 2/ChatGPT Image Jul 9, 2026, 05_34_34 PM.png"
    ],
    "galleryLight": [
      "/white 2/ChatGPT Image Jul 11, 2026, 05_10_25 PM.png",
      "/white 2/ChatGPT Image Jul 11, 2026, 05_18_12 PM.png",
      "/white 2/ChatGPT Image Jul 11, 2026, 05_20_23 PM.png",
      "/white 2/ChatGPT Image Jul 9, 2026, 05_33_48 PM.png",
      "/white 2/ChatGPT Image Jul 9, 2026, 05_34_34 PM.png"
    ],
    "imagesDark": [
      {
        "id": "product-white-2-dark-img-0",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_08_07 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Front View"
      },
      {
        "id": "product-white-2-dark-img-1",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_10_25 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Back View"
      },
      {
        "id": "product-white-2-dark-img-2",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_18_12 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-white-2-dark-img-3",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_20_23 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-white-2-dark-img-4",
        "url": "/white 2/ChatGPT Image Jul 9, 2026, 05_33_48 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-white-2-dark-img-5",
        "url": "/white 2/ChatGPT Image Jul 9, 2026, 05_34_34 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 4"
      }
    ],
    "imagesLight": [
      {
        "id": "product-white-2-light-img-0",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_08_07 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Front View"
      },
      {
        "id": "product-white-2-light-img-1",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_10_25 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Back View"
      },
      {
        "id": "product-white-2-light-img-2",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_18_12 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 1"
      },
      {
        "id": "product-white-2-light-img-3",
        "url": "/white 2/ChatGPT Image Jul 11, 2026, 05_20_23 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 2"
      },
      {
        "id": "product-white-2-light-img-4",
        "url": "/white 2/ChatGPT Image Jul 9, 2026, 05_33_48 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 3"
      },
      {
        "id": "product-white-2-light-img-5",
        "url": "/white 2/ChatGPT Image Jul 9, 2026, 05_34_34 PM.png",
        "alt": "VIGILANTE SCRIP TEE",
        "label": "Detail View 4"
      }
    ]
  }
];
