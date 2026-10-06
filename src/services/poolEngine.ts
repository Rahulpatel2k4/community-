import {
  Product,
  UnitType,
  BaseUnit,
  PoolStatus,
  PriceTierConfig,
  PoolSummary,
  ProcurementCalculation,
  PerishabilityLevel,
} from '../types';

export interface OperationalTimings {
  supplierLeadTimeHours: number;
  procurementPreparationHours: number;
  orderProcessingHours: number;
  safetyBufferHours: number;
}

export const DEFAULT_OPERATIONAL_TIMINGS: OperationalTimings = {
  supplierLeadTimeHours: 5,
  procurementPreparationHours: 2,
  orderProcessingHours: 1,
  safetyBufferHours: 1,
};

// ============================================================
// 1. UNIT & NORMALIZATION HELPERS
// ============================================================

/**
 * Extracts and normalizes product unit information.
 * Guarantees milk uses L, potatoes use kg, eggs use pcs, etc.
 */
export function getProductUnit(product: Product): {
  unitType: UnitType;
  baseUnit: BaseUnit;
  displayUnit: string;
  unitPriceLabel: string;
} {
  if (product.unitType && product.baseUnit) {
    const unitPriceLabel =
      product.baseUnit === 'pcs'
        ? '/pc'
        : `/${product.baseUnit}`;
    return {
      unitType: product.unitType,
      baseUnit: product.baseUnit,
      displayUnit: product.unit,
      unitPriceLabel,
    };
  }

  // Infer based on product unit string or name
  const rawUnit = product.unit.toLowerCase();
  const name = product.name.toLowerCase();

  let unitType: UnitType = 'WEIGHT';
  let baseUnit: BaseUnit = 'kg';

  if (
    rawUnit.includes('litre') ||
    rawUnit.includes('500ml') ||
    rawUnit === 'l' ||
    name.includes('milk') ||
    name.includes('oil') ||
    name.includes('decoction')
  ) {
    unitType = 'LIQUID';
    baseUnit = 'L';
  } else if (
    rawUnit.includes('pack') ||
    rawUnit.includes('bun') ||
    rawUnit.includes('loaf') ||
    rawUnit.includes('box') ||
    rawUnit.includes('pcs') ||
    rawUnit.includes('punnet') ||
    name.includes('egg') ||
    name.includes('coconut') ||
    name.includes('pav')
  ) {
    unitType = 'COUNT';
    baseUnit = 'pcs';
  }

  const unitPriceLabel = baseUnit === 'pcs' ? '/pc' : `/${baseUnit}`;

  return {
    unitType,
    baseUnit,
    displayUnit: product.unit,
    unitPriceLabel,
  };
}

/**
 * Normalizes any descriptive unit into a compact, standardized symbol (e.g. 'L', 'kg', 'pcs')
 */
export function normalizeUnit(unit: string): string {
  if (!unit) return '';
  const u = unit.toLowerCase().trim();
  if (u === 'l' || u.includes('litre') || u.includes('500ml')) return 'L';
  if (u === 'kg' || u.includes('kg')) return 'kg';
  if (
    u === 'pcs' ||
    u === 'pc' ||
    u.includes('pcs') ||
    u.includes('pack') ||
    u.includes('bun') ||
    u.includes('loaf') ||
    u.includes('egg') ||
    u.includes('punnet') ||
    u.includes('box') ||
    u.includes('sack') ||
    u.includes('bag')
  ) {
    return 'pcs';
  }
  if (u.includes('g') && !u.includes('kg')) return 'g';
  return u.split(' ')[0] || 'unit';
}

/**
 * Formats a quantity with its unit (e.g. "74 L", "74 kg", "120 pcs")
 */
export function formatQuantity(quantity: number, unit: string): string {
  const rounded = Number.isInteger(quantity)
    ? quantity.toString()
    : quantity.toFixed(1).replace(/\.0$/, '');

  const normalized = normalizeUnit(unit);
  return `${rounded} ${normalized}`;
}

/**
 * Formats price per unit (e.g. "₹70/L", "₹36/kg", "₹7/pc")
 */
export function formatPricePerUnit(price: number, unit: string): string {
  const rounded = Number.isInteger(price) ? `₹${price}` : `₹${price.toFixed(2)}`;
  const normalized = normalizeUnit(unit);
  const label = normalized === 'pcs' || normalized === 'pc' ? '/pc' : `/${normalized}`;
  return `${rounded}${label}`;
}

