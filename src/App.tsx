/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NEIGHBORHOODS,
  INITIAL_PRODUCTS,
  DELIVERY_SLOTS,
  RECENT_NEIGHBOR_PLEDGES,
  POOL_WINDOWS,
  PICKUP_LOCATIONS,
  DOORSTEP_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  COD_HANDLING_FEE,
  calculateCurrentTier,
  USER_RADIUS_PRESETS,
} from './data/mockData';
import { Product, ProductCategory, CartItem, NeighborhoodCluster, NeighborPledgeEvent, PoolWindow, UserRadiusLocation, PaymentMethod, WalletTransaction, PoolTypeFilter, PoolNotificationOptIn, PatentedFarm, SavedLocation } from './types';
import {
  getSavedLocations,
  getActiveUserLocation,
  setActiveUserLocation,
  requestDeviceLocation,
  saveLocationsToStorage,
  savedLocationToUserRadiusLocation,
} from './utils/locationService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { LivePledgeTicker } from './components/LivePledgeTicker';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PatentedFarmModal } from './components/PatentedFarmModal';
import { DeliveryScheduleView } from './components/DeliveryScheduleView';
import { CommunityOptimizer } from './components/CommunityOptimizer';
import { CartDrawer } from './components/CartDrawer';
import { OrdersView } from './components/OrdersView';
import { InviteModal } from './components/InviteModal';
import { StartPoolModal } from './components/StartPoolModal';
import { RadiusCheckerModal } from './components/RadiusCheckerModal';
import { WalletModal } from './components/WalletModal';
import { PoolTypeTabs } from './components/PoolTypeTabs';
import { TipsGuideModal } from './components/TipsGuideModal';
import { NotifyWhenPooledModal } from './components/NotifyWhenPooledModal';
import { PoolEngineInspectorModal } from './components/PoolEngineInspectorModal';
import { AdminPanelView } from './components/AdminPanelView';
import { CommunityLogo } from './components/CommunityLogo';
import { OffersForYouBanner } from './components/OffersForYouBanner';
import { BestsellersQuadrantGrid } from './components/BestsellersQuadrantGrid';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  Sparkles,
  Leaf,
  CheckCircle2,
  Clock,
  Zap,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  Building,
  Home,
  Navigation,
  MapPin,
  Wallet,
  Banknote,
} from 'lucide-react';

