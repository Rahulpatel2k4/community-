export type ProductCategory =
  | 'all'
  | 'only_organic'
  | 'veggies'
  | 'fruits'
  | 'staples'
  | 'dairy_fresh'
  | 'coldpressed_oils'
  | 'snacks'
  | 'bakery'
  | 'beverages'
  | 'dryfruits_masala'
  | 'wholesale_crates';

export type UnitType = 'WEIGHT' | 'LIQUID' | 'COUNT';

export type BaseUnit = 'kg' | 'g' | 'L' | 'ml' | 'pcs' | 'dozen';

export type PerishabilityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export type PoolStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'OPEN'
  | 'NEAR_TARGET'
  | 'TARGET_REACHED'
  | 'LOCKED'
  | 'PROCUREMENT'
  | 'FULFILLING'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXTENDED'
  | 'CANCELLED';

export interface PriceTierConfig {
  tierId?: string;
  minQuantity: number;
  maxQuantity: number | null;
  price: number;
  discountPct?: number;
  label?: string;
}

export interface DiscountTier {
  minKg: number;
  pricePerKg: number;
  discountPct: number;
  label: string;
}

export interface FarmAward {
  id: string;
  title: string;
  year: string;
  icon: string;
  category: string;
  issuer: string;
  description: string;
}

export interface FarmOwner {
  name: string;
  title: string;
  experienceYears: number;
  avatar: string;
  quote: string;
}

export interface PatentedFarm {
  id: string;
  name: string;
  patentNumber: string;
  patentTitle: string;
  location: string;
  altitudeMeters: number;
  soilType: string;
  establishedYear: number;
  certificationNumber: string;
  certifications: string[];
  description: string;
  heroImage: string;
  galleryImages: string[];
  owner: FarmOwner;
  awards: FarmAward[];
  growingMethods: string[];
  carbonNegativeRating?: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  image: string;
  unit: string; // e.g. "1 L", "1 kg", "6 pcs", "500ml", "pack"
  unitType?: UnitType;
  baseUnit?: BaseUnit;
  standardRetailPrice: number; // e.g. retail price on solo apps (₹/unit)
  normalPrice?: number; // alias for standardRetailPrice
  basePrice: number; // Tier 1 price

  // Economics & Landed Cost Breakdown
  supplierCost?: number;
  transportCost?: number;
  packagingCost?: number;
  paymentCost?: number;
  operationalCost?: number;
  wastageReserve?: number; // ₹ reserve per unit
  wastageReservePercent?: number; // e.g. 2%, 5%, 7%
  requiredMarginPercent?: number; // e.g. 8%
  landedCostPerUnit?: number;
  minimumSafePrice?: number; // Must never sell below this

  // Order limits & increments
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;
  orderIncrement?: number;

  // Pool Quantity Limits
  currentQuantity?: number;
  minimumPoolQuantity?: number;
  targetPoolQuantity?: number;
  maximumPoolQuantity?: number;

  // Tiers
  priceTiers?: PriceTierConfig[];
  tiers: [DiscountTier, DiscountTier, DiscountTier, DiscountTier];

  // Time & Scheduling
  poolDurationHours?: number;
  poolStartTime?: string;
  scheduledCloseTime?: string;
  actualCloseTime?: string;
  perishabilityLevel?: PerishabilityLevel;
  allowExtension?: boolean;
  maxExtensionMinutes?: number;
  pricingMode?: 'FINAL_POOL_PRICE' | 'LOCKED_AT_ORDER_PRICE';

  // Supplier procurement parameters
  supplierMOQ?: number;
  supplierOrderIncrement?: number;

  // State & participants
  poolStatus?: PoolStatus;
  participantCount?: number;
  currentPoolKg: number;
  maxTierCapacityKg: number;
  pledgerCount: number;

  farmOrigin: string;
  harvestWindow: string; // e.g. "Harvested today 4:00 AM"
  description: string;
  badges: string[];
  organicCertified?: boolean;
  patentedFarm?: PatentedFarm;
  whereGrown?: string; // Specific plot/ridge/polyhouse location
  whenGrown?: string; // Sowing, harvest date, natural cycle duration
  hasActivePool: boolean;
  poolType: 'small' | 'large' | 'both' | 'none';
  poolActivationThreshold?: number; // total pledge count needed to activate pool (e.g. 5)
  currentPledgesCount?: number; // current neighbors who pledged towards starting the pool
  poolTargetKg?: number; // Target kg to trigger the pool
}

export interface PoolSummary {
  productName: string;
  currentQuantity: number;
  unit: string;
  unitType: UnitType;
  formattedQuantity: string;
  participantCount: number;
  currentPrice: number;
  formattedCurrentPrice: string;
  nextTierQuantity: number | null;
  nextTierPrice: number | null;
  remainingQuantity: number;
  formattedRemaining: string;
  progressPercent: number;
  poolStatus: PoolStatus;
  closingTime?: string;
  savingsPerUnit: number;
  formattedSavingsPerUnit: string;
  minimumSafePrice: number;
  landedCost: number;
  normalPrice: number;
  canOrder: boolean;
  isMaxReached: boolean;
  unitPriceLabel: string;
}