// ============================================================
// 2. ECONOMICS & LANDED COST CALCULATIONS
// ============================================================

/**
 * Calculates landed cost per unit.
 * landedCostPerUnit = supplierCost + transportCost + packagingCost + paymentCost + operationalCost + wastageReserve
 */
export function calculateLandedCost(product: Product): number {
  if (product.landedCostPerUnit && product.landedCostPerUnit > 0) {
    return product.landedCostPerUnit;
  }

  const supplier = product.supplierCost ?? Math.round(product.basePrice * 0.75);
  const transport = product.transportCost ?? Math.max(1, Math.round(product.basePrice * 0.05));
  const packaging = product.packagingCost ?? Math.max(1, Math.round(product.basePrice * 0.03));
  const payment = product.paymentCost ?? 1;
  const operational = product.operationalCost ?? 1;
  const wastage = product.wastageReserve ?? Math.max(1, Math.round(product.basePrice * 0.02));

  return supplier + transport + packaging + payment + operational + wastage;
}

/**
 * Calculates minimum safe price with configured margin.
 * minimumSafePrice = landedCost / (1 - requiredMarginPercent)
 * The Pool Engine must NEVER price below this.
 */
export function calculateMinimumSafePrice(product: Product): number {
  if (product.minimumSafePrice && product.minimumSafePrice > 0) {
    return product.minimumSafePrice;
  }

  const landedCost = calculateLandedCost(product);
  const marginPct = (product.requiredMarginPercent ?? 8) / 100;
  const rawSafePrice = landedCost / (1 - marginPct);

  // Ceil to avoid eroding margin
  return Math.ceil(rawSafePrice);
}

// ============================================================
// 3. PRICE TIERS & CURRENT POOL PRICE
// ============================================================

/**
 * Retrieves normalized price tiers for a product.
 * Guarantees every tier price >= minimumSafePrice.
 */
export function getNormalizedPriceTiers(product: Product): PriceTierConfig[] {
  const minSafe = calculateMinimumSafePrice(product);
  const normalPrice = product.normalPrice ?? product.standardRetailPrice;

  if (product.priceTiers && product.priceTiers.length > 0) {
    return product.priceTiers.map((t) => ({
      ...t,
      price: Math.max(minSafe, t.price),
    }));
  }

  // Convert legacy tiers to standard price tiers
  if (product.tiers && product.tiers.length > 0) {
    return product.tiers.map((t, idx, arr) => {
      const nextMin = idx < arr.length - 1 ? arr[idx + 1].minKg - 1 : null;
      const safePrice = Math.max(minSafe, t.pricePerKg);
      const discountPct = normalPrice > 0
        ? Math.round(((normalPrice - safePrice) / normalPrice) * 100)
        : t.discountPct;

      return {
        tierId: `tier-${idx + 1}`,
        minQuantity: t.minKg,
        maxQuantity: nextMin,
        price: safePrice,
        discountPct,
        label: t.label,
      };
    });
  }

  // Default fallback: 3 tiers based on target quantities
  const target = product.targetPoolQuantity ?? product.maxTierCapacityKg ?? 100;
  return [
    { minQuantity: 0, maxQuantity: Math.round(target * 0.25) - 1, price: normalPrice, label: 'Base Pool' },
    { minQuantity: Math.round(target * 0.25), maxQuantity: target - 1, price: Math.max(minSafe, Math.round(normalPrice * 0.88)), label: 'Community Tier' },
    { minQuantity: target, maxQuantity: null, price: minSafe, label: 'Wholesale Mandi' },
  ];
}

/**
 * Calculates current price based on total committed pool quantity.
 * Price is determined strictly by quantity, never flat count.
 */
export function calculatePoolPrice(product: Product, quantity: number): number {
  const tiers = getNormalizedPriceTiers(product);
  const minSafe = calculateMinimumSafePrice(product);

  let activePrice = tiers[0]?.price ?? (product.normalPrice || product.standardRetailPrice);

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (quantity >= tiers[i].minQuantity) {
      activePrice = tiers[i].price;
      break;
    }
  }

  return Math.max(minSafe, activePrice);
}

/**
 * Calculates the next unlockable tier.
 */
