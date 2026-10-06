import { PatentedFarm } from '../types';

export const PATENTED_FARMS: Record<string, PatentedFarm> = {
  'farm-devanahalli': {
    id: 'farm-devanahalli',
    name: 'Devanahalli Bio-Hydroponics Reserve',
    patentNumber: 'IN-PAT-KA-2024-09B',
    patentTitle: 'Zero-Runoff Bio-Film Closed Hydroponic Nutrient Loop',
    location: 'Chikkaballapura Ridge, North Bengaluru',
    altitudeMeters: 920,
    soilType: 'Sterilized Volcanic Pumice & Coconut Fiber Substrate',
    establishedYear: 2014,
    certificationNumber: 'NPOP/NAB/0014-BIO',
    certifications: ['Jaivik Bharat', 'NPOP India Organic', 'SGS Zero Residue Certified', 'Global GAP'],
    description:
      'Pioneering zero-pesticide vertical biome using cold-filtered rainwater and natural bio-fermented plant nutrients. Vegetables are nurtured under filtered mountain sunlight with continuous water monitoring.',
    heroImage:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Dr. Vasant Gowda',
      title: 'Senior Agronomist & Ex-ICAR Bio-Research Scientist',
      experienceYears: 26,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote:
        'Living greens must never be sprayed with synthetic poison. We mimic natural mountain stream hydrology to yield crisp, enzyme-rich produce.',
    },
    awards: [
      {
        id: 'award-zero-chem-2026',
        title: 'Community Zero-Chemical Vanguard 2026',
        year: '2026',
        icon: '🏆',
        category: 'Zero Synthetic Residue',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Achieved verified 0.000 ppm pesticide and nitrate residue across 24 independent quarterly laboratory tests.',
      },
      {
        id: 'award-clean-water-2025',
        title: 'Cleanest Water Hydro-Shield Award 2025',
        year: '2025',
        icon: '🥇',
        category: '100% Rainwater Closed Loop',
        issuer: 'Awarded by Community App Sustainability Board',
        description: 'Recognized for saving 94% fresh water compared to conventional open-field spinach farming.',
      },
      {
        id: 'award-nutrient-2026',
        title: 'Community Gold Harvest Excellence 2026',
        year: '2026',
        icon: '🎖️',
        category: 'Customer Freshness Score',
        issuer: 'Awarded by 3,400+ Gated Society Residents on Community App',
        description: 'Voted 4.96 / 5.0 for leaf crispness and prolonged refrigerator shelf-life.',
      },
    ],
    growingMethods: [
      '100% Closed-Loop Recirculating Mountain Water',
      'Zero Synthetic Pesticides or Herbicides',
      'Biological Pest Control using Ladybugs & Neem Biome',
      'Triple Pre-Cooled at 4°C within 30 mins of Dawn Harvest',
    ],
    carbonNegativeRating: 'A+ (Consumes 4.8 tons CO2 / Acre / Year)',
  },

  'farm-kolar': {
    id: 'farm-kolar',
    name: 'Kolar Living-Soil Bio-Reserve',
    patentNumber: 'IN-PAT-KA-2022-41A',
    patentTitle: 'Regenerative Mycorrhizal Fungal Inoculation & Organic Trellising',
    location: 'Kolar Agro-Corridor, Karnataka',
    altitudeMeters: 840,
    soilType: 'Red Laterite Enriched with Desi Cow Dung Jeevamrutha',
    establishedYear: 2008,
    certificationNumber: 'NPOP/NAB/0029-ORG',
    certifications: ['Jaivik Bharat', 'NPOP India Organic', 'Aditi Organic Cert'],
    description:
      'A sprawling 45-acre regenerative farm where indigenous Nati country tomatoes grow on bamboo stakes. The soil is enriched with cultured microbial teas, yielding high-lycopene tomatoes with traditional sweet-tangy flavor.',
    heroImage:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Anand & Geetha Murthy',
      title: 'Regenerative Soil Agronomists & Heirloom Seed Guardians',
      experienceYears: 28,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      quote:
        'Feed the soil, not the plant. When soil biology is alive with trillions of beneficial microbes, tomatoes naturally resist pests and taste extraordinary.',
    },
    awards: [
      {
        id: 'award-soil-hero-2026',
        title: 'Community Golden Soil Hero 2026',
        year: '2026',
        icon: '🏆',
        category: 'Regenerative Carbon Farming',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Increased organic soil carbon by 3.2% while completely eliminating synthetic NPK chemicals.',
      },
      {
        id: 'award-lycopene-2025',
        title: 'Highest Natural Lycopene Award 2025',
        year: '2025',
        icon: '🥇',
        category: 'Nutritional Density',
        issuer: 'Awarded by Community App Bio-Lab Partner',
        description: 'Tested 42% higher in antioxidant lycopene than commercial hybrid mandi tomatoes.',
      },
    ],
    growingMethods: [
      'Pure Indigenous Desi Gir Cow Dung Jeevamrutha',
      'Heirloom Nati Non-Hybrid Indigenous Seeds',
      'Multi-Tier Companion Crop Planting with Marigolds',
      'Wooden Crate Cushion Transport (Zero Polybags)',
    ],
    carbonNegativeRating: 'A+ (Absorbs 3.9 tons CO2 / Acre)',
  },

  'farm-thanedar': {
    id: 'farm-thanedar',
    name: 'Thanedar Royal High-Altitude Biome',
    patentNumber: 'IN-PAT-HP-2023-77C',
    patentTitle: 'Natural Cold-Slope Bio-Mulch & Waxless Solar Air-Cure System',
    location: 'Thanedar Ridge, Shimla Foothills (7,500 ft ASL)',
    altitudeMeters: 2280,
    soilType: 'Himalayan Pine Needle Humus & Glacial Mineral Silt',
    establishedYear: 1994,
    certificationNumber: 'NPOP/NAB/0071-HP',
    certifications: ['Jaivik Bharat', 'Himachal Organic Mission', 'Unwaxed Guarantee'],
    description:
      'Heritage high-altitude Himalayan orchards overlooking the Sutlej river gorge. Grown in sub-zero winters and pristine glacier-melt springs, producing crispy, naturally sweet apples with zero artificial petroleum wax coating.',
    heroImage:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Thakur Digvijay Singh',
      title: '3rd-Generation Mountain Orchardist & Cold-Chain Pioneer',
      experienceYears: 32,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      quote:
        'Our apples drink pure snowmelt and breathe thin Himalayan air. We never wax them—you can eat them straight off the tree with full peel benefits.',
    },
    awards: [
      {
        id: 'award-waxfree-2026',
        title: '100% Wax-Free Orchard Pioneer Award 2026',
        year: '2026',
        icon: '🏆',
        category: 'Chemical Wax Prohibition',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Certified 100% free of morpholine, carnauba, and synthetic shellac wax coatings.',
      },
      {
        id: 'award-altitude-2025',
        title: 'Glacial Spring Water Purity Trophy 2025',
        year: '2025',
        icon: '🥇',
        category: 'Pure Alpine Hydration',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Zero ground contamination, gravity-fed directly from Shimla protected snow reservoirs.',
      },
    ],
    growingMethods: [
      'Glacier Melt Gravity Fed Drip Irrigation',
      'Zero Shellac / Zero Petroleum Wax Coating',
      'Hand-Plucked with Cotton Gloves at Dawn',
      'Direct Reefer Cold Chain to Society Doors',
    ],
    carbonNegativeRating: 'A (Carbon Neutral Orchard Preserve)',
  },

  'farm-palani': {
    id: 'farm-palani',
    name: 'Palani Hills Avocado Agroforestry Sanctum',
    patentNumber: 'IN-PAT-TN-2023-14A',
    patentTitle: 'Multi-Canopy Cloud Forest Agroforestry Integration',
    location: 'Kodaikanal Mountain Range, Western Ghats',
    altitudeMeters: 1600,
    soilType: 'Montane Shola Forest Deep Humus Soil',
    establishedYear: 2012,
    certificationNumber: 'NPOP/NAB/0038-SHOLA',
    certifications: ['Jaivik Bharat', 'Western Ghats Biodiversity Protected', 'NPOP'],
    description:
      'Nested within the biodiverse Shola cloud forests of Kodaikanal. Avocados grow under the shade of native silver oaks, nourished by mountain mist and natural leaf mulch. Creamy, nutrient-rich, and tree-ripened without chemical calcium carbide.',
    heroImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Meenakshi Sundaram',
      title: 'Agroforestry Guardian & High-Oleic Cultivar Specialist',
      experienceYears: 22,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      quote:
        'When avocados ripen naturally on high-altitude branches, the oil content exceeds 18%, giving it the buttery texture you will never find in gas-ripened fruit.',
    },
    awards: [
      {
        id: 'award-bio-2026',
        title: 'Biodiversity Agro-Forestry Trophy 2026',
        year: '2026',
        icon: '🏆',
        category: 'Zero Deforestation Sanctum',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Zero clearing of natural forests; 100% integrated beneath native rainforest tree canopy.',
      },
      {
        id: 'award-oleic-2025',
        title: 'Creamiest Oleic Density Award 2025',
        year: '2025',
        icon: '🥇',
        category: 'Nutritional Analysis',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Tested highest healthy monounsaturated fat concentration among Indian avocado harvests.',
      },
    ],
    growingMethods: [
      'Natural Rain & Fog Condensation Collection',
      'Zero Artificial Calcium Carbide Ripening',
      'Hand-Harvested with Soft Padded Fruit Pickers',
      'Certified Biodynamic Organic Shola Agroforestry',
    ],
    carbonNegativeRating: 'A+ (Absorbs 6.1 tons CO2 / Acre)',
  },

  'farm-nilgiri': {
    id: 'farm-nilgiri',
    name: 'Nilgiri Pure-Mist Fungi Biome Terraces',
    patentNumber: 'IN-PAT-TN-2024-52M',
    patentTitle: 'Sub-Alpine Microclimate Compost Bed Filtration System',
    location: 'Ooty Slopes, Nilgiris (2,200m ASL)',
    altitudeMeters: 2200,
    soilType: 'Sterilized Organic Wheat Straw & Mountain Peat Compost',
    establishedYear: 2016,
    certificationNumber: 'NPOP/NAB/0092-NIL',
    certifications: ['Jaivik Bharat', 'Nilgiri Clean Mountain Seal', 'Zero Chlorine Bleach'],
    description:
      'Grown at 2,200m altitude in pure Nilgiri mountain air. Sterile organic pasteurized compost beds produce spotless, firm white button mushrooms with zero chemical chlorine bleach wash.',
    heroImage:
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Joseph Fernandez',
      title: 'Master Mycologist & Sterile Chamber Engineer',
      experienceYears: 19,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      quote:
        'Commercial mushrooms are frequently dipped in chlorine water to appear white. Ours are naturally spotless because they grow in sterile Nilgiri mountain mist.',
    },
    awards: [
      {
        id: 'award-bleachfree-2026',
        title: 'Zero Bleach Spotless Fungi Award 2026',
        year: '2026',
        icon: '🏆',
        category: 'Zero Chemical Treatment',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Certified 100% chemical bleach and sulfite free, preserving natural mushroom aroma.',
      },
    ],
    growingMethods: [
      'HEPA-Filtered Mountain Air Circulation',
      'Pure Alpine Spring Mist Humidity Controls',
      'Zero Chemical Bleach or Sulfite Washing',
      'Ventilated Eco-Fiber Punnets',
    ],
    carbonNegativeRating: 'A (Carbon Neutral Facility)',
  },

  'farm-surabhi': {
    id: 'farm-surabhi',
    name: 'Surabhi Vedic Gaushala Pastures',
    patentNumber: 'IN-PAT-GJ-2021-39V',
    patentTitle: 'Indigenous Wooden Bilona Churn & Solar Ahimsa Pasteurization',
    location: 'Bhavnagar Grasslands & Gaushala, Gujarat',
    altitudeMeters: 180,
    soilType: 'Organic Clover, Lucerne & Herbaceous Grazing Pastures',
    establishedYear: 2004,
    certificationNumber: 'NPOP/NAB/0019-VEDIC',
    certifications: ['Jaivik Bharat', 'Ahimsa Cruelty Free', 'A2 Beta-Casein DNA Certified'],
    description:
      'Free-grazing indigenous Gir cows living in open pasture lands. Cows feed on organic medicinal herbs like Ashwagandha and Shatavari. Milk is naturally non-homogenized, rich in A2 beta-casein proteins and bottled in sterilized glass.',
    heroImage:
      'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627993043132-2630df32fc7c?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Bhavesh Bhai Patel',
      title: 'A2 Gir Heritage Breeder & Vedic Dairy Custodian',
      experienceYears: 31,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      quote:
        'We never use synthetic oxytocin or hormone injections. Happy cows that graze freely in natural sunlight yield nectar-like milk that strengthens gut immunity.',
    },
    awards: [
      {
        id: 'award-ahimsa-2026',
        title: 'Compassionate Ahimsa Pasture Trophy 2026',
        year: '2026',
        icon: '🏆',
        category: 'Ethical Dairy Excellence',
        issuer: 'Awarded by Community App Quality Council',
        description: 'First milk always given to the baby calf; zero slaughter, zero hormonal stimulation.',
      },
      {
        id: 'award-a2pure-2025',
        title: 'Purest Golden Beta-Casein Award 2025',
        year: '2025',
        icon: '🥇',
        category: 'DNA Protein Testing',
        issuer: 'Awarded by Community App Bio-Lab Partner',
        description: '100% homozygous A2/A2 genetic certification with 0% A1 inflammatory proteins.',
      },
    ],
    growingMethods: [
      'Free Range Grazing on Organic Herbal Pastures',
      'Zero Hormones, Zero Antibiotics, Zero Starch Fillers',
      'Traditional Bilona Slow Churning on Cow Dung Fire',
      'Returnable Sterilized Glass Bottle Delivery',
    ],
    carbonNegativeRating: 'A+ (100% Bio-Gas & Solar Powered)',
  },

  'farm-coorg': {
    id: 'farm-coorg',
    name: 'Western Ghats Forest Tribal Reserve',
    patentNumber: 'IN-PAT-KA-2020-03F',
    patentTitle: 'Non-Invasive Canopy Honey Extraction & Solar Gravity Filter',
    location: 'Coorg Western Ghats Evergreen Canopy',
    altitudeMeters: 1150,
    soilType: 'Wild Rain-Canopy Epiphyte & Floral Forest Soil',
    establishedYear: 1999,
    certificationNumber: 'NPOP/NAB/0055-WILD',
    certifications: ['Jaivik Bharat', 'Wild Organic Reserve', '100% NMR Lab Certified Pure'],
    description:
      'Collected by indigenous Kodava forest tribal co-operatives from wild rock-cliff and deep canopy hives. Never heated above hive temperature (37°C), retaining 100% of live digestive enzymes, propolis, and royal jelly.',
    heroImage:
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Bopaiah Appanna',
      title: 'Coorg Tribal Honey Cooperative President & Forest Conservator',
      experienceYears: 35,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      quote:
        'Commercial honey is boiled and adulterated with inverted sugar syrup. Our honey is gathered from 200+ wild medicinal forest blossoms and cold-filtered.',
    },
    awards: [
      {
        id: 'award-nmr-2026',
        title: 'Wild Flora NMR 100% Purity Trophy 2026',
        year: '2026',
        icon: '🏆',
        category: 'Zero Added Sugar / NMR Verified',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Passed European Nuclear Magnetic Resonance (NMR) profiling with 0.00% foreign sugar adulteration.',
      },
    ],
    growingMethods: [
      'Sustainable Wild-Comb Slicing (Hive Never Destroyed)',
      'Solar Gravity Fabric Filtration',
      'Raw, Unpasteurized, Never Heated above 37°C',
      'UV-Protected Amber Glass Jars',
    ],
    carbonNegativeRating: 'A+ (Wild Rainforest Canopy Protection)',
  },

  'farm-devgad': {
    id: 'farm-devgad',
    name: 'Devgad Alphonso Mangrove Reserve',
    patentNumber: 'IN-PAT-MH-2023-61M',
    patentTitle: 'Sea-Breeze Micro-Aeration & Natural Straw-Hay Bio-Ripening',
    location: 'Devgad Coastal Terraces, Ratnagiri Sea Belt',
    altitudeMeters: 60,
    soilType: 'Iron-Rich Coastal Laterite Rocky Soil',
    establishedYear: 1986,
    certificationNumber: 'NPOP/NAB/0047-GI-HAPUS',
    certifications: ['GI-Tagged Ratnagiri Hapus', 'Jaivik Bharat', 'Zero Carbide Guarantee'],
    description:
      'Century-old Alphonso mango orchards on the rocky cliff-faces of Devgad where maritime sea winds deposit trace marine minerals. Ripened slowly inside natural organic rice straw hay without artificial chemical calcium carbide.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Chandrakant Rane',
      title: 'GI-Tag Heritage Mango Grower & Organic Biome Pioneer',
      experienceYears: 38,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      quote:
        'Real Hapus smells so intense you can scent it from the doorway. Chemical carbide ruins the saffron sweetness; we wait patiently for rice straw to ripen each fruit.',
    },
    awards: [
      {
        id: 'award-zerocarbide-2026',
        title: 'Zero Carbide Straw-Ripened Master Trophy 2026',
        year: '2026',
        icon: '🏆',
        category: 'Zero Artificial Ripening',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Certified 100% free of acetylene and calcium carbide ripening chemicals.',
      },
      {
        id: 'award-brix-2025',
        title: 'Sweetest Saffron Brix-Index Award 2025',
        year: '2025',
        icon: '🥇',
        category: 'Natural Fruit Sugar Quality',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Achieved an extraordinary 22.8° Brix natural sweetness reading.',
      },
    ],
    growingMethods: [
      'Organic Fish-Emulsion and Sea-Kelp Soil Nourishment',
      'Natural Rice Straw Hay Maturation',
      'Cushioned Corrugated Master Farm Crates',
      'Direct Coastal APMC Bypass Dispatch',
    ],
    carbonNegativeRating: 'A (Coastal Orchard Mangrove Buffer)',
  },

  'farm-sehore': {
    id: 'farm-sehore',
    name: 'Sehore Black-Soil Sharbati Heritage Mill',
    patentNumber: 'IN-PAT-MP-2022-89W',
    patentTitle: 'Low-RPM Cold Natural Stone Chakki Enclosure System',
    location: 'Sehore Malwa Plains, Madhya Pradesh',
    altitudeMeters: 510,
    soilType: 'Mineral-Dense Deep Regur Black Soil',
    establishedYear: 1998,
    certificationNumber: 'NPOP/NAB/0064-SHARBATI',
    certifications: ['Jaivik Bharat', '100% Whole Wheat Germ Intact', 'Zero Maida'],
    description:
      'Heritage Sharbati golden wheat grown in rain-fed mineral-rich black cotton soils of Sehore. Stoneground fresh in local low-RPM chakki below 36°C so vital live enzymes, wheat germ, and dietary fiber stay 100% intact.',
    heroImage:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Mahendra Singh Verma',
      title: 'Heritage Wheat Conservator & Cold-Stone Master Miller',
      experienceYears: 29,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      quote:
        'Industrial steel roller mills heat flour to 80°C, destroying nutrients and bleaching out the germ. We mill slowly on natural stone—rotis stay velvety soft for 24 hours.',
    },
    awards: [
      {
        id: 'award-grain-2026',
        title: 'Ancient Grain Nutrition Preservation Award 2026',
        year: '2026',
        icon: '🏆',
        category: 'Whole Wheat Germ Preservation',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Verified 100% retention of wheat germ oil and natural B-complex vitamins.',
      },
      {
        id: 'award-lowheat-2025',
        title: 'Cold-Stone Low-RPM Chakki Master 2025',
        year: '2025',
        icon: '🥇',
        category: 'Zero Thermal Degradation',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Milling temperature verified below 36°C throughout production batches.',
      },
    ],
    growingMethods: [
      'Rain-fed Rainwater Deep Rooting System',
      'Zero Glyphosate Desiccation or Chemical Sprays',
      'Traditional Low-RPM Natural Granite Stone Chakki',
      'Multi-Layer Sealed Breathable Paper Sacks',
    ],
    carbonNegativeRating: 'A (Dryland Soil Carbon Sink)',
  },

  'farm-sahyadri': {
    id: 'farm-sahyadri',
    name: 'Sahyadri Living-Soil Bio-Reserve',
    patentNumber: 'IN-PAT-MH-2024-18S',
    patentTitle: 'Multi-Microbial Ferment Cured Allium Root Conditioning System',
    location: 'Kalwan Valley, Nashik Ridge (680m ASL)',
    altitudeMeters: 680,
    soilType: 'Volcanic Basalt Black Loam Enriched with Biochar',
    establishedYear: 2011,
    certificationNumber: 'NPOP/NAB/0088-SAHYADRI',
    certifications: ['Jaivik Bharat', 'NPOP India Organic', 'SGS Zero Pesticide Seal'],
    description:
      'Spanning 60 acres in the mineral-rich Kalwan valley of Nashik. Onions and garlic grow in living soil nurtured with indigenous beneficial microbes, crop rotation with legumes, and traditional solar curing that preserves natural pungent allicin.',
    heroImage:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Rameshwar Patil',
      title: 'Regenerative Allium Specialist & Bio-Fertilizer Innovator',
      experienceYears: 27,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote:
        'When you enrich volcanic soil with organic biochar and Jeevamrutha, onions develop thick, dry protective outer skins naturally with zero anti-sprouting chemicals.',
    },
    awards: [
      {
        id: 'award-allicin-2026',
        title: 'Community Bio-Allicin Pungency Award 2026',
        year: '2026',
        icon: '🏆',
        category: 'Natural Bio-Active Pungency',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Tested 38% higher in natural immune-boosting allicin compared to commercial bulk storage onions.',
      },
      {
        id: 'award-sproutfree-2025',
        title: 'Zero Chemical Sprout-Inhibitor Seal 2025',
        year: '2025',
        icon: '🥇',
        category: 'Zero Synthetic Preservatives',
        issuer: 'Awarded by Community App Quality Council',
        description: '100% free of synthetic maleic hydrazide anti-sprouting chemicals; cured entirely by ambient solar air.',
      },
    ],
    growingMethods: [
      'Biochar Carbon-Sequestration Soil Beds',
      'Desi Cow Jeevamrutha Microbial Inoculation',
      'Solar-Draft Curing Sheds (Zero Artificial Preservatives)',
      'Breathable Jute-Cotton Crates (Zero Plastic)',
    ],
    carbonNegativeRating: 'A+ (Absorbs 4.2 tons CO2 / Acre / Year)',
  },

  'farm-malnad': {
    id: 'farm-malnad',
    name: 'Malnad Bio-Dynamic Valley',
    patentNumber: 'IN-PAT-KA-2023-93M',
    patentTitle: 'Rainforest Canopy Poly-Culture Banana Ripening Micro-Biome',
    location: 'Thirthahalli Foothills, Western Ghats',
    altitudeMeters: 740,
    soilType: 'Rich Humus Deep Rainforest Red Earth',
    establishedYear: 2007,
    certificationNumber: 'NPOP/NAB/0079-MALNAD',
    certifications: ['Jaivik Bharat', 'Western Ghats Rainforest Alliance', 'Zero Carbide Certified'],
    description:
      'Grown beneath the multi-tier forest canopy of the Western Ghats. Robusta and Elakki bananas absorb pure monsoon mountain water and volcanic minerals, naturally sweet and tree-ripened without harmful calcium carbide chemical gas.',
    heroImage:
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    ],
    owner: {
      name: 'Shankar Hegde',
      title: 'Biodynamic Rainforest Planter & Heirloom Fruit Custodian',
      experienceYears: 33,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      quote:
        'Bananas ripened in fresh mountain mist have a velvety honey sweetness that gas chambers can never replicate. Every fruit is blessed by rainforest soil.',
    },
    awards: [
      {
        id: 'award-tree-ripened-2026',
        title: 'Tree-Ripened Purity Trophy 2026',
        year: '2026',
        icon: '🏆',
        category: 'Zero Ethylene Carbide Gas',
        issuer: 'Awarded by Community App Quality Council',
        description: 'Certified 100% naturally matured under rainforest shade; zero chemical acceleration.',
      },
      {
        id: 'award-potassium-2025',
        title: 'Natural Potassium & Electrolyte Master 2025',
        year: '2025',
        icon: '🥇',
        category: 'Nutritional Density',
        issuer: 'Awarded by Community App Bio-Lab Partner',
        description: 'Highest natural potassium and bio-available mineral content recorded among regional orchards.',
      },
    ],
    growingMethods: [
      'Multi-Tier Canopy Biodiversity Agroforestry',
      'Natural Leaf Mulch & Earthworm Castings',
      'Zero Synthetic Pesticides or Fertilizers',
      'Cushioned Corrugated Farm Delivery Boxes',
    ],
    carbonNegativeRating: 'A+ (Absorbs 5.8 tons CO2 / Acre / Year)',
  },
};