export interface ProcurementCalculation {
  customerQuantity: number;
  wastageReservePercent: number;
  rawRequirement: number;
  supplierOrderIncrement: number;
  supplierMOQ: number;
  finalSupplierPurchaseQuantity: number;
  wastageBufferQuantity: number;
  totalCostEstimate: number;
}

export interface PoolNotificationOptIn {
  productId: string;
  productName: string;
  thresholdCount: number; // e.g. 3, 5, 8 pledges
  channel: 'whatsapp' | 'sms' | 'in_app';
  phoneOrFlat: string;
  optedInAt: string;
}

export interface NeighborhoodCluster {
  id: string;
  name: string;
  shortName: string;
  cityArea: string;
  distanceFromHubKm: number; // Distance in KM from central dark hub (within 5km limit)
  hubName: string;
  totalFlats: number;
  activeHouseholds: number;
  activeOrdersToday: number;
  totalWeightPooledKg: number;
  co2SavedThisMonthKg: number;
  monthlySavingsInRupees: number;
  towers: string[];
  nearbySocietiesInRadius: Array<{
    id: string;
    name: string;
    distanceKm: number;
    activeFlats: number;
  }>;
  captain: {
    name: string;
    flat: string;
    tower: string;
    phoneMasked: string;
    rating: number;
    completedBatches: number;
    avatar: string;
  };
  smartLockerAvailable: boolean;
}

export type LocationTag = 'home' | 'work' | 'parents' | 'other';

export interface SavedLocation {
  id: string;
  tag: LocationTag;
  title: string;
  flatTower: string;
  societyName: string;
  area: string;
  pincode: string;
  landmark?: string;
  deliveryInstructions?: string;
  distanceKm: number;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  detectedViaGps?: boolean;
  createdAt: string;
}

export interface UserRadiusLocation {
  id?: string;
  address: string;
  society: string;
  distanceKm: number;
  isWithinRadius: boolean; // <= 5.0 km
  flatTower?: string;
  area?: string;
  pincode?: string;
  tag?: LocationTag;
  deliveryInstructions?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  detectedViaGps?: boolean;
}

export interface PoolWindow {
  id: 'small_quick' | 'standard_evening' | 'mega_wholesale';
  title: string;
  badge: string;
  targetThresholdKg: number;
  currentKg: number;
  closesIn: string;
  pricingNote: string; // e.g. "Lower than retail market, higher than wholesale"
  dispatchTime: string;
  participatingFlats: number;
}

export type PoolTypeFilter = 'all' | 'organic' | 'small' | 'large' | 'unpooled';

export type DeliveryMethod = 'pickup' | 'doorstep';

export interface PickupLocation {
  id: string;
  name: string;
  description: string;
  pickupWindow: string;
  fee: number; // 0
}

export interface CartItem {
  product: Product;
  quantity: number; // in units (e.g. 1kg, 2kg)
  currentPrice: number;
  currentDiscountPct: number;
  tierIndex: number;
}

export interface DeliverySlotOption {
  id: string;
  name: string;
  timeWindow: string;
  type: 'morning_fresh' | 'evening_dinner' | 'weekend_bulk';
  cutoffTime: string;
  status: 'open' | 'filling_fast' | 'dispatched';
  currentOrders: number;
  maxOrders: number;
  vehicleType: 'Electric Mini-Van (Zero Emission)' | 'Cargo E-Bike Fleet';
  description: string;
}

export interface NeighborPledgeEvent {
  id: string;
  neighborName: string;
  flat: string;
  tower: string;
  productName: string;
  quantityKg: number;
  timeAgo: string;
  tierUnlocked?: string;
}

export interface RouteOptimizationStep {
  step: number;
  location: string;
  timeWindow: string;
  orderCount: number;
  weightKg: number;
  action: string;
  elevatorOptimizationTip: string;
  perishableCare: string;
}

export interface RouteOptimizationResult {
  routeTitle: string;
  summary: string;
  totalStops: number;
  estimatedTimeMinutes: number;
  co2SavedKg: number;
  residentSavingsTotal: string;
  stopSequence: RouteOptimizationStep[];
  batchPackagingPlan: {
    reusableCratesNeeded: number;
    coldBagsNeeded: number;
    grainSacksConsolidated: number;
    packagingWasteReducedPct: number;
  };
  communityCaptainBonus: string;
  recommendations: string[];
}

export type PaymentMethod = 'wallet' | 'upi' | 'cod';

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'cashback';
  amount: number;
  description: string;
  date: string;
  balanceAfter: number;
}