export function calculateNextPriceTier(
  product: Product,
  currentQuantity: number
): {
  nextPrice: number;
  nextTierQuantity: number;
  remainingQuantity: number;
  discountPct: number;
  label: string;
} | null {
  const tiers = getNormalizedPriceTiers(product);
  const normalPrice = product.normalPrice ?? product.standardRetailPrice;

  const nextTier = tiers.find((t) => t.minQuantity > currentQuantity);
  if (!nextTier) {
    return null; // Maximum tier reached
  }

  const remainingQuantity = Math.max(0, nextTier.minQuantity - currentQuantity);
  const discountPct = normalPrice > 0
    ? Math.round(((normalPrice - nextTier.price) / normalPrice) * 100)
    : nextTier.discountPct || 0;

  return {
    nextPrice: nextTier.price,
    nextTierQuantity: nextTier.minQuantity,
    remainingQuantity,
    discountPct,
    label: nextTier.label || `Unlock at ${nextTier.minQuantity}`,
  };
}

/**
 * Calculates quantity needed to reach next price tier.
 */
export function calculateRemainingToNextTier(product: Product, currentQuantity: number): number {
  const next = calculateNextPriceTier(product, currentQuantity);
  return next ? next.remainingQuantity : 0;
}

/**
 * Calculates progress percentage toward next tier or ideal target.
 * Clamped between 0 and 100.
 */
export function calculatePoolProgress(product: Product, currentQty?: number): number {
  const qty = currentQty ?? product.currentQuantity ?? product.currentPoolKg ?? 0;
  const next = calculateNextPriceTier(product, qty);

  if (next) {
    const target = next.nextTierQuantity;
    return target > 0 ? Math.min(100, Math.max(0, Math.round((qty / target) * 100))) : 0;
  }

  // If top tier reached, calculate vs maximum capacity
  const maxCap = product.maximumPoolQuantity ?? product.maxTierCapacityKg ?? 100;
  return maxCap > 0 ? Math.min(100, Math.max(0, Math.round((qty / maxCap) * 100))) : 100;
}

// ============================================================
// 4. POOL STATUS & TIMING LOGIC
// ============================================================

/**
 * Determines current pool status based on quantity, limits, and time.
 */
export function calculatePoolStatus(
  product: Product,
  currentQty?: number,
  currentTime: Date = new Date()
): PoolStatus {
  if (product.hasActivePool === false) {
    return 'DRAFT';
  }

  const qty = currentQty ?? product.currentQuantity ?? product.currentPoolKg ?? 0;
  const maxCap = product.maximumPoolQuantity ?? product.maxTierCapacityKg ?? 150;
  const target = product.targetPoolQuantity ?? product.poolTargetKg ?? 100;

  // Auto-close / Lock if max capacity reached
  if (qty >= maxCap) {
    return 'LOCKED';
  }

  // Check scheduled close time if provided
  if (product.scheduledCloseTime) {
    const closeTime = new Date(product.scheduledCloseTime);
    if (currentTime > closeTime) {
      const minQty = product.minimumPoolQuantity ?? 25;
      if (qty >= minQty) {
        return 'PROCUREMENT';
      }
      if (product.allowExtension) {
        return 'EXTENDED';
      }
      return 'FAILED';
    }
  }

  if (qty >= target) {
    return 'TARGET_REACHED';
  }

  if (qty >= target * 0.7) {
    return 'NEAR_TARGET';
  }

  return 'OPEN';
}

/**
 * Calculates pool close time using delivery-backward logic.
 * poolCloseTime = deliveryTime - (supplierLeadTime + procurementPrep + orderProcessing + safetyBuffer)
 */
export function calculatePoolCloseTime(
  deliveryTime: Date,
  timings: OperationalTimings = DEFAULT_OPERATIONAL_TIMINGS
): Date {
  const totalOffsetHours =
    timings.supplierLeadTimeHours +
    timings.procurementPreparationHours +
    timings.orderProcessingHours +
    timings.safetyBufferHours;

  return new Date(deliveryTime.getTime() - totalOffsetHours * 60 * 60 * 1000);
}

// ============================================================
// 5. PROCUREMENT & WASTAGE CALCULATIONS
// ============================================================

/**
 * Calculates supplier procurement requirement from customer demand.
 * Takes wastage buffer and supplier order increment into account.
 * (Does NOT change customer order quantity).
 */
