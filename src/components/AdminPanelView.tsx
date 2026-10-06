import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  Search,
  Filter,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  Upload,
  Tag,
  IndianRupee,
  Store,
  Users,
  Award,
  Leaf,
  BadgeCheck,
  MapPin,
  Calendar,
  Camera,
  Layers,
  Zap,
  Copy,
  Sliders,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  X,
  ExternalLink,
  Eye,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';
import { Product, ProductCategory, PatentedFarm, DiscountTier } from '../types';
import { PATENTED_FARMS } from '../data/patentedFarms';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface AdminPanelViewProps {
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onOpenFarmModal?: (farm: PatentedFarm) => void;
  onBackToStore: () => void;
  onShowToast: (message: string) => void;
}

type AdminTab = 'catalog' | 'add_product' | 'sellers_farms' | 'quick_pricing' | 'backup';

// Preset image gallery for one-click image assignment
const IMAGE_PRESETS = [
  { name: 'Organic Baby Spinach', category: 'veggies', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Vine-Ripened Tomatoes', category: 'veggies', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { name: 'Nashik Red Onions', category: 'veggies', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Pahari Potatoes', category: 'veggies', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Green Capsicum', category: 'veggies', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80' },
  { name: 'Devgad Alphonso Mangoes', category: 'fruits', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
  { name: 'Robusta Yelakki Bananas', category: 'fruits', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mahabaleshwar Strawberries', category: 'fruits', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80' },
  { name: 'Himachal Royal Apples', category: 'fruits', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
  { name: 'Nagpur Sweet Oranges', category: 'fruits', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80' },
  { name: 'A2 Gir Cow Farm Milk', category: 'dairy_fresh', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { name: 'A2 Bilona Cultured Ghee', category: 'dairy_fresh', url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80' },
  { name: 'Coldpressed Mustard Oil', category: 'coldpressed_oils', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Wood-Pressed Groundnut Oil', category: 'coldpressed_oils', url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sharbati Whole Wheat Atta', category: 'staples', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80' },
  { name: 'Daawat Rozana Basmati Rice', category: 'staples', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Artisanal Sourdough Bread', category: 'bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kashmiri Jumbo Walnuts', category: 'dryfruits_masala', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Nilgiri Whole Leaf Green Tea', category: 'beverages', url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80' },
];

const CATEGORIES_LIST: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'veggies', label: 'Vegetables & Greens', icon: '🥬' },
  { id: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
  { id: 'staples', label: 'Atta, Rice & Dal', icon: '🌾' },
  { id: 'dairy_fresh', label: 'A2 Dairy & Paneer', icon: '🥛' },
  { id: 'coldpressed_oils', label: 'Wood-Pressed Oils', icon: '🫒' },
  { id: 'snacks', label: 'Munchies & Snacks', icon: '🥨' },
  { id: 'bakery', label: 'Bakery & Breads', icon: '🥖' },
  { id: 'beverages', label: 'Tea, Coffee & Juices', icon: '☕' },
  { id: 'dryfruits_masala', label: 'Dry Fruits & Spices', icon: '🌰' },
  { id: 'wholesale_crates', label: 'Wholesale Crates', icon: '📦' },
];

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  products,
  onUpdateProducts,
  onOpenFarmModal,
  onBackToStore,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sellerFilter, setSellerFilter] = useState<string>('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // In-app delete confirmation state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Registered farms lookup
  const registeredFarms = useMemo(() => {
    return Object.values(PATENTED_FARMS);
  }, []);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    hindiName: string;
    category: ProductCategory;
    image: string;
    unit: string;
    standardRetailPrice: number;
    basePrice: number;
    tier1Kg: number;
    tier1Price: number;
    tier1Label: string;
    tier2Kg: number;
    tier2Price: number;
    tier2Label: string;
    tier3Kg: number;
    tier3Price: number;
    tier3Label: string;
    tier4Kg: number;
    tier4Price: number;
    tier4Label: string;
    farmOrigin: string;
    selectedPatentedFarmId: string;
    organicCertified: boolean;
    whereGrown: string;
    whenGrown: string;
    description: string;
    badges: string;
    hasActivePool: boolean;
    poolType: 'small' | 'large' | 'both' | 'none';
    currentPoolKg: number;
    maxTierCapacityKg: number;
    pledgerCount: number;
    poolTargetKg: number;
  }>({
    id: '',
    name: '',
    hindiName: '',
    category: 'veggies',
    image: IMAGE_PRESETS[0].url,
    unit: '1 kg',
    standardRetailPrice: 80,
    basePrice: 65,
    tier1Kg: 0,
    tier1Price: 65,
    tier1Label: 'Base Pool',
    tier2Kg: 10,
    tier2Price: 55,
    tier2Label: 'Tower Small Pool (-31%)',
    tier3Kg: 30,
    tier3Price: 45,
    tier3Label: 'Society Wholesale (-44%)',
    tier4Kg: 70,
    tier4Price: 38,
    tier4Label: 'Direct Farm Bulk (-53%)',
    farmOrigin: 'Sahyadri Bio-Reserve, Mahabaleshwar Foothills',
    selectedPatentedFarmId: 'farm-sahyadri',
    organicCertified: true,
    whereGrown: 'High Altitude Bio-Polyhouse, Mahabaleshwar Valley',
    whenGrown: 'Plucked 4:00 AM Daily • 24h Cold-Van Dispatched',
    description: '100% Organically cultivated with zero synthetic chemical sprays, using rain-fed mineral soil.',
    badges: '100% Organic, Patented Farm, Zero Chemical',
    hasActivePool: true,
    poolType: 'both',
    currentPoolKg: 12,
    maxTierCapacityKg: 70,
    pledgerCount: 5,
    poolTargetKg: 30,
  });

  // Filtered Products for Catalog tab
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      p.farmOrigin.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.patentedFarm && p.patentedFarm.name.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'only_organic' && p.organicCertified && p.patentedFarm) ||
      p.category === categoryFilter;

    const matchesSeller =
      sellerFilter === 'all' ||
      (p.patentedFarm && p.patentedFarm.id === sellerFilter) ||
      p.farmOrigin.toLowerCase().includes(sellerFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesSeller;
  });

  // Start Edit
  const handleStartEdit = (product: Product) => {
    const t = product.tiers || [
      { minKg: 0, pricePerKg: product.basePrice, discountPct: 0, label: 'Base Pool' },
      { minKg: 10, pricePerKg: Math.round(product.basePrice * 0.85), discountPct: 15, label: 'Tier 1' },
      { minKg: 25, pricePerKg: Math.round(product.basePrice * 0.7), discountPct: 30, label: 'Tier 2' },
      { minKg: 50, pricePerKg: Math.round(product.basePrice * 0.55), discountPct: 45, label: 'Tier 3' },
    ];

    setFormData({
      id: product.id,
      name: product.name,
      hindiName: product.hindiName || '',
      category: product.category,
      image: product.image,
      unit: product.unit,
      standardRetailPrice: product.standardRetailPrice || product.normalPrice || Math.round(product.basePrice * 1.3),
      basePrice: product.basePrice,
      tier1Kg: t[0]?.minKg ?? 0,
      tier1Price: t[0]?.pricePerKg ?? product.basePrice,
      tier1Label: t[0]?.label ?? 'Base Pool',
      tier2Kg: t[1]?.minKg ?? 10,
      tier2Price: t[1]?.pricePerKg ?? Math.round(product.basePrice * 0.85),
      tier2Label: t[1]?.label ?? 'Tower Small Pool (-15%)',
      tier3Kg: t[2]?.minKg ?? 25,
      tier3Price: t[2]?.pricePerKg ?? Math.round(product.basePrice * 0.7),
      tier3Label: t[2]?.label ?? 'Society Wholesale (-30%)',
      tier4Kg: t[3]?.minKg ?? 50,
      tier4Price: t[3]?.pricePerKg ?? Math.round(product.basePrice * 0.55),
      tier4Label: t[3]?.label ?? 'Direct Grower (-45%)',
      farmOrigin: product.farmOrigin || '',
      selectedPatentedFarmId: product.patentedFarm?.id || 'none',
      organicCertified: !!product.organicCertified,
      whereGrown: product.whereGrown || '',
      whenGrown: product.whenGrown || product.harvestWindow || '',
      description: product.description || '',
      badges: (product.badges || []).join(', '),
      hasActivePool: product.hasActivePool,
      poolType: product.poolType || 'both',
      currentPoolKg: product.currentPoolKg || 0,
      maxTierCapacityKg: product.maxTierCapacityKg || 50,
      pledgerCount: product.pledgerCount || 0,
      poolTargetKg: product.poolTargetKg || 25,
    });
    setEditingProductId(product.id);
    setActiveTab('add_product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Add New
  const handleStartAddNew = () => {
    setFormData({
      id: `prod-custom-${Date.now()}`,
      name: '',
      hindiName: '',
      category: 'veggies',
      image: IMAGE_PRESETS[0].url,
      unit: '1 kg',
      standardRetailPrice: 90,
      basePrice: 70,
      tier1Kg: 0,
      tier1Price: 70,
      tier1Label: 'Base Pool',
      tier2Kg: 10,
      tier2Price: 60,
      tier2Label: 'Tower Small Pool (-33%)',
      tier3Kg: 30,
      tier3Price: 48,
      tier3Label: 'Society Wholesale (-47%)',
      tier4Kg: 60,
      tier4Price: 40,
      tier4Label: 'Direct Farm Bulk (-56%)',
      farmOrigin: 'Sahyadri Living-Soil Bio-Reserve',
      selectedPatentedFarmId: 'farm-sahyadri',
      organicCertified: true,
      whereGrown: 'Terrace Slope Bio-Shield Block A',
      whenGrown: 'Morning Hand-Plucked • 24h Cold-Van Dispatched',
      description: '100% Organically cultivated with zero synthetic chemical sprays and zero carbide ripening.',
      badges: '100% Organic, Patented Farm, Zero Chemical',
      hasActivePool: true,
      poolType: 'both',
      currentPoolKg: 8,
      maxTierCapacityKg: 60,
      pledgerCount: 3,
      poolTargetKg: 30,
    });
    setEditingProductId(null);
    setActiveTab('add_product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto Compute Tiers
  const handleAutoComputeTiers = () => {
    const mrp = Number(formData.standardRetailPrice) || 100;
    const base = Number(formData.basePrice) || Math.round(mrp * 0.85);

    const t1Price = base;
    const t2Price = Math.round(mrp * 0.72);
    const t3Price = Math.round(mrp * 0.58);
    const t4Price = Math.round(mrp * 0.46);

    const t1Disc = Math.round(((mrp - t1Price) / mrp) * 100);
    const t2Disc = Math.round(((mrp - t2Price) / mrp) * 100);
    const t3Disc = Math.round(((mrp - t3Price) / mrp) * 100);
    const t4Disc = Math.round(((mrp - t4Price) / mrp) * 100);

    setFormData((prev) => ({
      ...prev,
      tier1Kg: 0,
      tier1Price: t1Price,
      tier1Label: `Base Pool (-${t1Disc}%)`,
      tier2Kg: 12,
      tier2Price: t2Price,
      tier2Label: `Tower Small Pool (-${t2Disc}%)`,
      tier3Kg: 35,
      tier3Price: t3Price,
      tier3Label: `Society Wholesale (-${t3Disc}%)`,
      tier4Kg: 80,
      tier4Price: t4Price,
      tier4Label: `Direct Grower Super-Pool (-${t4Disc}%)`,
    }));

    onShowToast('⚡ Calculated optimized 4-tier pool discounts!');
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please provide a product title');
      return;
    }

    const mrp = Number(formData.standardRetailPrice) || Number(formData.basePrice) * 1.3;
    const baseP = Number(formData.basePrice) || mrp * 0.85;

    const t1P = Number(formData.tier1Price) || baseP;
    const t2P = Number(formData.tier2Price) || Math.round(baseP * 0.85);
    const t3P = Number(formData.tier3Price) || Math.round(baseP * 0.7);
    const t4P = Number(formData.tier4Price) || Math.round(baseP * 0.55);

    const tiers: [DiscountTier, DiscountTier, DiscountTier, DiscountTier] = [
      {
        minKg: Number(formData.tier1Kg) || 0,
        pricePerKg: t1P,
        discountPct: Math.round(((mrp - t1P) / mrp) * 100),
        label: formData.tier1Label || 'Base Pool',
      },
      {
        minKg: Number(formData.tier2Kg) || 10,
        pricePerKg: t2P,
        discountPct: Math.round(((mrp - t2P) / mrp) * 100),
        label: formData.tier2Label || 'Tower Small Pool',
      },
      {
        minKg: Number(formData.tier3Kg) || 25,
        pricePerKg: t3P,
        discountPct: Math.round(((mrp - t3P) / mrp) * 100),
        label: formData.tier3Label || 'Society Wholesale',
      },
      {
        minKg: Number(formData.tier4Kg) || 50,
        pricePerKg: t4P,
        discountPct: Math.round(((mrp - t4P) / mrp) * 100),
        label: formData.tier4Label || 'Direct Grower Bulk',
      },
    ];

    const badgesArray = formData.badges
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    let assignedFarm: PatentedFarm | undefined = undefined;
    if (formData.selectedPatentedFarmId && formData.selectedPatentedFarmId !== 'none') {
      assignedFarm = PATENTED_FARMS[formData.selectedPatentedFarmId];
    }

    const newOrUpdatedProduct: Product = {
      id: editingProductId || formData.id || `prod-${Date.now()}`,
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim() || undefined,
      category: formData.category,
      image: formData.image.trim(),
      unit: formData.unit.trim() || '1 kg',
      standardRetailPrice: mrp,
      normalPrice: mrp,
      basePrice: baseP,
      tiers: tiers,
      currentPoolKg: Number(formData.currentPoolKg) || 0,
      maxTierCapacityKg: Number(formData.maxTierCapacityKg) || 60,
      pledgerCount: Number(formData.pledgerCount) || 0,
      farmOrigin:
        formData.farmOrigin.trim() ||
        (assignedFarm ? `${assignedFarm.name}, ${assignedFarm.location}` : 'Direct Partnered Society Farm'),
      harvestWindow: formData.whenGrown.trim() || 'Harvested fresh for today’s batch',
      description: formData.description.trim() || 'Direct sourced organic farm produce.',
      badges: badgesArray.length > 0 ? badgesArray : ['Farm Direct', 'Community Pooled'],
      organicCertified: formData.organicCertified,
      patentedFarm: assignedFarm,
      whereGrown: formData.whereGrown.trim() || (assignedFarm ? assignedFarm.location : undefined),
      whenGrown: formData.whenGrown.trim() || 'Morning Harvested • 24h Cold-Van Dispatched',
      hasActivePool: formData.hasActivePool,
      poolType: formData.poolType,
      poolTargetKg: Number(formData.poolTargetKg) || 30,
      currentPledgesCount: Number(formData.pledgerCount) || 0,
    };

    let updatedList: Product[];
    if (editingProductId) {
      updatedList = products.map((p) => (p.id === editingProductId ? newOrUpdatedProduct : p));
      onShowToast(`✅ Updated "${newOrUpdatedProduct.name}" successfully!`);
    } else {
      updatedList = [newOrUpdatedProduct, ...products];
      onShowToast(`✨ Added new item "${newOrUpdatedProduct.name}" to catalog!`);
    }

    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    setActiveTab('catalog');
    setEditingProductId(null);
  };

  // Execute Immediate Delete (In-App)
  const executeDelete = (productId: string, productName: string) => {
    const updatedList = products.filter((p) => p.id !== productId);
    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    if (editingProductId === productId) {
      setEditingProductId(null);
      setActiveTab('catalog');
    }
    setProductToDelete(null);
    onShowToast(`🗑️ Deleted "${productName}" from catalog.`);
  };

  // Bulk Delete Selected
  const executeBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    const updatedList = products.filter((p) => !selectedProductIds.includes(p.id));
    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    setSelectedProductIds([]);
    setIsBulkDeleteModalOpen(false);
    onShowToast(`🗑️ Successfully deleted ${count} selected products.`);
  };

  // Clear All Products
  const executeClearAll = () => {
    onUpdateProducts([]);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify([]));
    } catch {
      // ignore
    }
    setSelectedProductIds([]);
    setIsClearAllModalOpen(false);
    onShowToast(`🗑️ All products removed. Catalog is now empty.`);
  };

  // Duplicate Product
  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-copy-${Date.now()}`,
      name: `${product.name} (Copy)`,
    };
    const updatedList = [duplicated, ...products];
    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    onShowToast(`📋 Duplicated "${product.name}".`);
  };

  // Quick Toggle Organic
  const handleToggleOrganic = (productId: string) => {
    const updatedList = products.map((p) => {
      if (p.id === productId) {
        const nextOrganic = !p.organicCertified;
        return {
          ...p,
          organicCertified: nextOrganic,
          patentedFarm: nextOrganic ? p.patentedFarm || PATENTED_FARMS['farm-sahyadri'] : undefined,
        };
      }
      return p;
    });
    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    onShowToast(`🌿 Toggled organic status.`);
  };

  // Quick Toggle Pool
  const handleTogglePool = (productId: string) => {
    const updatedList = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          hasActivePool: !p.hasActivePool,
          poolType: (!p.hasActivePool ? 'both' : 'none') as 'both' | 'none',
        };
      }
      return p;
    });
    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('app_inventory_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    onShowToast(`⚡ Toggled pool status.`);
  };

  // Reset Catalog to Default initial sample
  const handleResetCatalog = () => {
    onUpdateProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem('app_inventory_products');
    } catch {
      // ignore
    }
    setSelectedProductIds([]);
    onShowToast('🔄 Store catalog restored to default initial products!');
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `community-catalog-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('📥 Catalog exported as JSON file!');
  };

  // Select all checkbox toggle
  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const totalItems = products.length;
  const organicCount = products.filter((p) => p.organicCertified && p.patentedFarm).length;
  const activePoolsCount = products.filter((p) => p.hasActivePool).length;

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#172A1E] pb-24 font-sans">
      {/* 1. In-App Single Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg">
                Delete Product?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Are you sure you want to permanently remove <span className="font-bold text-slate-900">"{productToDelete.name}"</span>? It will be instantly removed from store catalog, live pools, and cart.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(productToDelete.id, productToDelete.name)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. In-App Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg">
                Delete {selectedProductIds.length} Selected Products?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                This will permanently delete all {selectedProductIds.length} selected items from the store catalog.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeBulkDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete {selectedProductIds.length} Items</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. In-App Clear All Products Modal */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg">
                Clear Entire Store Catalog?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                This will remove all {products.length} products so you can build your custom catalog from scratch. (You can restore defaults anytime).
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeClearAll}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Admin Full-Page Header */}
      <div className="bg-[#164E2A] text-white border-b border-[#113E21] shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3">
            {/* Brand / Title & Back to Store */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToStore}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border border-white/20"
                title="Return to Customer Store Catalog"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Store</span>
              </button>

              <div className="h-6 w-px bg-white/20 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#F27A24]" />
                    Store & Catalog Admin Manager
                  </h1>
                  <span className="bg-[#F27A24] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Full Control
                  </span>
                </div>
                <p className="text-xs text-emerald-100 hidden sm:block">
                  Add, remove, change prices, descriptions, photos & manage patented bio-farms ("Who sells what")
                </p>
              </div>
            </div>

            {/* Quick Action Buttons & Stats */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-white/10 text-emerald-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#F27A24]" /> {totalItems} Items
                </span>
                <span className="bg-white/10 text-emerald-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-[#439A52]" /> {organicCount} Organic
                </span>
              </div>

              <button
                onClick={handleStartAddNew}
                className="flex items-center gap-1.5 bg-[#F27A24] hover:bg-[#d86617] text-white px-3.5 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 shadow-xs cursor-pointer ml-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#164E2A] shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Catalog ({totalItems})</span>
            </button>

            <button
              onClick={handleStartAddNew}
              className={`px-3.5 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'add_product'
                  ? 'bg-white text-[#164E2A] shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Plus className="w-4 h-4 text-[#F27A24]" />
              <span>{editingProductId ? '✏️ Edit Item' : '➕ Add Item'}</span>
            </button>

            <button
              onClick={() => setActiveTab('sellers_farms')}
              className={`px-3.5 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'sellers_farms'
                  ? 'bg-white text-[#164E2A] shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4 text-[#439A52]" />
              <span>Who Sells What (Farms & Sellers)</span>
            </button>

            <button
              onClick={() => setActiveTab('quick_pricing')}
              className={`px-3.5 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'quick_pricing'
                  ? 'bg-white text-[#164E2A] shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <IndianRupee className="w-4 h-4 text-[#F27A24]" />
              <span>Spreadsheet Price Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'backup'
                  ? 'bg-white text-[#164E2A] shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Backup & Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: PRODUCTS CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search products by title, Hindi name, farm origin, or seller..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20 focus:border-[#164E2A] font-medium"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-2.5 text-xs font-bold bg-[#F7F9F6] border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#164E2A]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="only_organic">🌿 Only Organic ({organicCount})</option>
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                  className="px-3.5 py-2.5 text-xs font-bold bg-[#F7F9F6] border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#164E2A]"
                >
                  <option value="all">All Sellers & Farms</option>
                  {registeredFarms.map((f) => (
                    <option key={f.id} value={f.id}>
                      🚜 {f.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleStartAddNew}
                  className="flex items-center gap-1.5 bg-[#164E2A] hover:bg-[#113E21] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Bulk Selection Action Bar */}
            {selectedProductIds.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-xs font-bold text-[#164E2A]">
                  <span className="w-6 h-6 rounded-full bg-[#164E2A] text-white flex items-center justify-center text-[11px]">
                    {selectedProductIds.length}
                  </span>
                  <span>Products Selected</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete ({selectedProductIds.length}) Selected</span>
                  </button>
                </div>
              </div>
            )}

            {/* Catalog Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#F7F9F6] border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 py-3.5 text-center w-10">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-slate-600 hover:text-slate-900 cursor-pointer"
                          title="Select all filtered products"
                        >
                          {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-[#164E2A]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-3 py-3.5">Product & Title</th>
                      <th className="px-3 py-3.5">Category & Unit</th>
                      <th className="px-3 py-3.5">MRP / Base / Max Tier</th>
                      <th className="px-3 py-3.5">Sourced Seller / Farm ("Who Sells")</th>
                      <th className="px-3 py-3.5">Pool Status</th>
                      <th className="px-4 py-3.5 text-right">Delete & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const lowestPrice = p.tiers && p.tiers[3] ? p.tiers[3].pricePerKg : p.basePrice;
                      const maxDiscount = Math.round(
                        (((p.standardRetailPrice || p.normalPrice || p.basePrice * 1.3) - lowestPrice) /
                          (p.standardRetailPrice || p.normalPrice || p.basePrice * 1.3)) *
                          100
                      );
                      const isSelected = selectedProductIds.includes(p.id);

                      return (
                        <tr
                          key={p.id}
                          className={`transition-colors group ${
                            isSelected ? 'bg-emerald-50/60' : 'hover:bg-[#F9FCF9]'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelectProduct(p.id)}
                              className="text-slate-500 hover:text-[#164E2A] cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#164E2A]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Product Info */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                              />
                              <div className="min-w-0 max-w-sm">
                                <div className="font-extrabold text-[#172A1E] text-xs sm:text-sm truncate">
                                  {p.name}
                                </div>
                                {p.hindiName && (
                                  <p className="text-[11px] text-[#439A52] font-semibold truncate">
                                    {p.hindiName}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 mt-1">
                                  {p.organicCertified && (
                                    <span className="text-[9px] bg-emerald-100 text-[#164E2A] px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                                      <Leaf className="w-2.5 h-2.5 text-[#439A52]" /> 100% Organic
                                    </span>
                                  )}
                                  {p.patentedFarm && (
                                    <span className="text-[9px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                                      <Award className="w-2.5 h-2.5 text-[#F27A24]" /> Patented Farm
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category & Unit */}
                          <td className="px-3 py-3">
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                                {CATEGORIES_LIST.find((c) => c.id === p.category)?.label || p.category}
                              </span>
                              <p className="text-[11px] text-slate-500 font-medium">{p.unit}</p>
                            </div>
                          </td>

                          {/* Pricing */}
                          <td className="px-3 py-3">
                            <div className="space-y-0.5">
                              <div className="text-slate-400 line-through text-[11px]">
                                MRP: ₹{p.standardRetailPrice || p.normalPrice || Math.round(p.basePrice * 1.3)}
                              </div>
                              <div className="font-extrabold text-[#172A1E] text-xs">
                                Base Pool: ₹{p.basePrice}
                              </div>
                              <div className="text-[11px] font-black text-[#F27A24]">
                                Min Tier: ₹{lowestPrice} ({maxDiscount}% off)
                              </div>
                            </div>
                          </td>

                          {/* Seller & Farm */}
                          <td className="px-3 py-3">
                            <div className="max-w-[240px]">
                              {p.patentedFarm ? (
                                <div>
                                  <button
                                    onClick={() => onOpenFarmModal && onOpenFarmModal(p.patentedFarm!)}
                                    className="font-extrabold text-[#164E2A] hover:underline flex items-center gap-1 text-xs text-left truncate cursor-pointer"
                                  >
                                    <Award className="w-3.5 h-3.5 text-[#F27A24] shrink-0" />
                                    <span className="truncate">{p.patentedFarm.name}</span>
                                  </button>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    Owner: {p.patentedFarm.owner.name} • {p.whereGrown || p.patentedFarm.location}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-semibold text-slate-800 text-xs truncate">
                                    {p.farmOrigin || 'Direct Partnered Farm'}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {p.whereGrown || p.harvestWindow || 'Local farm direct'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Pool Status */}
                          <td className="px-3 py-3">
                            {p.hasActivePool ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#164E2A] text-[10px] font-extrabold">
                                <Zap className="w-3 h-3 text-[#F27A24]" /> Active ({p.currentPoolKg || 0}kg / {p.maxTierCapacityKg || 50}kg)
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-semibold">
                                Unpooled
                              </span>
                            )}
                          </td>

                          {/* Action Buttons: Delete is prominent and unlocked */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-2 hover:bg-emerald-50 text-slate-600 hover:text-[#164E2A] rounded-xl transition-colors cursor-pointer border border-slate-200 hover:border-emerald-300"
                                title="Edit Item details & prices"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer border border-slate-200"
                                title="Duplicate Item"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleOrganic(p.id)}
                                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                                  p.organicCertified
                                    ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
                                    : 'text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-emerald-600'
                                }`}
                                title="Toggle Organic / Patented Status"
                              >
                                <Leaf className="w-4 h-4" />
                              </button>

                              {/* UNLOCKED DELETE BUTTON: Opens direct in-app confirm */}
                              <button
                                type="button"
                                onClick={() => setProductToDelete(p)}
                                className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all cursor-pointer border border-red-200 hover:border-red-600 shadow-2xs group/del"
                                title={`Delete "${p.name}" permanently`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                          <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-700 text-base">No products match your search or filter</p>
                          <p className="text-xs text-slate-500 mt-1">Try resetting filters or click "+ Add Product" to create new items.</p>
                          <button
                            onClick={handleStartAddNew}
                            className="mt-4 px-4 py-2 rounded-xl bg-[#164E2A] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add New Product</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'add_product' && (
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <h2 className="font-black text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                    {editingProductId ? (
                      <>
                        <Edit3 className="w-5 h-5 text-[#164E2A]" />
                        Edit Product: <span className="text-[#164E2A]">{formData.name}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-[#F27A24]" />
                        Add New Item to Catalog
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure titles, category, pack units, progressive pool tiers, patented farm origin, image and description.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={handleStartAddNew}
                      className="text-xs font-bold text-[#164E2A] hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                    >
                      <Plus className="w-3.5 h-3.5" /> Switch to Add New
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Grid Layout: Left Inputs, Right Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Fields Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-[#164E2A]" />
                      Basic Product Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Product Name (English) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mahabaleshwar Sweet Alpine Strawberries"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20 focus:border-[#164E2A] font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Hindi / Regional Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. महाबलेश्वर स्ट्रॉबेरी (Sweet Alpine Box)"
                          value={formData.hindiName}
                          onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20 focus:border-[#164E2A] font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20 focus:border-[#164E2A] font-bold"
                        >
                          {CATEGORIES_LIST.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.icon} {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Pack / Unit Size (e.g. 1 kg, 500g box, 5 L can, 3 kg crate) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1 kg net or 500g punnet"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20 focus:border-[#164E2A] font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & 4 Dynamic Tiers */}
                  <div className="bg-[#EDF5FD] p-5 rounded-2xl border border-[#D5E6F8] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#164E2A] flex items-center gap-1.5">
                          <IndianRupee className="w-4 h-4 text-[#F27A24]" />
                          Price & 4-Tier Community Pool Discounts
                        </h3>
                        <p className="text-[11px] text-slate-600">
                          Set MRP and progressive wholesale discount milestones as society neighbors join the pool.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAutoComputeTiers}
                        className="flex items-center gap-1.5 text-xs font-extrabold bg-white hover:bg-emerald-50 text-[#164E2A] border border-emerald-300 px-3.5 py-2 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#F27A24]" />
                        <span>Auto-Calculate 4 Tiers</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Standard Retail MRP (Solo App Price) ₹ *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.standardRetailPrice}
                          onChange={(e) =>
                            setFormData({ ...formData, standardRetailPrice: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Base Pool Starting Price (Tier 1) ₹ *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold text-[#164E2A]"
                        />
                      </div>
                    </div>

                    {/* 4 Tiers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                      {/* Tier 1 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                          <span>Tier 1 (Base)</span>
                          <span className="text-[#164E2A]">0 kg</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Price ₹"
                          value={formData.tier1Price}
                          onChange={(e) => setFormData({ ...formData, tier1Price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#F7F9F6] border rounded-lg font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Label"
                          value={formData.tier1Label}
                          onChange={(e) => setFormData({ ...formData, tier1Label: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] bg-[#F7F9F6] border rounded-lg font-medium text-slate-600"
                        />
                      </div>

                      {/* Tier 2 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                          <span>Tier 2 (Tower)</span>
                          <span className="text-[#F27A24]">{formData.tier2Kg} kg+</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Price ₹"
                          value={formData.tier2Price}
                          onChange={(e) => setFormData({ ...formData, tier2Price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#F7F9F6] border rounded-lg font-bold text-[#F27A24]"
                        />
                        <input
                          type="text"
                          placeholder="Label"
                          value={formData.tier2Label}
                          onChange={(e) => setFormData({ ...formData, tier2Label: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] bg-[#F7F9F6] border rounded-lg font-medium text-slate-600"
                        />
                      </div>

                      {/* Tier 3 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                          <span>Tier 3 (Society)</span>
                          <span className="text-[#164E2A]">{formData.tier3Kg} kg+</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Price ₹"
                          value={formData.tier3Price}
                          onChange={(e) => setFormData({ ...formData, tier3Price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#F7F9F6] border rounded-lg font-bold text-[#164E2A]"
                        />
                        <input
                          type="text"
                          placeholder="Label"
                          value={formData.tier3Label}
                          onChange={(e) => setFormData({ ...formData, tier3Label: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] bg-[#F7F9F6] border rounded-lg font-medium text-slate-600"
                        />
                      </div>

                      {/* Tier 4 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                          <span>Tier 4 (Direct Bulk)</span>
                          <span className="text-[#164E2A] font-black">{formData.tier4Kg} kg+</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Price ₹"
                          value={formData.tier4Price}
                          onChange={(e) => setFormData({ ...formData, tier4Price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#F7F9F6] border rounded-lg font-black text-[#164E2A]"
                        />
                        <input
                          type="text"
                          placeholder="Label"
                          value={formData.tier4Label}
                          onChange={(e) => setFormData({ ...formData, tier4Label: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] bg-[#F7F9F6] border rounded-lg font-medium text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sourcing & Patented Bio-Farm ("Who Sells What") */}
                  <div className="bg-[#F0FDF4] p-5 rounded-2xl border border-[#BBF7D0] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#164E2A] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#439A52]" />
                          Farm Sourcing, Grower & Bio-Patent Link ("Who Sells What")
                        </h3>
                        <p className="text-[11px] text-slate-600">
                          Link to an award-winning patented bio-farm or add custom seller coordinates.
                        </p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-2xs self-start sm:self-auto">
                        <input
                          type="checkbox"
                          checked={formData.organicCertified}
                          onChange={(e) => setFormData({ ...formData, organicCertified: e.target.checked })}
                          className="w-4 h-4 text-[#164E2A] rounded focus:ring-[#164E2A]"
                        />
                        <span className="text-xs font-black text-[#164E2A] flex items-center gap-1">
                          <Leaf className="w-3.5 h-3.5 text-[#439A52]" /> 100% Organic Certified
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Select Patented Bio-Farm
                        </label>
                        <select
                          value={formData.selectedPatentedFarmId}
                          onChange={(e) => {
                            const farmId = e.target.value;
                            const f = PATENTED_FARMS[farmId];
                            setFormData({
                              ...formData,
                              selectedPatentedFarmId: farmId,
                              farmOrigin: f ? `${f.name}, ${f.location}` : formData.farmOrigin,
                              whereGrown: f ? f.location : formData.whereGrown,
                            });
                          }}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold text-[#164E2A]"
                        >
                          <option value="none">-- Custom Independent Seller / Local Farm --</option>
                          {registeredFarms.map((f) => (
                            <option key={f.id} value={f.id}>
                              🏆 {f.name} ({f.location}) • {f.owner.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Seller / Farm Origin Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sahyadri Bio-Reserve, Mahabaleshwar Valley"
                          value={formData.farmOrigin}
                          onChange={(e) => setFormData({ ...formData, farmOrigin: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Where Product is Grown (Plot / Ridge / Altitude)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Plot 4, Altitude 1,200m, Sahyadri Mountain Ridge"
                          value={formData.whereGrown}
                          onChange={(e) => setFormData({ ...formData, whereGrown: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          When Product is Grown & Harvest Window
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Morning Hand-Plucked • 24h Cold-Van Dispatched"
                          value={formData.whenGrown}
                          onChange={(e) => setFormData({ ...formData, whenGrown: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description & Badges */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Product Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe produce freshness, harvest method, flavor, health highlights..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Badges (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="GI-Tagged, Zero Carbide, 100% Organic, Rain-Fed"
                        value={formData.badges}
                        onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Card Preview & Image Selector */}
                <div className="space-y-5">
                  {/* Live Card Preview */}
                  <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#164E2A]" />
                      Live Store Card Preview
                    </h3>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm max-w-xs mx-auto">
                      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                        <img
                          src={formData.image || IMAGE_PRESETS[0].url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                          }}
                        />
                        {formData.organicCertified && (
                          <div className="absolute top-2 left-2 bg-[#164E2A] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                            <Leaf className="w-2.5 h-2.5 text-[#439A52]" /> 100% Organic
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-[#F27A24] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                          Save up to {Math.round((((formData.standardRetailPrice || 100) - (formData.tier4Price || 50)) / (formData.standardRetailPrice || 100)) * 100)}%
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{formData.category}</p>
                          <h4 className="font-extrabold text-[#172A1E] text-xs leading-snug truncate">
                            {formData.name || 'Product Title'}
                          </h4>
                          {formData.hindiName && (
                            <p className="text-[10px] text-[#439A52] font-semibold truncate">
                              {formData.hindiName}
                            </p>
                          )}
                        </div>

                        {/* Sourcing strip */}
                        <div className="bg-[#EDF5FD] p-2 rounded-xl text-[10px] text-slate-700 border border-[#D5E6F8]">
                          <p className="font-bold text-[#164E2A] truncate">
                            📍 {formData.farmOrigin || 'Direct Partnered Farm'}
                          </p>
                          <p className="text-slate-500 truncate text-[9px]">{formData.whenGrown || 'Fresh harvest'}</p>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 line-through mr-1">
                              ₹{formData.standardRetailPrice || 80}
                            </span>
                            <span className="text-xs font-black text-[#164E2A]">
                              ₹{formData.basePrice || 65}
                            </span>
                            <span className="text-[10px] text-slate-500"> / {formData.unit || '1 kg'}</span>
                          </div>
                          <span className="bg-[#164E2A] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                            + Pool
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Selector & Presets */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Product Image URL *
                    </label>
                    <div className="relative">
                      <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-slate-600 mb-1.5">One-Click Presets:</p>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                        {IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                image: preset.url,
                                name: prev.name || preset.name,
                              }))
                            }
                            className="text-[10px] font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#164E2A] p-1.5 rounded-lg border border-slate-200 transition-colors text-left truncate flex items-center gap-1 cursor-pointer"
                          >
                            <img src={preset.url} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
                            <span className="truncate">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons (Includes direct Delete button when editing!) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <div>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => {
                        const prod = products.find((p) => p.id === editingProductId);
                        if (prod) setProductToDelete(prod);
                      }}
                      className="px-5 py-3 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete This Item</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel & Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs shadow-lg shadow-[#164E2A]/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProductId ? 'Save Product Changes' : 'Publish Item to Catalog'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: SELLERS & FARMS DIRECTORY ("WHO SELLS WHAT") */}
        {activeTab === 'sellers_farms' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#164E2A]" />
                  Sellers & Patented Bio-Farms Directory ("Who Sells What")
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified organic grower registry, patents, certifications, owner bios, app awards, and the full catalog of items sourced per farm.
                </p>
              </div>

              <span className="bg-emerald-100 text-[#164E2A] text-xs font-black px-3.5 py-1.5 rounded-xl">
                {registeredFarms.length} Certified Bio-Farms Active
              </span>
            </div>

            {/* Farms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registeredFarms.map((farm) => {
                const productsFromThisFarm = products.filter(
                  (p) => p.patentedFarm?.id === farm.id || p.farmOrigin.toLowerCase().includes(farm.name.toLowerCase())
                );

                return (
                  <div
                    key={farm.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:border-emerald-400 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Farm Header */}
                      <div className="flex items-start gap-4">
                        <img
                          src={farm.heroImage}
                          alt={farm.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#F27A24] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              Patented Bio-Farm
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">{farm.patentNumber}</span>
                          </div>
                          <h3 className="font-black text-[#172A1E] text-base mt-1 group-hover:text-[#164E2A] transition-colors">
                            {farm.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#164E2A] shrink-0" />
                            <span className="truncate">
                              {farm.location} • Alt: {farm.altitudeMeters}m
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Owner Info & App Awards */}
                      <div className="bg-[#F7F9F6] rounded-2xl p-4 border border-[#DFEBDE] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={farm.owner.avatar}
                            alt={farm.owner.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                          />
                          <div>
                            <p className="font-black text-[#172A1E] text-xs">{farm.owner.name}</p>
                            <p className="text-[11px] text-slate-500">{farm.owner.title} ({farm.owner.experienceYears}y exp)</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-black text-[#F27A24] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> {farm.awards.length} App Awards
                          </span>
                        </div>
                      </div>

                      {/* Products Sourced from this Farm */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                            Products Sourced & Sold ({productsFromThisFarm.length})
                          </p>
                          <button
                            onClick={() => {
                              handleStartAddNew();
                              setFormData((prev) => ({
                                ...prev,
                                selectedPatentedFarmId: farm.id,
                                farmOrigin: `${farm.name}, ${farm.location}`,
                                whereGrown: farm.location,
                              }));
                            }}
                            className="text-xs font-bold text-[#164E2A] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Product for this Farm
                          </button>
                        </div>

                        {productsFromThisFarm.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {productsFromThisFarm.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleStartEdit(item)}
                                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-[#164E2A] font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                                title="Click to edit this item"
                              >
                                <span>{item.name}</span>
                                <span className="text-[10px] text-[#F27A24] font-black">
                                  ₹{item.basePrice}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No products linked to this farm yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom CTA */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onOpenFarmModal && onOpenFarmModal(farm)}
                        className="text-xs font-bold text-[#164E2A] hover:text-[#113E21] flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Farm Profile & Certificate</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSellerFilter(farm.id);
                          setActiveTab('catalog');
                        }}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Filter Catalog
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SPREADSHEET PRICE & INVENTORY EDITOR */}
        {activeTab === 'quick_pricing' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#F27A24]" />
                  Spreadsheet Quick Price & Stock Editor
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rapidly edit MRP, Base Pool Price, wholesale Tier 4 pricing, live pool status, or remove items in one view.
                </p>
              </div>

              <button
                onClick={() => onShowToast('💾 All quick price changes synchronized and saved!')}
                className="flex items-center gap-1.5 bg-[#164E2A] hover:bg-[#113E21] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#F7F9F6] border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Product Name</th>
                      <th className="px-3 py-3.5">Category</th>
                      <th className="px-3 py-3.5">MRP (₹)</th>
                      <th className="px-3 py-3.5">Base Pool Price (₹)</th>
                      <th className="px-3 py-3.5">Wholesale Tier 4 (₹)</th>
                      <th className="px-3 py-3.5">Organic Status</th>
                      <th className="px-3 py-3.5">Pool Active</th>
                      <th className="px-4 py-3.5 text-right">Delete & Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs font-bold text-[#172A1E] truncate">
                              {p.name}
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="text-xs text-slate-600 font-medium">
                            {p.category}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <input
                            type="number"
                            defaultValue={p.standardRetailPrice || p.normalPrice || Math.round(p.basePrice * 1.3)}
                            onChange={(e) => {
                              const newMRP = parseFloat(e.target.value) || 0;
                              const updated = products.map((item) =>
                                item.id === p.id
                                  ? { ...item, standardRetailPrice: newMRP, normalPrice: newMRP }
                                  : item
                              );
                              onUpdateProducts(updated);
                              localStorage.setItem('app_inventory_products', JSON.stringify(updated));
                            }}
                            className="w-24 px-3 py-1.5 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-bold"
                          />
                        </td>

                        <td className="px-3 py-3">
                          <input
                            type="number"
                            defaultValue={p.basePrice}
                            onChange={(e) => {
                              const newBase = parseFloat(e.target.value) || 0;
                              const updated = products.map((item) =>
                                item.id === p.id ? { ...item, basePrice: newBase } : item
                              );
                              onUpdateProducts(updated);
                              localStorage.setItem('app_inventory_products', JSON.stringify(updated));
                            }}
                            className="w-24 px-3 py-1.5 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-bold text-[#164E2A]"
                          />
                        </td>

                        <td className="px-3 py-3">
                          <input
                            type="number"
                            defaultValue={p.tiers && p.tiers[3] ? p.tiers[3].pricePerKg : Math.round(p.basePrice * 0.55)}
                            onChange={(e) => {
                              const newT4 = parseFloat(e.target.value) || 0;
                              const updated = products.map((item) => {
                                if (item.id === p.id && item.tiers) {
                                  const nextTiers = [...item.tiers] as [DiscountTier, DiscountTier, DiscountTier, DiscountTier];
                                  nextTiers[3] = { ...nextTiers[3], pricePerKg: newT4 };
                                  return { ...item, tiers: nextTiers };
                                }
                                return item;
                              });
                              onUpdateProducts(updated);
                              localStorage.setItem('app_inventory_products', JSON.stringify(updated));
                            }}
                            className="w-24 px-3 py-1.5 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-black text-[#F27A24]"
                          />
                        </td>

                        <td className="px-3 py-3">
                          <button
                            onClick={() => handleToggleOrganic(p.id)}
                            className={`text-[11px] font-black px-2.5 py-1 rounded-lg cursor-pointer ${
                              p.organicCertified
                                ? 'bg-emerald-100 text-[#164E2A]'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {p.organicCertified ? '🌿 BIO' : 'No'}
                          </button>
                        </td>

                        <td className="px-3 py-3">
                          <button
                            onClick={() => handleTogglePool(p.id)}
                            className={`text-[11px] font-black px-2.5 py-1 rounded-lg cursor-pointer ${
                              p.hasActivePool
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {p.hasActivePool ? '⚡ Active' : 'Off'}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="p-1.5 hover:bg-emerald-50 text-[#164E2A] rounded-xl transition-colors cursor-pointer border border-slate-200"
                              title="Full Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-colors cursor-pointer border border-red-200"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP, RESTORE & CLEAR CATALOG */}
        {activeTab === 'backup' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#164E2A]">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-lg">Catalog Backup, Clear & Data Health</h2>
                  <p className="text-xs text-slate-500">
                    Export full store inventory JSON, clear products to start fresh, or restore default initial catalog.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Export */}
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 hover:border-[#164E2A] bg-[#F7F9F6] hover:bg-emerald-50/50 transition-all text-center gap-3 cursor-pointer group"
                >
                  <Download className="w-7 h-7 text-[#164E2A] group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-black text-xs text-slate-900">Export Catalog JSON</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Download full backup</p>
                  </div>
                </button>

                {/* 2. Clear All */}
                <button
                  type="button"
                  onClick={() => setIsClearAllModalOpen(true)}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-red-200 hover:border-red-500 bg-red-50/40 hover:bg-red-50 transition-all text-center gap-3 cursor-pointer group"
                >
                  <Trash2 className="w-7 h-7 text-red-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-black text-xs text-red-900">Clear All Products</p>
                    <p className="text-[10px] text-red-600 mt-0.5">Empty catalog ({products.length} items)</p>
                  </div>
                </button>

                {/* 3. Restore Default */}
                <button
                  type="button"
                  onClick={handleResetCatalog}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-amber-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50 transition-all text-center gap-3 cursor-pointer group"
                >
                  <RefreshCw className="w-7 h-7 text-amber-700 group-hover:rotate-180 transition-transform duration-500" />
                  <div>
                    <p className="font-black text-xs text-amber-900">Restore Default Catalog</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">Reload {INITIAL_PRODUCTS.length} sample items</p>
                  </div>
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#164E2A]" /> Live Unlocked Storage Active
                </p>
                <p className="text-xs text-slate-600">
                  You have 100% unrestricted control to add, edit, or delete any item in the store. All modifications persist immediately in your local session.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
