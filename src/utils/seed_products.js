import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, deleteDoc, collection } from "firebase/firestore";
import fs from "fs";
import path from "path";

const firebaseConfig = {
  apiKey: "AIzaSyB_fEsZnpBV4zvLgtNOGuANZUfx8dNdDcI",
  authDomain: "ghubor-1f905.firebaseapp.com",
  projectId: "ghubor-1f905",
  storageBucket: "ghubor-1f905.appspot.com",
  messagingSenderId: "814996938757",
  appId: "1:814996938757:web:b7197d1738e32585dabc6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Folders relative to the public directory
const publicDir = path.resolve("public");

const foldersMap = {
  "black 1": {
    title: "REACHING FOR THE IMPOSSIBLE TEE",
    price: "₹2,000",
    mrp: "₹4,500",
    description: "Premium heavy-weight graphic tee with 'Reaching For The Impossible' print.",
    fullDescription: "An oversized streetwear tee cut from heavy 240 GSM combed cotton. Features a vintage acid-washed look with a large screenprinted illustration on the back depicting the lunar ship voyage with the gothic scripture text 'Reaching For The Impossible - Achieve Your Dreams'.",
    fabric: "100% Combed Cotton Jersey",
    weight: "240 GSM",
    category: "Tops",
    details: [
      "Distressed vintage wash effect",
      "High density graphic screenprint",
      "Thick 1.2-inch collar ribbing",
      "Oversized boxy streetwear fit"
    ],
    howToUse: [
      "Wash cold inside out",
      "Tumble dry low or hang dry",
      "Iron low inside out"
    ]
  },
  "black 4": {
    title: "DOMINION OF DEATH TEE (BLACK)",
    price: "₹2,000",
    mrp: "₹4,500",
    description: "Vintage-washed graphic t-shirt featuring 'Dominion of Death' gothic scriptures.",
    fullDescription: "A statement piece cut from ultra-soft 240 GSM cotton. It features a custom vintage wash, drop shoulder structure, and high-fidelity screenprinting depicting a grim reaper skull graphic alongside gothic scripture: 'Dominion of Death - Longing for yet another chance to live thy life.'",
    fabric: "100% Combed Cotton Jersey",
    weight: "240 GSM",
    category: "Tops",
    details: [
      "Custom acid wash wash treatment",
      "Detailed soft-hand screenprint details",
      "Reinforced shoulder seams",
      "Boxy drop-shoulder silhouette"
    ],
    howToUse: [
      "Machine wash cold inside out",
      "Do not bleach",
      "Iron low on reverse side"
    ]
  },
  "blue": {
    title: "BEAST RED PRINT TEE",
    price: "₹2,000",
    mrp: "₹4,500",
    description: "Contrast red-print graphic tee featuring the Beast emblem layout.",
    fullDescription: "This oversized boxy fit t-shirt features repeated red 'BEAST' text block printing on a dark blue vintage washed cotton jersey. Accented with screenprinted graphics of a perched raven and walking wolf, this piece highlights clean lines and high contrast streetwear design.",
    fabric: "100% Combed Cotton Jersey",
    weight: "240 GSM",
    category: "Tops",
    details: [
      "High-contrast repeated 'BEAST' graphic",
      "Raven and wolf illustration screenprint",
      "Durable double-stitched hem",
      "Vintage washed heavy jersey"
    ],
    howToUse: [
      "Wash cold with similar colors",
      "Do not dry clean",
      "Iron inside out only"
    ]
  },
  "red": {
    title: "DOMINION OF DEATH TEE (RED)",
    price: "₹2,000",
    mrp: "₹4,500",
    description: "Limited Red Edition of the 'Dominion of Death' gothic print tee.",
    fullDescription: "A limited run crimson red streetwear tee. Features the classic 'Dominion of Death' skull illustration and gothic scripture layout screenprinted in high-contrast white and cream on our signature 240 GSM heavy combed cotton.",
    fabric: "100% Combed Cotton Jersey",
    weight: "240 GSM",
    category: "Tops",
    details: [
      "Limited crimson red dye way",
      "High density white and cream screenprint",
      "Oversized boxy fit",
      "Pre-shrunk to retain shape"
    ],
    howToUse: [
      "Machine wash cold inside out",
      "Tumble dry low",
      "Iron warm on reverse"
    ]
  },
  "white 1": {
    title: "MORBID PERSONALITY TEE",
    price: "₹2,000",
    mrp: "₹4,500",
    description: "Heavyweight white tee featuring the 'Morbid Personality' artwork print.",
    fullDescription: "A clean off-white heavy cotton jersey tee featuring drop shoulders and a premium drape. The center back graphic shows a detailed sketch-work character design coupled with high-contrast red scripture printing: 'Shall we say morbid personality'.",
    fabric: "100% Heavy Combed Cotton",
    weight: "240 GSM",
    category: "Tops",
    details: [
      "Premium off-white dye way",
      "Red script and sketch character print",
      "Comfortable wide-shoulder silhouette",
      "Thick tight crewneck rib"
    ],
    howToUse: [
      "Wash cold inside out",
      "Tumble dry low",
      "Do not iron print directly"
    ]
  },
  "white 2": {
    title: "VIGILANTE SCRIP TEE",
    price: "₹2,000",
    mrp: "₹4,500",
    description: "Off-white script graphic tee featuring 'Vigilante' print.",
    fullDescription: "An artistic graphic tee presenting a collage of handwriting script overlays, abstract ink splatters, and a central surrealist character. Framed with red prints reading 'VIGILANTE' and 'Call me crazy but there is something terribly wrong with this world!'.",
    fabric: "100% Heavy Combed Cotton",
    weight: "240 GSM",
    category: "Tops",
    details: [
      "Surrealist ink splatter character artwork",
      "Detailed cursive script background print",
      "Red VIGILANTE block letters",
      "Premium boxy fit with clean seams"
    ],
    howToUse: [
      "Wash cold inside out",
      "Hang dry recommended",
      "Iron low on reverse"
    ]
  }
};

async function seed() {
  console.log("Seeding and cleaning database...");
  
  const allowedIds = Object.keys(foldersMap).map(folderName => `product-${folderName.replace(/\s+/g, "-")}`);
  console.log("Allowed Product IDs:", allowedIds);

  // 1. Delete all other products in Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "cms-products"));
    console.log(`Found ${querySnapshot.size} total products in database.`);
    for (const d of querySnapshot.docs) {
      if (!allowedIds.includes(d.id)) {
        console.log(`Deleting obsolete product: ${d.data().title || d.id} (${d.id})`);
        await deleteDoc(doc(db, "cms-products", d.id));
      }
    }
  } catch (err) {
    console.error("Failed to fetch/delete old products:", err);
  }

  // 2. Add or update the 6 target products
  for (const [folderName, metadata] of Object.entries(foldersMap)) {
    const folderPath = path.join(publicDir, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.warn(`Folder not found: ${folderPath}. Skipping...`);
      continue;
    }
    
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".webp"));
    
    if (files.length === 0) {
      console.warn(`No image files in folder: ${folderName}. Skipping...`);
      continue;
    }
    
    const primaryImage = `/${folderName}/${files[0]}`;
    const gallery = files.slice(1).map(file => `/${folderName}/${file}`);
    
    const productId = `product-${folderName.replace(/\s+/g, "-")}`;
    
    const teeSizeScale = [
      { size: "S", chest: "42 in", length: "25.5 in", acrossShoulder: "19.5 in", sleeve: "8.0 in", bottom: "43 in", neckline: "7.5 in" },
      { size: "M", chest: "44 in", length: "26.0 in", acrossShoulder: "20.0 in", sleeve: "8.5 in", bottom: "45 in", neckline: "7.5 in" },
      { size: "L", chest: "46 in", length: "26.5 in", acrossShoulder: "20.5 in", sleeve: "9.0 in", bottom: "47 in", neckline: "7.5 in" },
      { size: "XL", chest: "48 in", length: "27.0 in", acrossShoulder: "21.0 in", sleeve: "9.5 in", bottom: "49 in", neckline: "7.5 in" }
    ];

    const productData = {
      id: productId,
      title: metadata.title,
      price: metadata.price,
      mrp: metadata.mrp,
      description: metadata.description,
      fullDescription: metadata.fullDescription,
      fabric: metadata.fabric,
      weight: metadata.weight,
      drop: "DROP 01",
      category: metadata.category,
      darkImage: primaryImage,
      lightImage: primaryImage,
      galleryDark: gallery,
      galleryLight: gallery,
      details: metadata.details,
      howToUse: metadata.howToUse,
      sizeScale: teeSizeScale,
      featured: true,
      published: true,
      order: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    try {
      const ref = doc(db, "cms-products", productId);
      await setDoc(ref, productData);
      console.log(`Successfully saved product: ${metadata.title} (Price: ${metadata.price}, MRP: ${metadata.mrp})`);
    } catch (e) {
      console.error(`Failed to save product ${metadata.title}:`, e);
    }
  }
  
  console.log("Database seeding & cleanup completed successfully!");
  process.exit(0);
}

seed();