export function calculateProcurementQuantity(
  product: Product,
  customerQuantity: number
): ProcurementCalculation {
  const wastagePct = product.wastageReservePercent ?? 5;
  const rawRequirement = customerQuantity * (1 + wastagePct / 100);

  const increment = product.supplierOrderIncrement ?? 1;
  const moq = product.supplierMOQ ?? product.minimumPoolQuantity ?? 10;

  // Round up to supplier increment
  let finalPurchase = Math.ceil(rawRequirement / increment) * increment;
  if (finalPurchase < moq) {
    finalPurchase = moq;
  }

  const wastageBufferQuantity = Math.max(0, finalPurchase - customerQuantity);
  const supplierCost = product.supplierCost ?? Math.round(product.basePrice * 0.75);
  const totalCostEstimate = finalPurchase * supplierCost;

  return {
    customerQuantity,
    wastageReservePercent: wastagePct,
    rawRequirement: Number(rawRequirement.toFixed(2)),
    supplierOrderIncrement: increment,
    supplierMOQ: moq,
    finalSupplierPurchaseQuantity: finalPurchase,
    wastageBufferQuantity: Number(wastageBufferQuantity.toFixed(2)),
    totalCostEstimate,
  };
}

// ============================================================
// 6. ORDER VALIDATION & LIMITS
// ============================================================

/**
 * Maximum quantity a single customer can add before hitting pool cap.
 */
export function calculateMaximumAllowedOrderQuantity(
  product: Product,
  currentPoolQty: number
): number {
  const maxPool = product.maximumPoolQuantity ?? product.maxTierCapacityKg ?? 200;
  const maxOrder = product.maximumOrderQuantity ?? 20;
  const remainingInPool = Math.max(0, maxPool - currentPoolQty);

  return Math.min(maxOrder, remainingInPool);
}

/**
 * Validates a customer's order quantity against increments, limits, and pool capacity.
 */
export function validateOrderQuantity(
  product: Product,
  requestedQty: number,
  currentPoolQty: number
): { isValid: boolean; error?: string; adjustedQty?: number } {
  const minOrder = product.minimumOrderQuantity ?? 0.5;
  const increment = product.orderIncrement ?? 0.5;
  const maxAllowed = calculateMaximumAllowedOrderQuantity(product, currentPoolQty);

  if (requestedQty < minOrder) {
    return {
      isValid: false,
      error: `Minimum order for ${product.name} is ${minOrder} ${product.baseUnit || 'units'}`,
      adjustedQty: minOrder,
    };
  }

  if (requestedQty > maxAllowed) {
    return {
      isValid: false,
      error: `Maximum available to order in this pool is ${maxAllowed} ${product.baseUnit || 'units'}`,
      adjustedQty: maxAllowed,
    };
  }

  // Check increment rounding
  const steps = requestedQty / increment;
  if (Math.abs(steps - Math.round(steps)) > 0.001) {
    const adjusted = Math.round(steps) * increment;
    return {
      isValid: false,
      error: `Quantity must be in increments of ${increment} ${product.baseUnit || 'units'}`,
      adjustedQty: adjusted,
    };
  }

  return { isValid: true };
}

/**
 * Calculates customer savings against normal retail price.
 */
export function calculateCustomerSavings(
  product: Product,
  quantity: number,
  currentPoolPrice: number
): number {
  const normalPrice = product.normalPrice ?? product.standardRetailPrice;
  const diff = Math.max(0, normalPrice - currentPoolPrice);
  return Math.round(quantity * diff);
}

export function calculateCustomerSubtotal(quantity: number, pricePerUnit: number): number {
  return Math.round(quantity * pricePerUnit);
}

// ============================================================
// 7. POOL ECONOMICS VALIDATION (Section 40)
// ============================================================

/**
 * Validates entire pool configuration before publishing.
 */
export function validatePoolConfiguration(product: Product): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const minSafe = calculateMinimumSafePrice(product);
  const normalPrice = product.normalPrice ?? product.standardRetailPrice;

  if (!product.name) errors.push('Product name is required');
  if (normalPrice <= 0) errors.push('Normal price must be greater than 0');
  if (minSafe <= 0) errors.push('Minimum safe price must be greater than 0');
  if (normalPrice < minSafe) errors.push(`Normal price (₹${normalPrice}) cannot be lower than minimum safe price (₹${minSafe})`);

  const tiers = getNormalizedPriceTiers(product);
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (t.price < minSafe) {
      errors.push(`Tier ${i + 1} price (₹${t.price}) is below minimum safe price (₹${minSafe})`);
    }
    if (i > 0) {
      if (t.minQuantity <= tiers[i - 1].minQuantity) {
        errors.push(`Tier ${i + 1} quantity (${t.minQuantity}) must be greater than previous tier (${tiers[i - 1].minQuantity})`);
      }
      if (t.price > tiers[i - 1].price) {
        errors.push(`Tier ${i + 1} price (₹${t.price}) cannot increase as quantity increases`);
      }
    }
  }

  const minPool = product.minimumPoolQuantity ?? 10;
  const targetPool = product.targetPoolQuantity ?? 50;
  const maxPool = product.maximumPoolQuantity ?? 100;

  if (minPool > targetPool) errors.push(`Minimum pool (${minPool}) cannot exceed target pool (${targetPool})`);
  if (targetPool > maxPool) errors.push(`Target pool (${targetPool}) cannot exceed maximum pool (${maxPool})`);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================
