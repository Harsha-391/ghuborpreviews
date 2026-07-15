export interface SizeMeasurement {
  size: string;
  chest?: string;
  length: string;
  sleeve?: string;
  waist?: string;
  inseam?: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  mrp?: string;
  image: string;
  backImage?: string; // Optional back view image for formal presentation
  description: string;
  fullDescription: string;
  howToUse: string[];
  sizeScale: SizeMeasurement[];
  details: string[];
  fabric: string;
  weight: string;
  drop: string;
  category?: string;
}

export const products: Product[] = [
  {
    id: "hoodie",
    title: "SACRED SHIELD HOODIE",
    price: "₹6,800",
    image: "/images/products/hoodie.png",
    backImage: "/images/products/hoodie-back.png",
    description: "Armor forged in 480GSM French terry. Features subtle oxblood blackletter scriptural embroidery on the chest and custom back print.",
    fullDescription: "Constructed as a physical barrier for modern battles. This heavyweight hoodie features a double-layered hood, dropped shoulders, and a custom hand-numbered tag near the hem. The custom oxblood embroidery is made with high-density thread, creating a raised scripture texture that you can feel under your fingertips.",
    howToUse: [
      "Wear as a protective outer layer during cold hours or silent reflection.",
      "Pair with washed black denim or the Sanctuary Work Pants for a complete silhouette.",
      "Dry clean only to preserve the structural weight and embroidery sheen."
    ],
    sizeScale: [
      { size: "S", chest: "48 inches", length: "27 inches", sleeve: "24.5 inches" },
      { size: "M", chest: "50 inches", length: "28 inches", sleeve: "25 inches" },
      { size: "L", chest: "52 inches", length: "29 inches", sleeve: "25.5 inches" },
      { size: "XL", chest: "54 inches", length: "30 inches", sleeve: "26 inches" }
    ],
    details: [
      "480GSM 100% Organic Cotton French Terry",
      "Signature oxblood scriptural chest embroidery",
      "Hand-numbered interior drop tag (Limited to 64 pieces)",
      "Ribbed side panels for active comfort",
      "Made in India, finished in the sanctuary"
    ],
    fabric: "100% Organic Cotton French Terry",
    weight: "480 GSM",
    drop: "DROP 01"
  },
  {
    id: "jacket",
    title: "SILENT BATTLE FIELD JACKET",
    price: "₹11,200",
    image: "/images/products/jacket.png",
    backImage: "/images/products/jacket-back.png",
    description: "Heavy raw canvas field jacket in washed obsidian. Inner lining printed with private scripture entries.",
    fullDescription: "A structure designed to endure. Built from double-weave 14oz raw cotton canvas, this field jacket features a concealed metallic zipper, storm flap, and four modular utility pockets. The interior is fully lined with a lightweight silk-cotton blend printed with handwritten scripture fragments, keeping the armor's meaning private to the wearer.",
    howToUse: [
      "Layer over the Modern Gibbor Longsleeve for transition weather.",
      "Adjust the internal drawcords at the waist for a cinched, defensive posture.",
      "Wipe clean with a damp cloth; iron on low if canvas stiffness softens."
    ],
    sizeScale: [
      { size: "S", chest: "46 inches", length: "28.5 inches", sleeve: "24.5 inches" },
      { size: "M", chest: "48 inches", length: "29.5 inches", sleeve: "25 inches" },
      { size: "L", chest: "50 inches", length: "30.5 inches", sleeve: "25.5 inches" },
      { size: "XL", chest: "52 inches", length: "31.5 inches", sleeve: "26 inches" }
    ],
    details: [
      "14oz Heavy Double-Weave Raw Cotton Canvas",
      "Custom silk-cotton inner lining with scriptural print",
      "Concealed heavy-duty metallic zippers and snap buttons",
      "Interior breast pocket with hand-signed identification card",
      "Gothic glyph signature patch on the back collar"
    ],
    fabric: "14oz Raw Cotton Canvas / Silk-Cotton lining",
    weight: "Heavyweight Double-Weave",
    drop: "DROP 01"
  },
  {
    id: "longsleeve",
    title: "MODERN GIBBOR MOCKNECK",
    price: "₹4,500",
    image: "/images/products/longsleeve.png",
    backImage: "/images/products/longsleeve-back.png",
    description: "Dense knit mockneck longsleeve. Ribbed collar and cuffs with crimson scripture-like fragments on the sleeves.",
    fullDescription: "A second skin for daily wear. Made from high-gauge, long-staple combed cotton with 5% elastane for slight recovery. Features a high mockneck structure that holds its form after washing, accented by deep crimson scriptural prints along the sleeve seams, referencing silent endurance.",
    howToUse: [
      "Tuck loosely into trousers or wear untucked for a relaxed, elongated drape.",
      "Use as the baseline base-layer under the Field Jacket.",
      "Machine wash cold inside out; air dry flat to prevent shrinkage."
    ],
    sizeScale: [
      { size: "S", chest: "40 inches", length: "26.5 inches", sleeve: "25 inches" },
      { size: "M", chest: "42 inches", length: "27.5 inches", sleeve: "25.5 inches" },
      { size: "L", chest: "44 inches", length: "28.5 inches", sleeve: "26 inches" },
      { size: "XL", chest: "46 inches", length: "29.5 inches", sleeve: "26.5 inches" }
    ],
    details: [
      "320GSM High-gauge Combed Cotton (95% Cotton, 5% Elastane)",
      "High mockneck collar with reinforced double-stitch",
      "Screen-printed crimson scripture fragments on both sleeves",
      "Signature glyph tab on the left hemline",
      "Pre-shrunk and silicone washed for a soft feel"
    ],
    fabric: "95% Combed Cotton, 5% Elastane",
    weight: "320 GSM",
    drop: "DROP 01"
  },
  {
    id: "pants",
    title: "SANCTUARY WORK PANTS",
    price: "₹7,500",
    image: "/images/products/pants.png",
    description: "Double-knee utility pants in washed charcoal raw denim. Subtle gothic cross embroidery on back pockets.",
    fullDescription: "Pants constructed for labor and ritual. Crafted from 13.5oz washed charcoal Japanese selvage denim, these work pants feature reinforced double-panels at the knees, triple-stitch construction, and a straight-leg relaxed fit. Detailed with a subtle gothic cross embroidery on the back pockets in matte black thread.",
    howToUse: [
      "Wear low on the hip, letting the straight legs stack naturally over boots.",
      "Utilize the side hammer-loop for utility or let it hang for a classic workwear drape.",
      "Wash sparingly; raw denim conforms to your movements over time."
    ],
    sizeScale: [
      { size: "S", waist: "30 inches", inseam: "30 inches", length: "41 inches" },
      { size: "M", waist: "32 inches", inseam: "31 inches", length: "42 inches" },
      { size: "L", waist: "34 inches", inseam: "32 inches", length: "43 inches" },
      { size: "XL", waist: "36 inches", inseam: "32 inches", length: "44 inches" }
    ],
    details: [
      "13.5oz washed Japanese Selvage Raw Denim",
      "Reinforced double-knee panels with rivets",
      "Matte black gothic cross embroidery on back pockets",
      "Custom branded copper hardware with oxblood finish",
      "Hand-numbered leather patch on waistband"
    ],
    fabric: "13.5oz Japanese Selvage Denim",
    weight: "Medium-Heavy",
    drop: "DROP 01"
  },
  {
    id: "tshirt",
    title: "SCRIPTURE FRAGMENT TEE",
    price: "₹3,800",
    image: "/images/products/tshirt.png",
    backImage: "/images/products/tshirt-back.png",
    description: "300GSM carded cotton t-shirt in vintage black. Slightly distressed collar and gothic chest print.",
    fullDescription: "The essential shirt of the modern Gibbor. Made from extremely heavy 300GSM carded cotton, this tee is cut in a boxy, oversized fit. It features minor distressed detailing along the collar, hem, and sleeve cuffs, giving it a lived-in, archival feel. The chest is printed with a bold gothic typography text.",
    howToUse: [
      "An easy standalone statement piece when paired with the Sanctuary Work Pants.",
      "Size down for a regular fit, or keep your normal size for the intended oversized look.",
      "Wash cold inside out; iron graphic on reverse side only."
    ],
    sizeScale: [
      { size: "S", chest: "46 inches", length: "26.5 inches" },
      { size: "M", chest: "48 inches", length: "27.5 inches" },
      { size: "L", chest: "50 inches", length: "28.5 inches" },
      { size: "XL", chest: "52 inches", length: "29.5 inches" }
    ],
    details: [
      "300GSM Carded Cotton jersey",
      "Boxy fit, dropped shoulders, thick collar rib",
      "Distressed collars and edges for vintage look",
      "Gothic blackletter graphic print on chest",
      "Silicon washed for maximum softness and drape"
    ],
    fabric: "100% Carded Cotton Jersey",
    weight: "300 GSM",
    drop: "DROP 01"
  },
  {
    id: "cap",
    title: "FAITH CALLIGRAPHY CAP",
    price: "₹2,600",
    image: "/images/products/cap.png",
    description: "Unstructured 6-panel canvas cap in washed black, featuring detailed red gothic embroidery.",
    fullDescription: "A crown of quiet defiance. This 6-panel unstructured cap is made from washed cotton canvas and features detailed calligraphy embroidery across the front panels in rich oxblood red thread. Complete with a self-fabric strap and an antique brass buckle adjustment.",
    howToUse: [
      "Use the brass adjustment clip to secure a snug fit.",
      "Pairs seamlessly with any outfit in the collection to pull together the gothic motif.",
      "Hand wash cold to preserve the embroidery tension and unstructured shape."
    ],
    sizeScale: [
      { size: "One Size", chest: "Adjustable (54-61 cm circumference)", length: "6-panel profile" }
    ],
    details: [
      "Washed 100% Cotton Canvas fabric",
      "Detailed oxblood gothic calligraphy embroidery on front",
      "Unstructured crown with pre-curved visor",
      "Self-fabric strapback with antique brass clamp",
      "Inner label featuring drop information (DROP 01)"
    ],
    fabric: "100% Cotton Canvas",
    weight: "Lightweight, unstructured",
    drop: "DROP 01"
  }
];