export default function App() {
  const [neighborhood, setNeighborhood] = useState<NeighborhoodCluster>(NEIGHBORHOODS[0]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => getSavedLocations());
  const [userLocation, setUserLocation] = useState<UserRadiusLocation>(() => getActiveUserLocation());
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('app_inventory_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'schedule' | 'optimizer' | 'orders' | 'admin'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedPoolWindowFilter, setSelectedPoolWindowFilter] = useState<'all' | 'small_quick' | 'standard_evening' | 'mega_wholesale'>('all');
  const [poolTypeFilter, setPoolTypeFilter] = useState<PoolTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'most_pooled' | 'highest_discount' | 'price_low'>('most_pooled');
  const [pledges, setPledges] = useState<NeighborPledgeEvent[]>(RECENT_NEIGHBOR_PLEDGES);

  // Auto-query device GPS permission on initial load if supported and permitted
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            requestDeviceLocation(NEIGHBORHOODS).then((result) => {
              if (result.success && result.latitude && result.longitude) {
                const detectedLoc: UserRadiusLocation = {
                  address: result.address || `GPS Location (${Math.round(result.latitude * 1000) / 1000}°, ${Math.round(result.longitude * 1000) / 1000}°)`,
                  society: result.society || neighborhood.name,
                  distanceKm: result.distanceKm || 1.5,
                  isWithinRadius: (result.distanceKm || 1.5) <= 5.0,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  accuracyMeters: result.accuracyMeters,
                  detectedViaGps: true,
                };
                setUserLocation(detectedLoc);
                setActiveUserLocation(detectedLoc);
              }
            });
          }
        })
        .catch(() => {
          // Ignore unsupported permission queries
        });
    }
  }, []);

  // Handler to auto-detect phone GPS on demand
  const handleDetectPhoneGps = async () => {
    showToast('📡 Querying phone GPS for exact location...');
    const result = await requestDeviceLocation(NEIGHBORHOODS);
    if (result.success && result.latitude && result.longitude) {
      const detectedLoc: UserRadiusLocation = {
        address: result.address || `GPS Location (${Math.round(result.latitude * 1000) / 1000}°, ${Math.round(result.longitude * 1000) / 1000}°)`,
        society: result.society || neighborhood.name,
        distanceKm: result.distanceKm || 1.5,
        isWithinRadius: (result.distanceKm || 1.5) <= 5.0,
        latitude: result.latitude,
        longitude: result.longitude,
        accuracyMeters: result.accuracyMeters,
        detectedViaGps: true,
      };
      setUserLocation(detectedLoc);
      setActiveUserLocation(detectedLoc);
      showToast(`📍 Location auto-detected via Phone GPS (±${result.accuracyMeters || 10}m accuracy)!`);
    } else {
      showToast(`⚠️ ${result.errorMessage || 'Unable to access GPS.'}`);
      setIsRadiusModalOpen(true);
    }
  };

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isStartPoolOpen, setIsStartPoolOpen] = useState(false);
  const [isRadiusModalOpen, setIsRadiusModalOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedNotifyProduct, setSelectedNotifyProduct] = useState<Product | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<PatentedFarm | null>(null);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isEngineInspectorOpen, setIsEngineInspectorOpen] = useState(false);
  const [isAutoDebitEnabled, setIsAutoDebitEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Prevent background page scrolling when any drawer or modal is open
  const isAnyModalOpen =
    isCartOpen ||
    isWalletOpen ||
    isRadiusModalOpen ||
    isInviteOpen ||
    isStartPoolOpen ||
    isTipsOpen ||
    isNotifyModalOpen ||
    isDetailModalOpen ||
    isFarmModalOpen ||
    isEngineInspectorOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAnyModalOpen]);

  // Notification Opt-ins for unpooled items (stored in localStorage)
  const [notificationOptIns, setNotificationOptIns] = useState<PoolNotificationOptIn[]>(() => {
    try {
      const saved = localStorage.getItem('pool_notification_opt_ins');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Community Pool Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('community_wallet_balance');
    return saved ? parseFloat(saved) : 750;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-1',
      type: 'credit',
      amount: 150,
      description: 'Welcome Society Joining Bonus',
      date: 'Today, 9:00 AM',
      balanceAfter: 150,
    },
    {
      id: 'tx-2',
      type: 'credit',
      amount: 600,
      description: 'Prepaid Society Pool Deposit (UPI)',
      date: 'Today, 9:15 AM',
      balanceAfter: 750,
    },
  ]);

  const handleWalletAddFunds = (amount: number, bonus: number = 0) => {
    const totalAdded = amount + bonus;
    const newBal = walletBalance + totalAdded;
    setWalletBalance(newBal);
    localStorage.setItem('community_wallet_balance', String(newBal));

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: bonus > 0 ? 'cashback' : 'credit',
      amount: totalAdded,
      description: bonus > 0 ? `Recharge ₹${amount} (+₹${bonus} Bonus)` : `Wallet Top-Up ₹${amount}`,
      date: 'Just now',
      balanceAfter: newBal,
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    showToast(`Added ₹${totalAdded} to Pool Wallet! Available balance: ₹${newBal}`);
  };

  // Placed Orders state
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ord-101',
      orderNumber: 'CM-9082',
      items: [
        { name: 'Nashik Red Farm Onions', qty: 3, unit: 'kg', price: 29, saved: 57 },
        { name: 'Kolar Vine-Ripe Tomatoes', qty: 2, unit: 'kg', price: 25, saved: 38 },
        { name: 'Hydroponic Tender Baby Spinach', qty: 1, unit: 'pack', price: 28, saved: 22 },
      ],
      totalAmount: 195, // 165 + 30 doorstep fee
      totalSaved: 117,
      slotName: 'Evening Dinner Prep Batch',
      timeWindow: 'Today 6:00 PM – 7:30 PM',
      deliveryMode: 'doorstep' as const,
      deliveryFee: 30,
      paymentMethod: 'wallet' as const,
      codFee: 0,
      flatAddress: 'Tower B - House 402, 4th Floor',
      poolWindowName: 'Small Quick Pool (3-5 Houses)',
      status: 'sorting' as const,
      placedTime: '18 mins ago',
    },
    {
      id: 'ord-102',
      orderNumber: 'CM-9044',
      items: [
        { name: 'Fresh A2 Gir Cow Farm Milk', qty: 2, unit: 'Litre', price: 62, saved: 56 },
        { name: 'Himachal Royal Gala Apples', qty: 1, unit: 'kg', price: 140, saved: 80 },
      ],
      totalAmount: 309, // 264 + 30 delivery + 15 COD fee
      totalSaved: 136,
      slotName: 'Dawn Farm Harvest Batch',
      timeWindow: 'Tomorrow 7:00 AM – 8:30 AM',
      deliveryMode: 'doorstep' as const,
      deliveryFee: 30,
      paymentMethod: 'cod' as const,
      codFee: 15,
      flatAddress: 'Tower C - House 702, 7th Floor',
      poolWindowName: 'Evening Society Pool (15-30 Houses)',
      status: 'pooling' as const,
      placedTime: '1 hour ago',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Cart operations
  const handleUpdateCart = (product: Product, newQty: number) => {
    const existing = cart.find((item) => item.product.id === product.id);
    const prevQty = existing ? existing.quantity : 0;
    const qtyDiff = newQty - prevQty;

    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== product.id));
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id) {
            const cur = p.currentQuantity ?? p.currentPoolKg ?? 0;
            const updated = Math.max(0, cur + qtyDiff);
            return {
              ...p,
              currentQuantity: updated,
              currentPoolKg: updated,
            };
          }
          return p;
        })
      );
      return;
    }

    const tierInfo = calculateCurrentTier(product);
    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: newQty,
                currentPrice: tierInfo.currentPrice,
                currentDiscountPct: tierInfo.currentDiscountPct,
                tierIndex: tierInfo.tierIndex,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            quantity: newQty,
            currentPrice: tierInfo.currentPrice,
            currentDiscountPct: tierInfo.currentDiscountPct,
            tierIndex: tierInfo.tierIndex,
          },
        ];
      }
    });

    // Update pool committed quantity atomically
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          const cur = p.currentQuantity ?? p.currentPoolKg ?? 0;
          const updated = Math.max(0, cur + qtyDiff);
          return {
            ...p,
            currentQuantity: updated,
            currentPoolKg: updated,
          };
        }
        return p;
      })
    );
  };

  const handleUpdateCartFromDrawer = (productId: string, newQty: number) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      handleUpdateCart(prod, newQty);
    }
  };

  const handlePledgeDirect = (product: Product, addedKg: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          const newWeight = p.currentPoolKg + addedKg;
          return { ...p, currentPoolKg: newWeight, pledgerCount: p.pledgerCount + 1 };
        }
        return p;
      })
    );

    handleUpdateCart(product, addedKg);
    showToast(`Pledged +${addedKg}kg to ${product.name}! Small pool progress updated.`);
  };

  // Open Product Detail Modal (Blinkit Style PDP)
  const handleOpenProductDetail = (product: Product) => {
    setSelectedDetailProduct(product);
    setIsDetailModalOpen(true);
  };

  // Open Patented Farm Modal (Farm profile, photos, owner, and app awards)
  const handleOpenFarmModal = (farm: PatentedFarm) => {
    setSelectedFarm(farm);
    setIsFarmModalOpen(true);
  };

  // Open Notify When Pooled Modal for unpooled product
  const handleOpenNotifyModal = (product: Product) => {
    setSelectedNotifyProduct(product);
    setIsNotifyModalOpen(true);
  };

  // Save opt-in preferences for unpooled products
  const handleSaveOptIn = (optIn: PoolNotificationOptIn, alsoPledge: boolean) => {
    setNotificationOptIns((prev) => {
      const filtered = prev.filter((o) => o.productId !== optIn.productId);
      const next = [...filtered, optIn];
      localStorage.setItem('pool_notification_opt_ins', JSON.stringify(next));
      return next;
    });

    if (alsoPledge && selectedNotifyProduct) {
      handlePledgeToActivate(selectedNotifyProduct);
    }

    showToast(`🔔 Alert activated for ${optIn.productName}! You will be alerted via ${optIn.channel.toUpperCase()} when threshold is met.`);
  };

  // Advance pledge count towards activating an unpooled product
  const handlePledgeToActivate = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          const threshold = p.poolActivationThreshold || 5;
          const newCount = (p.currentPledgesCount || 0) + 1;
          const activated = newCount >= threshold;

          if (activated) {
            showToast(`🎉 POOL ACTIVATED! ${p.name} reached ${newCount}/${threshold} pledges! Pool is now live.`);
            return {
              ...p,
              currentPledgesCount: newCount,
              hasActivePool: true,
              poolType: 'small' as const,
              pledgerCount: newCount,
              currentPoolKg: Math.max(5, (p.poolTargetKg || 10) * 0.4),
            };
          } else {
            showToast(`⚡ Added 1 pledge for ${p.name}! ${newCount}/${threshold} neighbors pledged (${threshold - newCount} more needed).`);
            return {
              ...p,
              currentPledgesCount: newCount,
            };
          }
        }
        return p;
      })
    );
  };

  // Simulate a neighbor joining the pool
  const handleSimulateNeighborPledge = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomKg = Math.floor(Math.random() * 4) + 2; // 2 to 5 kg
    const towerNames = ['Tower A', 'Tower B', 'Tower C', 'Tower D'];
    const randomTower = towerNames[Math.floor(Math.random() * towerNames.length)];
    const randomFlatNum = `${randomTower.split(' ')[1]}-${Math.floor(Math.random() * 800) + 101}`;
    const neighborNames = [
      'Devika Nair',
      'Karthik Subramanian',
      'Shalini Kapoor',
      'Arun George',
      'Deepa Patel',
      'Rohan Joshi',
    ];
    const randomName = neighborNames[Math.floor(Math.random() * neighborNames.length)];

    let tierUnlockedName: string | undefined;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === randomProduct.id) {
          const oldTier = calculateCurrentTier(p).tierIndex;
          const updatedKg = p.currentPoolKg + randomKg;
          const updatedProduct = { ...p, currentPoolKg: updatedKg, pledgerCount: p.pledgerCount + 1 };
          const newTier = calculateCurrentTier(updatedProduct).tierIndex;

          if (newTier > oldTier) {
            tierUnlockedName = `Unlocked ${p.tiers[newTier].label}!`;
          }
          return updatedProduct;
        }
        return p;
      })
    );

    const newEvent: NeighborPledgeEvent = {
      id: `p-${Date.now()}`,
      neighborName: randomName,
      flat: randomFlatNum,
      tower: randomTower,
      productName: randomProduct.name,
      quantityKg: randomKg,
      timeAgo: 'Just now',
      tierUnlocked: tierUnlockedName,
    };

    setPledges((prev) => [newEvent, ...prev.slice(0, 7)]);

    if (tierUnlockedName) {
      showToast(`🎉 ${randomName} (${randomFlatNum}) just pushed ${randomProduct.name} into ${tierUnlockedName}!`);
    } else {
      showToast(`⚡ ${randomName} (${randomFlatNum}) pledged ${randomKg}kg in small pool!`);
    }
  };

  // Order Placement with Doorstep (₹30) or Pick-up (FREE), plus Wallet / COD / UPI
  const handleProceedToCheckout = (
    slotId: string,
    deliveryMode: 'pickup' | 'doorstep',
    pickupLocationId?: string,
    flatAddress?: string,
    selectedPoolWindowId?: string,
    paymentMethod: PaymentMethod = 'wallet',
    codFee: number = 0
  ) => {
    const slotObj = DELIVERY_SLOTS.find((s) => s.id === slotId) || DELIVERY_SLOTS[0];
    const poolWindowObj = POOL_WINDOWS.find((w) => w.id === selectedPoolWindowId) || POOL_WINDOWS[0];
    const pickupLoc = PICKUP_LOCATIONS.find((l) => l.id === pickupLocationId) || PICKUP_LOCATIONS[0];

    let standardTotal = 0;
    let itemsTotal = 0;
    const orderItemsSummary = cart.map((item) => {
      const tierInfo = calculateCurrentTier(item.product);
      standardTotal += item.product.standardRetailPrice * item.quantity;
      itemsTotal += tierInfo.currentPrice * item.quantity;
      return {
        name: item.product.name,
        qty: item.quantity,
        unit: item.product.unit,
        price: tierInfo.currentPrice,
        saved: (item.product.standardRetailPrice - tierInfo.currentPrice) * item.quantity,
      };
    });

    const isFreeDelivery = itemsTotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryFee = isFreeDelivery ? 0 : DOORSTEP_DELIVERY_FEE;
    const appliedCodFee = paymentMethod === 'cod' ? (codFee || COD_HANDLING_FEE) : 0;
    const finalPayable = itemsTotal + deliveryFee + appliedCodFee;

    // If paid by wallet, debit funds
    if (paymentMethod === 'wallet') {
      if (walletBalance >= finalPayable) {
        const newBal = walletBalance - finalPayable;
        setWalletBalance(newBal);
        localStorage.setItem('community_wallet_balance', String(newBal));
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'debit',
          amount: finalPayable,
          description: `Order Pool Lock (${cart.length} items)`,
          date: 'Just now',
          balanceAfter: newBal,
        };
        setWalletTransactions((prev) => [newTx, ...prev]);
      } else {
        setIsWalletOpen(true);
        showToast(`Wallet short by ₹${Math.ceil(finalPayable - walletBalance)}. Top up to confirm order!`);
        return;
      }
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `CM-${Math.floor(Math.random() * 8999) + 1000}`,
      items: orderItemsSummary,
      totalAmount: finalPayable,
      totalSaved: (standardTotal - itemsTotal) + (isFreeDelivery ? DOORSTEP_DELIVERY_FEE : 0),
      slotName: slotObj.name,
      timeWindow: slotObj.timeWindow,
      deliveryMode: 'doorstep' as const,
      deliveryFee,
      paymentMethod,
      codFee: appliedCodFee,
      flatAddress: flatAddress || 'Direct Doorstep Delivery',
      poolWindowName: poolWindowObj.title,
      status: 'pooling' as const,
      placedTime: 'Just now',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('orders');

    if (paymentMethod === 'cod') {
      showToast(
        `Order #${newOrder.orderNumber} placed with Cash On Delivery! Total to pay on arrival: ₹${finalPayable} (+₹${appliedCodFee} COD fee included).`
      );
    } else if (paymentMethod === 'wallet') {
      showToast(
        `Order #${newOrder.orderNumber} locked! ₹${finalPayable} debited from Pool Wallet (Remaining: ₹${walletBalance - finalPayable}).`
      );
    } else {
      showToast(
        `Order #${newOrder.orderNumber} placed! Prepaid ₹${finalPayable} via UPI.`
      );
    }
  };

  // Advance Order Lifecycle Simulation
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const flow: Array<typeof ord.status> = [
            'pooling',
            'harvesting',
            'sorting',
            'out_for_delivery',
            'delivered',
          ];
          const currIdx = flow.indexOf(ord.status);
          const nextIdx = (currIdx + 1) % flow.length;
          const nextStatus = flow[nextIdx];
          showToast(`Order #${ord.orderNumber} advanced to: ${nextStatus.replace('_', ' ').toUpperCase()}`);
          return { ...ord, status: nextStatus };
        }
        return ord;
      })
    );
  };

  // Launch a user-proposed pool
  const handlePoolCreated = (name: string, targetKg: number, origin: string) => {
    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name,
      hindiName: 'सामुदायिक पूल (Community Proposed)',
      category: 'staples',
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      unit: '1 kg',
      standardRetailPrice: 120,
      basePrice: 105,
      tiers: [
        { minKg: 0, pricePerKg: 105, discountPct: 12, label: 'Base Pool' },
        { minKg: Math.round(targetKg * 0.3), pricePerKg: 90, discountPct: 25, label: '⚡ Small Pool (Below Retail)' },
        { minKg: Math.round(targetKg * 0.6), pricePerKg: 78, discountPct: 35, label: '🌆 Wholesale' },
        { minKg: targetKg, pricePerKg: 65, discountPct: 46, label: '🚜 Direct Harvest' },
      ],
      currentPoolKg: 4,
      maxTierCapacityKg: targetKg,
      pledgerCount: 1,
      farmOrigin: origin,
      harvestWindow: 'Proposed by Resident Today',
      description: `Community-proposed bulk item for ${neighborhood.shortName}. Neighbors grouping orders to unlock wholesale mandi rates.`,
      badges: ['Community Proposed', 'Direct Sourced', 'New Pool'],
      hasActivePool: true,
      poolType: 'both',
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`New bulk pool "${name}" launched for ${neighborhood.shortName}!`);
  };

  // Scroll to Bestsellers Category Quadrant Grid
  const handleScrollToCategories = () => {
    const el = document.getElementById('categories-quadrant-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      // Category filter
      if (selectedCategory === 'only_organic') {
        if (!p.organicCertified || !p.patentedFarm) return false;
      } else if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Pool Type filter (Small vs Large vs Unpooled vs All)
      if (poolTypeFilter === 'small') {
        if (!p.hasActivePool || (p.poolType !== 'small' && p.poolType !== 'both')) return false;
      } else if (poolTypeFilter === 'large') {
        if (!p.hasActivePool || (p.poolType !== 'large' && p.poolType !== 'both')) return false;
      } else if (poolTypeFilter === 'unpooled') {
        if (p.hasActivePool) return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.farmOrigin.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'most_pooled') {
        return b.currentPoolKg - a.currentPoolKg;
      }
      if (sortBy === 'highest_discount') {
        const discountA = calculateCurrentTier(a).currentDiscountPct;
        const discountB = calculateCurrentTier(b).currentDiscountPct;
        return discountB - discountA;
      }
      if (sortBy === 'price_low') {
        const priceA = calculateCurrentTier(a).currentPrice;
        const priceB = calculateCurrentTier(b).currentPrice;
        return priceA - priceB;
      }
      return 0;
    });

  // Calculate cart counts and savings
  const cartItemCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  let totalSavingsSoFar = 0;
  let cartTotalPayable = 0;
  cart.forEach((it) => {
    const tierInfo = calculateCurrentTier(it.product);
    totalSavingsSoFar += (it.product.standardRetailPrice - tierInfo.currentPrice) * it.quantity;
    cartTotalPayable += tierInfo.currentPrice * it.quantity;
  });

  return (
    <div className="min-h-screen min-h-dvh w-full overflow-x-hidden bg-[#F7F9F6] text-[#172A1E] flex flex-col font-sans pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#164E2A] text-white border border-[#439A52] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-[#F27A24] text-white flex items-center justify-center font-black shrink-0">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <p className="text-xs font-bold leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* Community Header */}
      <Navbar
        neighborhoods={NEIGHBORHOODS}
        selectedNeighborhood={neighborhood}
        onSelectNeighborhood={(n) => {
          setNeighborhood(n);
          showToast(`Switched society to ${n.name}`);
        }}
        userLocation={userLocation}
        onOpenRadiusModal={() => setIsRadiusModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        poolTypeFilter={poolTypeFilter}
        onSelectPoolTypeFilter={setPoolTypeFilter}
        cartCount={cartItemCount}
        cartTotalSavings={totalSavingsSoFar}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenInviteModal={() => setIsInviteOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenEngineInspector={() => setIsEngineInspectorOpen(true)}
        savedLocations={savedLocations}
        onSelectSavedLocation={(loc) => {
          const converted = savedLocationToUserRadiusLocation(loc);
          setUserLocation(converted);
          setActiveUserLocation(converted);
          showToast(`📍 Delivering to: ${loc.title}`);
        }}
        onDetectGps={handleDetectPhoneGps}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        {/* Dynamic Tab Views */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Clean Society Summary Bar - Focused directly on buying pools */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white border border-[#DFEBDE] rounded-2xl px-4 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#164E2A] text-white flex items-center justify-center font-bold shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#172A1E] text-sm truncate">
                      {neighborhood.name}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-[#E8F4E9] text-[#164E2A] px-2 py-0.5 rounded-full shrink-0 border border-[#CEE2D1]">
                      Active Pool Hub
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A6F61] font-medium truncate">
                    Consolidated Buying Pools • Next Batch Locks 6:00 PM • Direct Doorstep Delivery (FREE on ₹399+ • ₹30 below)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRadiusModalOpen(true)}
                  className="text-xs font-bold text-[#164E2A] hover:text-[#113E21] bg-[#F7F9F6] hover:bg-[#EEF3EE] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-[#DFEBDE]"
                  title="Check 5km radius pooling corridor"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#439A52]" />
                  <span>5km Radius ({userLocation.distanceKm} km)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTipsOpen(true)}
                  className="text-xs font-black text-white bg-[#F27A24] hover:bg-[#DE6818] px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="View all pooling tips, rules & difference guide"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#F27A24] font-black text-[10px] flex items-center justify-center">?</span>
                  <span>Tips & Rules</span>
                </button>
              </div>
            </div>

            {/* OFFERS FOR YOU - Golden Promo Strip from reference design */}
            <OffersForYouBanner
              onOpenRadiusModal={() => setIsRadiusModalOpen(true)}
              onSelectOffer={(code) =>
                showToast(`Promo code "${code}" added! Extra discount active on next batch order.`)
              }
            />

            {/* BESTSELLERS - 2x3 Category Quadrant Grid from reference design */}
            <div id="categories-quadrant-section">
              <BestsellersQuadrantGrid
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  showToast(`Viewing ${cat === 'all' ? 'All Items' : cat}`);
                }}
                onSelectPoolTypeFilter={setPoolTypeFilter}
              />
            </div>

            {/* Section 2: Grocery & Kitchen Section Header matching reference design */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pt-1 pb-0.5 px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-1.5">
                    {selectedCategory === 'only_organic' && (
                      <span className="w-6 h-6 rounded-full bg-[#0c831f] text-white flex items-center justify-center shrink-0">
                        <Leaf className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span>
                      {selectedCategory === 'all'
                        ? 'Grocery & Kitchen'
                        : selectedCategory === 'only_organic'
                        ? 'Only Organic (Patented Bio-Farms)'
                        : selectedCategory === 'veggies'
                        ? 'Fresh Vegetables & Greens'
                        : selectedCategory === 'fruits'
                        ? 'Orchard Fruits'
                        : selectedCategory === 'staples'
                        ? 'Atta, Rice & Grains'
                        : selectedCategory === 'dairy_fresh'
                        ? 'Dairy, Bread & Cold Ghee'
                        : selectedCategory === 'coldpressed_oils'
                        ? 'Cold-Pressed Oils & Ghee'
                        : selectedCategory === 'snacks'
                        ? 'Chips, Namkeen & Snacks'
                        : selectedCategory === 'bakery'
                        ? 'Bakery & Fresh Pav'
                        : selectedCategory === 'beverages'
                        ? 'Drinks, Coconuts & Cold Brews'
                        : selectedCategory === 'dryfruits_masala'
                        ? 'Dry Fruits, Whole Spices & Nuts'
                        : 'Wholesale Crates & Bulk Sacks'}
                    </span>
                  </h2>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    selectedCategory === 'only_organic'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'text-[#164E2A] bg-[#E8F4E9] border-[#CEE2D1]'
                  }`}>
                    {filteredProducts.length} Items
                  </span>
                  {poolTypeFilter !== 'all' && (
                    <button
                      onClick={() => setPoolTypeFilter('all')}
                      className="text-[10px] font-black text-[#F27A24] bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>
                        {poolTypeFilter === 'small'
                          ? '⚡ Small Pools'
                          : poolTypeFilter === 'large'
                          ? '🚜 Wholesale'
                          : '🔔 Awaiting'}
                      </span>
                      <span className="font-bold">✕</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SPECIAL ONLY ORGANIC HERO STRIP */}
              {selectedCategory === 'only_organic' && (
                <div className="bg-gradient-to-r from-[#164E2A] via-[#1b5e33] to-[#0c831f] text-white p-3.5 sm:p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md text-emerald-300 flex items-center justify-center shrink-0 border border-white/20">
                      <Leaf className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm sm:text-base text-white">
                          100% Certified Organic • Patented Bio-Farm Sourced
                        </h3>
                        <span className="text-[10px] uppercase font-black tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow-2xs">
                          App Verified 🏆
                        </span>
                      </div>
                      <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                        Fresh organic vegetables & fruits harvested on patented bio-soil farms with zero synthetic chemicals. Tap any farm box below to inspect owners, photos, and app awards.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 text-emerald-100">
                      Zero Pesticides Guarantee
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Pool Type Tabs: Symbols & Short Info (Small, Non-Intrusive) */}
            <PoolTypeTabs
              currentFilter={poolTypeFilter}
              onSelectFilter={setPoolTypeFilter}
              neighborhood={neighborhood}
              smallPoolCount={products.filter((p) => p.hasActivePool && (p.poolType === 'small' || p.poolType === 'both')).length}
              largePoolCount={products.filter((p) => p.hasActivePool && (p.poolType === 'large' || p.poolType === 'both')).length}
              unpooledCount={products.filter((p) => !p.hasActivePool).length}
              totalProductCount={products.length}
              onOpenTips={() => setIsTipsOpen(true)}
            />

            {/* Product Catalog Grid - Direct Buying Pools Content */}
            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#DFEBDE] p-12 text-center space-y-3">
                  <p className="text-slate-500 text-sm font-bold">No products match your filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setPoolTypeFilter('all');
                    }}
                    className="text-xs font-black text-[#164E2A] underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredProducts.map((product) => {
                    const cartItem = cart.find((it) => it.product.id === product.id);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={cartItem ? cartItem.quantity : 0}
                        onUpdateCart={handleUpdateCart}
                        onPledgeDirect={handlePledgeDirect}
                        onOpenDetail={handleOpenProductDetail}
                        onOpenFarmModal={handleOpenFarmModal}
                        poolTypeFilter={poolTypeFilter}
                        isNotified={notificationOptIns.some((o) => o.productId === product.id)}
                        notificationOptIn={notificationOptIns.find((o) => o.productId === product.id)}
                        onOpenNotifyModal={handleOpenNotifyModal}
                        onPledgeToActivate={handlePledgeToActivate}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <DeliveryScheduleView
            neighborhood={neighborhood}
            onOpenOptimizer={() => setActiveTab('optimizer')}
          />
        )}

        {activeTab === 'optimizer' && (
          <CommunityOptimizer neighborhood={neighborhood} />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            neighborhood={neighborhood}
            orders={orders}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onOpenCatalog={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView
            products={products}
            onUpdateProducts={(newProducts) => {
              setProducts(newProducts);
            }}
            onOpenFarmModal={handleOpenFarmModal}
            onBackToStore={() => {
              setActiveTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={(msg) => showToast(msg)}
          />
        )}
      </main>

      {/* Floating Bottom Cart Bar (Visible on mobile & desktop with Blinkit product thumbnails) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-[4.2rem] md:bottom-4 inset-x-0 z-40 max-w-lg mx-auto px-3 sm:px-4 animate-in slide-in-from-bottom-4 duration-200">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-[#0c831f] hover:bg-[#0a6e1a] text-white p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-emerald-400/40 transition-all active:scale-98 shadow-emerald-950/20"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Blinkit Style Overlapping Product Thumbnails */}
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                {cart.slice(0, 3).map((item) => (
                  <div
                    key={item.product.id}
                    className="w-8 h-8 rounded-lg bg-white p-0.5 border-2 border-[#0c831f] shadow-xs overflow-hidden"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                ))}
                {cart.length > 3 && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-900 border-2 border-[#0c831f] text-[10px] font-black text-white flex items-center justify-center shadow-xs">
                    +{cart.length - 3}
                  </div>
                )}
              </div>

              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-sm text-white">
                    {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                  </span>
                  <span className="text-xs text-emerald-200">•</span>
                  <span className="font-black text-sm text-amber-200">
                    ₹{cartTotalPayable}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-emerald-100 font-semibold truncate">
                  Direct Doorstep •{' '}
                  {cartTotalPayable >= 399
                    ? 'FREE Delivery Unlocked 🎉'
                    : `Add ₹${399 - cartTotalPayable} for FREE`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 font-black text-xs bg-white text-[#0c831f] px-3 sm:px-3.5 py-2 rounded-xl shadow-xs shrink-0 ml-2">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer with Blinkit Style Item Display & Direct Doorstep Delivery */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        allProducts={products}
        onAddToCart={(p) => handleUpdateCart(p, 1)}
        onOpenProductDetail={handleOpenProductDetail}
        neighborhood={neighborhood}
        userLocation={userLocation}
        onOpenRadiusModal={() => {
          setIsCartOpen(false);
          setIsRadiusModalOpen(true);
        }}
        deliverySlots={DELIVERY_SLOTS}
        onUpdateQuantity={handleUpdateCartFromDrawer}
        onClearCart={() => setCart([])}
        walletBalance={walletBalance}
        onOpenWallet={() => {
          setIsCartOpen(false);
          setIsWalletOpen(true);
        }}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Blinkit Style Product Detail & Description Modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailProduct(null);
        }}
        product={selectedDetailProduct}
        quantityInCart={
          selectedDetailProduct
            ? cart.find((it) => it.product.id === selectedDetailProduct.id)?.quantity || 0
            : 0
        }
        onUpdateCart={handleUpdateCart}
        allProducts={products}
        onSelectProduct={(p) => {
          setSelectedDetailProduct(p);
        }}
        onOpenFarmModal={(farm) => {
          setIsDetailModalOpen(false);
          handleOpenFarmModal(farm);
        }}
        onOpenSearch={() => {
          const searchInput = document.getElementById('catalog-search-input');
          if (searchInput) {
            searchInput.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Patented Bio-Farm Modal with Photos, Owner Story & App Awards */}
      <PatentedFarmModal
        isOpen={isFarmModalOpen}
        onClose={() => {
          setIsFarmModalOpen(false);
          setSelectedFarm(null);
        }}
        farm={selectedFarm}
        allProducts={products}
        onAddToCart={(prod) => {
          handleUpdateCart(prod, 1);
          showToast(`Added ${prod.name} from ${selectedFarm?.name} to cart!`);
        }}
        onOpenProductDetail={handleOpenProductDetail}
      />

      {/* Community Pool Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={walletBalance}
        transactions={walletTransactions}
        onAddFunds={handleWalletAddFunds}
        autoDebitEnabled={isAutoDebitEnabled}
        onToggleAutoDebit={setIsAutoDebitEnabled}
      />

      {/* 5km Radius Eligibility & Location Settings Modal */}
      <RadiusCheckerModal
        isOpen={isRadiusModalOpen}
        onClose={() => setIsRadiusModalOpen(false)}
        neighborhood={neighborhood}
        userLocation={userLocation}
        savedLocations={savedLocations}
        onUpdateSavedLocations={setSavedLocations}
        onSelectNeighborhood={(n) => {
          setNeighborhood(n);
          showToast(`Switched society cluster to ${n.name}`);
        }}
        onSelectUserLocation={(loc) => {
          setUserLocation(loc);
          if (loc.isWithinRadius) {
            showToast(`✅ Address verified (${loc.distanceKm} km from hub): Within 5.0 km radius! Eligible for doorstep pooling.`);
          } else {
            showToast(`⚠️ Location is ${loc.distanceKm} km away: Outside the 5.0 km delivery corridor.`);
          }
        }}
        onShowToast={(msg) => showToast(msg)}
      />

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        neighborhood={neighborhood}
      />

      {/* Start Pool Modal */}
      <StartPoolModal
        isOpen={isStartPoolOpen}
        onClose={() => setIsStartPoolOpen(false)}
        neighborhood={neighborhood}
        onPoolCreated={handlePoolCreated}
      />

      {/* Community Tips, Rules & Differential Guide Modal */}
      <TipsGuideModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
        neighborhood={neighborhood}
        userLocation={userLocation}
        onOpenRadiusModal={() => {
          setIsTipsOpen(false);
          setIsRadiusModalOpen(true);
        }}
        onSimulateNeighborPledge={handleSimulateNeighborPledge}
        onOpenInviteModal={() => {
          setIsTipsOpen(false);
          setIsInviteOpen(true);
        }}
        onSelectPoolTypeFilter={(filter) => {
          setPoolTypeFilter(filter);
          setIsTipsOpen(false);
        }}
      />

      {/* Notify When Pooled Modal for unpooled items */}
      <NotifyWhenPooledModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setSelectedNotifyProduct(null);
        }}
        product={selectedNotifyProduct}
        neighborhood={neighborhood}
        existingOptIn={
          selectedNotifyProduct
            ? notificationOptIns.find((o) => o.productId === selectedNotifyProduct.id)
            : undefined
        }
        onSaveOptIn={handleSaveOptIn}
        onRemoveOptIn={(prodId) => {
          setNotificationOptIns((prev) => {
            const next = prev.filter((o) => o.productId !== prodId);
            localStorage.setItem('pool_notification_opt_ins', JSON.stringify(next));
            return next;
          });
          showToast(`Alert removed for item.`);
        }}
      />

      {/* Pool Engine & Economics Inspector Modal */}
      <PoolEngineInspectorModal
        isOpen={isEngineInspectorOpen}
        onClose={() => setIsEngineInspectorOpen(false)}
        products={products}
        onUpdateProductQuantity={(prodId, newQty) => {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === prodId ? { ...p, currentQuantity: newQty, currentPoolKg: newQty } : p
            )
          );
        }}
      />

      {/* Community Footer */}
      <footer className="bg-white border-t border-[#DFEBDE] text-slate-600 mt-12 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CommunityLogo size="sm" showTagline={false} />
            <span className="text-[#5A6F61] font-medium hidden sm:inline">| Direct Farm & Wholesale Bulk Pooling</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[#5A6F61] font-bold">
            <span className="hover:text-[#164E2A] cursor-pointer">Small Pools</span>
            <span className="hover:text-[#164E2A] cursor-pointer">Wholesale Crates</span>
            <span className="hover:text-[#164E2A] cursor-pointer">Direct Doorstep Delivery</span>
            <span className="hover:text-[#164E2A] cursor-pointer">FREE on ₹399+</span>
            <span className="hover:text-[#164E2A] cursor-pointer">Pool Wallet</span>
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#164E2A] hover:text-[#F27A24] font-black underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
            >
              <span>⚙️ Store Admin Panel (Full Page)</span>
            </button>
          </div>

          <p className="text-[#8CA091] text-[11px] font-medium">
            © 2026 COMMUNITY. Buy Together. Save Together.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Matching quick-commerce reference design) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToCategories={handleScrollToCategories}
        onOpenWallet={() => setIsWalletOpen(true)}
        walletBalance={walletBalance}
      />
    </div>
  );
}