// 8. CONSOLIDATED POOL SUMMARY (SOURCE OF TRUTH)
// ============================================================

/**
 * Master function for the frontend UI.
 * Returns exact, unit-aware, mathematically sound pool state.
 */
export function getPoolSummary(product: Product): PoolSummary {
  const { unitType, baseUnit, unitPriceLabel } = getProductUnit(product);
  const currentQuantity = product.currentQuantity ?? product.currentPoolKg ?? 0;
  const participantCount = product.participantCount ?? product.pledgerCount ?? 0;

  const currentPrice = calculatePoolPrice(product, currentQuantity);
  const landedCost = calculateLandedCost(product);
  const minSafe = calculateMinimumSafePrice(product);
  const normalPrice = product.normalPrice ?? product.standardRetailPrice;

  const nextTier = calculateNextPriceTier(product, currentQuantity);
  const progressPercent = calculatePoolProgress(product, currentQuantity);
  const poolStatus = calculatePoolStatus(product, currentQuantity);

  const savingsPerUnit = Math.max(0, normalPrice - currentPrice);

  const maxCap = product.maximumPoolQuantity ?? product.maxTierCapacityKg ?? 150;
  const isMaxReached = currentQuantity >= maxCap;
  const canOrder = !isMaxReached && poolStatus !== 'LOCKED' && poolStatus !== 'COMPLETED';

  return {
    productName: product.name,
    currentQuantity,
    unit: baseUnit,
    unitType,
    formattedQuantity: formatQuantity(currentQuantity, baseUnit),
    participantCount,
    currentPrice,
    formattedCurrentPrice: formatPricePerUnit(currentPrice, baseUnit),
    nextTierQuantity: nextTier ? nextTier.nextTierQuantity : null,
    nextTierPrice: nextTier ? nextTier.nextPrice : null,
    remainingQuantity: nextTier ? nextTier.remainingQuantity : 0,
    formattedRemaining: nextTier ? formatQuantity(nextTier.remainingQuantity, baseUnit) : '0',
    progressPercent,
    poolStatus,
    closingTime: product.scheduledCloseTime || 'Locks in 42 mins',
    savingsPerUnit,
    formattedSavingsPerUnit: formatPricePerUnit(savingsPerUnit, baseUnit),
    minimumSafePrice: minSafe,
    landedCost,
    normalPrice,
    canOrder,
    isMaxReached,
    unitPriceLabel,
  };
}

// ============================================================
// 9. BACKWARD COMPATIBILITY ADAPTER
// ============================================================

/**
 * Adapter ensuring calculateCurrentTier calls across the app
 * receive unit-aware pricing from the new Pool Engine.
 */
export function calculateCurrentTier(product: Product): {
  tierIndex: number;
  currentPrice: number;
  currentDiscountPct: number;
  nextTier: { kgNeeded: number; nextPrice: number; nextDiscount: number } | null;
  progressPct: number;
} {
  const summary = getPoolSummary(product);
  const tiers = getNormalizedPriceTiers(product);

  let activeIndex = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (summary.currentQuantity >= tiers[i].minQuantity) {
      activeIndex = i;
      break;
    }
  }

  const normalPrice = summary.normalPrice;
  const currentDiscountPct = normalPrice > 0
    ? Math.round(((normalPrice - summary.currentPrice) / normalPrice) * 100)
    : 0;

  const nextTierObj = summary.nextTierPrice !== null
    ? {
        kgNeeded: summary.remainingQuantity,
        nextPrice: summary.nextTierPrice,
        nextDiscount: normalPrice > 0
          ? Math.round(((normalPrice - summary.nextTierPrice) / normalPrice) * 100)
          : 0,
      }
    : null;

  return {
    tierIndex: activeIndex,
    currentPrice: summary.currentPrice,
    currentDiscountPct,
    nextTier: nextTierObj,
    progressPct: summary.progressPercent,
  };
}
