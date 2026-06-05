import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Menu,
  Leaf,
  Search,
  Plus,
  Minus,
  X,
  User,
  Truck,
  CheckCircle,
  Star,
  Heart,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  Percent,
  RefreshCw,
  Lock,
  Mail,
  MapPin,
  ShieldAlert,
  ChevronDown,
  Grid,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Drawer,
  Badge,
  IconButton,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  authAPI,
  productsAPI,
  cartAPI,
  ordersAPI,
  contactAPI,
  adminAPI,
  Product,
  CartItem,
  User as UserType,
  categoriesAPI,
  Category,
  offersAPI,
  Offer,
} from './services/api';



// High-quality category images for the collage
const categoryImages: Record<string, string> = {
  'All': '/cat_all.jpg',
  'Vegetables': '/cat_vegetables.jpg',
  'Dairy': '/cat_dairy.jpg',
  'Chocolates': '/cat_chocolates.jpg',
  'Masala Powder': '/cat_masala.jpg',
  'Oral Care': '/cat_oral_care.jpg',
  'Personal Care': '/cat_personal_care.jpg'
};

const categoryLabels: Record<string, string> = {
  'All': '🛍️ Show All Products',
  'Vegetables': '🥦 Fresh Vegetables',
  'Dairy': '🥛 Farm Dairy Fresh',
  'Chocolates': '🍫 Chocolates & Sweets',
  'Masala Powder': '🌶️ Indian Spices',
  'Oral Care': '🪥 Oral & Brush Care',
  'Personal Care': '🧼 Bath & Body Soap',
  'Cleaner': '🧹 Home Cleaner',
  'Dal': '🫘 Pulses & Dal',
  'Drinks': '🥤 Refreshing Drinks',
  'Flour': '🌾 Flour & Grains',
  'Oil': '🛢️ Cooking Oil',
  'Plastic': '🪣 Plastic Essentials',
  'Pooja': '🪔 Pooja Needs',
  'Shamppo': '🧴 Shampoo & Haircare',
  'Shampoo': '🧴 Shampoo & Haircare',
  'Soap': '🧼 Bath Soap'
};

const slugToCategory: Record<string, string> = {
  'all': 'All',
  'vegetables': 'Vegetables',
  'fresh-vegetables': 'Fresh Vegetables',
  'dairy': 'Dairy',
  'dairy-products': 'Dairy Products',
  'farm-dairy-fresh': 'Farm Dairy Fresh',
  'chocolates': 'Chocolates',
  'chocolates-sweets': 'Chocolates & Sweets',
  'snacks-biscuits': 'Snacks & Biscuits',
  'masala-powder': 'Masala Powder',
  'oil-spices': 'Oil & Spices',
  'indian-spices': 'Indian Spices',
  'oral-care': 'Oral Care',
  'oral-brush-care': 'Oral & Brush Care',
  'personal-care': 'Personal Care',
  'cleaner': 'Cleaner',
  'dal': 'Dal',
  'pulses-dal': 'Pulses & Dal',
  'drinks': 'Drinks',
  'beverages': 'Beverages',
  'flour': 'Flour',
  'rice-grains-flour': 'Rice, Grains & Flour',
  'oil': 'Oil',
  'plastic': 'Plastic',
  'pooja': 'Pooja',
  'shamppo': 'Shamppo',
  'shampoo': 'Shamppo',
  'soap': 'Soap'
};

const categoryToSlug: Record<string, string> = {
  'All': 'all',
  'Vegetables': 'vegetables',
  'Fresh Vegetables': 'fresh-vegetables',
  'Dairy': 'dairy',
  'Dairy Products': 'dairy-products',
  'Farm Dairy Fresh': 'farm-dairy-fresh',
  'Chocolates': 'chocolates',
  'Chocolates & Sweets': 'chocolates-sweets',
  'Snacks & Biscuits': 'snacks-biscuits',
  'Masala Powder': 'masala-powder',
  'Oil & Spices': 'oil-spices',
  'Indian Spices': 'indian-spices',
  'Oral Care': 'oral-care',
  'Oral & Brush Care': 'oral-brush-care',
  'Cleaner': 'cleaner',
  'Dal': 'dal',
  'Pulses & Dal': 'pulses-dal',
  'Drinks': 'drinks',
  'Beverages': 'beverages',
  'Flour': 'flour',
  'Rice, Grains & Flour': 'rice-grains-flour',
  'Oil': 'oil',
  'Plastic': 'plastic',
  'Pooja': 'pooja',
  'Shamppo': 'shamppo',
  'Shampoo': 'shamppo',
  'Soap': 'soap'
};

const categoryMapper: Record<string, string> = {
  "Vegetables": "Vegetables",
  "Dairy Products": "Dairy",
  "Oil & Spices": "Masala Powder",
  "Household Items": "Personal Care",
  "Snacks & Biscuits": "Chocolates",
  "Shampoo": "Shamppo",
};

const getDbCategoryName = (category: string): string => {
  const name = category.toLowerCase().trim();
  if (name === 'snacks & biscuits' || name === 'chocolates & sweets' || name === 'chocolates' || name === 'snacks-biscuits' || name === 'chocolates-sweets') {
    return 'Chocolates';
  }
  if (name === 'dairy products' || name === 'farm dairy fresh' || name === 'dairy' || name === 'dairy-products' || name === 'farm-dairy-fresh') {
    return 'Dairy';
  }
  if (name === 'oil & spices' || name === 'indian spices' || name === 'masala powder' || name === 'oil-spices' || name === 'indian-spices' || name === 'masala-powder') {
    return 'Masala Powder';
  }
  if (name === 'oral care' || name === 'oral & brush care' || name === 'oral &brush care' || name === 'oral-care' || name === 'oral-brush-care') {
    return 'Oral Care';
  }
  if (name === 'fresh vegetables' || name === 'vegetables' || name === 'fresh-vegetables') {
    return 'Vegetables';
  }
  if (name === 'pulses & dal' || name === 'dal' || name === 'pulses-dal') {
    return 'Dal';
  }
  if (name === 'rice, grains & flour' || name === 'flour' || name === 'rice-grains-flour') {
    return 'Flour';
  }
  if (name === 'beverages' || name === 'drinks' || name === 'beverages') {
    return 'Drinks';
  }
  if (name === 'personal care' || name === 'soap') {
    return 'Soap';
  }
  if (name === 'shamppo' || name === 'shampoo') {
    return 'Shamppo';
  }
  return category;
};

const getCategoryDisplayName = (dbCatName: string): string => {
  if (!dbCatName) return '';
  const name = dbCatName.toLowerCase().trim();
  if (name === 'chocolates') return 'Snacks & Biscuits';
  if (name === 'dairy') return 'Dairy Products';
  if (name === 'masala powder') return 'Oil & Spices';
  if (name === 'shamppo' || name === 'shampoo') return 'Shampoo';
  return dbCatName;
};

const toSingular = (word: string): string => {
  const clean = word.toLowerCase().trim();
  if (clean === 'cookies' || clean === 'cookie') return 'cookie';
  if (clean === 'veggies' || clean === 'veggie') return 'veggie';
  if (clean === 'smoothies' || clean === 'smoothie') return 'smoothie';
  if (clean.endsWith('ies')) return clean.slice(0, -3) + 'y';
  if (clean.endsWith('s')) return clean.slice(0, -1);
  return clean;
};

const matchSubCategory = (prodSubCat: string | null | undefined, filterSubCat: string | null, selectedCatName: string): boolean => {
  if (!filterSubCat) return true;
  
  const cleanFilter = filterSubCat.toLowerCase().trim();
  if (cleanFilter === 'all products' || cleanFilter === 'all product' || cleanFilter === 'all') return true;
  
  const targetFilterSingular = toSingular(cleanFilter);
  
  if (!prodSubCat) {
    const dbCat = getDbCategoryName(selectedCatName);
    return toSingular(dbCat) === targetFilterSingular;
  }
  
  const cleanProd = prodSubCat.toLowerCase().trim();
  if (cleanProd === cleanFilter) return true;
  
  return toSingular(cleanProd) === targetFilterSingular;
};

const megaMenuData = [
  {
    category: "Vegetables",
    icon: "🥦",
    slug: "vegetables",
    items: ["Tomato", "Onion", "Potato", "Carrot", "Brinjal", "Cabbage", "Cauliflower", "Green Chilli"]
  },
  {
    category: "Rice, Grains & Flour",
    icon: "🌾",
    slug: "rice-grains-flour",
    items: ["Rice", "Wheat Flour", "Maida", "Rava", "Vermicelli", "Corn Flour", "Millet", "Oats"]
  },
  {
    category: "Pulses & Dal",
    icon: "🫘",
    slug: "pulses-dal",
    items: ["Toor Dal", "Urad Dal", "Moong Dal", "Channa Dal", "Green Gram", "Chickpeas", "Rajma", "Peas"]
  },
  {
    category: "Oil & Spices",
    icon: "🌶️",
    slug: "oil-spices",
    items: ["Sunflower Oil", "Groundnut Oil", "Coconut Oil", "Turmeric Powder", "Chilli Powder", "Coriander Powder", "Garam Masala", "Mustard Seeds"]
  },
  {
    category: "Dairy Products",
    icon: "🥛",
    slug: "dairy",
    items: ["Milk", "Curd", "Butter", "Cheese", "Paneer", "Ghee", "Ice Cream"]
  },
  {
    category: "Snacks & Biscuits",
    icon: "🍪",
    slug: "snacks-biscuits",
    items: ["Chips", "Cookies", "Mixture", "Murukku", "Chocolates", "Popcorn", "Namkeen", "Cakes"]
  },
  {
    category: "Beverages",
    icon: "☕",
    slug: "beverages",
    items: ["Tea", "Coffee", "Soft Drinks", "Fruit Juice", "Energy Drinks", "Mineral Water"]
  },
  {
    category: "Household Items",
    icon: "🧼",
    slug: "household-items",
    items: ["Soap", "Shampoo", "Toothpaste", "Detergent Powder", "Dish Wash Liquid", "Floor Cleaner", "Garbage Bags"]
  },
  {
    category: "Frozen & Packed Foods",
    icon: "🍕",
    slug: "frozen-packed-foods",
    items: ["Frozen Vegetables", "Frozen Parotta", "Instant Noodles", "Pasta", "Sauces", "Pickles", "Jam", "Peanut Butter"]
  },
  {
    category: "Shampoo",
    icon: "🧴",
    slug: "shamppo",
    items: ["Dove", "Clinic Plus", "Sun Silk", "Meera", "Clear", "Chik", "Head & Shoulders", "Karthika"]
  }
];

export default function App() {
  const isAdminPort = window.location.port === '5175';
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const categoriesList = ['All', ...dbCategories.map(c => c.name)];
  
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: '', phone: '', email: '', address: '', pincode: '', language: 'en' });
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderTotal, setPlacedOrderTotal] = useState<number>(0);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState<'home' | 'category-page' | 'about' | 'contact' | 'admin'>('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tomatoSlideIndex, setTomatoSlideIndex] = useState(0);
  const [productSlideIndex, setProductSlideIndex] = useState(0);
  const tomatoImages = ['/cat_vegetables.jpg', '/cat_dairy.jpg', '/cat_chocolates.jpg', '/tomato_4.png'];

  // Admin Panel states
  const [adminTab, setAdminTab] = useState<'products' | 'feedback' | 'users'>('products');
  const [adminFeedbacks, setAdminFeedbacks] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserType[]>([]);
  const [isAdminProductDialogOpen, setIsAdminProductDialogOpen] = useState(false);
  const [adminEditingProduct, setAdminEditingProduct] = useState<Product | null>(null);

  // Admin Product Form inputs
  const [apName, setApName] = useState('');
  const [apPrice, setApPrice] = useState('');
  const [apCategory, setApCategory] = useState<number>(1);
  const [apImageUrl, setApImageUrl] = useState('');
  const [apUnit, setApUnit] = useState('1.0 kg');
  const [apDescription, setApDescription] = useState('');
  const [apInStock, setApInStock] = useState(true);

  // Likes & Wishlist
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const dynamicMegaMenuData = dbCategories.map(cat => {
    const hc = megaMenuData.find(m => m.category === cat.name || categoryMapper[m.category] === cat.name);
    
    // Extract unique sub-categories from database products for this category
    const dbSubCats = [...new Set(
      allProducts
        .filter(p => p.category_name === cat.name && p.sub_category)
        .map(p => p.sub_category as string)
    )];

    // Combine hardcoded sub-categories and database sub-categories
    const baseItems = hc ? [...hc.items] : [];
    dbSubCats.forEach(sub => {
      const subSingular = toSingular(sub);
      const exists = baseItems.some(item => toSingular(item) === subSingular);
      if (!exists) {
        baseItems.push(sub);
      }
    });

    // Prepend "All Products" as the first choice
    const items = ["All Products", ...baseItems];
    
    return {
      category: hc ? hc.category : getCategoryDisplayName(cat.name),
      icon: hc ? hc.icon : "🛒",
      slug: hc ? hc.slug : cat.name.toLowerCase().replace(/\s+/g, '-'),
      items: items.slice(0, 15)
    };
  });

  const categoryBgColors: Record<string, string> = {
    'All': '#FAF6FB',
    'Vegetables': '#EBF7EC',
    'Dairy': '#EEF5FC',
    'Chocolates': '#FDF5F2',
    'Masala Powder': '#FCF6EC',
    'Oral Care': '#F0F9F9',
    'Personal Care': '#F5F2F9'
  };

  // Premium Contact Page states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPassword2, setSignupPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupPincode, setSignupPincode] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [editingAddressOrderId, setEditingAddressOrderId] = useState<number | null>(null);
  const [newAddressText, setNewAddressText] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);


  // Banner slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Luxury Organic Market",
      subtitle: "FRESH • QUALITY • TRUSTED",
      highlight: "Premium Grocery & Greens",
      description: "Directly from local partner farms to your doorstep with absolute freshness guarantee.",
      image: "/banner.png",
      badge: "Best Seller Theme 2026",
      cta: "Explore Store",
      bgGradient: "from-purple-950 via-purple-900 to-indigo-950"
    },
    {
      title: "Daily Deal Bonanza",
      subtitle: "UP TO 50% OFF",
      highlight: "Fresh Farm Vegetables",
      description: "Save big on healthy daily essentials, crisp leafy greens, and handpicked juicy fruits.",
      image: "/cat_vegetables.jpg",
      badge: "Save Big Today",
      cta: "View Offers",
      bgGradient: "from-fuchsia-950 via-purple-900 to-pink-950"
    },
    {
      title: "Pure Dairy Delights",
      subtitle: "100% ORGANIC & PURE",
      highlight: "Farm-Fresh Milk & Cheese",
      description: "Delivering pasture-raised organic milk, butter, cheese, and farm products fresh daily.",
      image: "/cat_dairy.jpg",
      badge: "Natural Nutrition",
      cta: "Shop Dairy",
      bgGradient: "from-violet-950 via-purple-950 to-slate-950"
    }
  ];

  useEffect(() => {
    checkCurrentUser();
    fetchProducts();
    fetchOffers();
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setDbCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setProductSlideIndex(0);
  }, [viewingProduct]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
  }, [selectedCategory, searchQuery, selectedSubCategory]);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser]);

  // Dynamic real-time auto-polling to update storefront automatically when Admin makes changes (no refresh needed!)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts(true); // Silent background fetch
      fetchOffers();
      if (currentUser) {
        fetchCart();
      }
    }, 4000); // Check for catalog and offer changes every 4 seconds

    return () => clearInterval(interval);
  }, [currentUser, selectedCategory, searchQuery, selectedSubCategory]);

  // Real-time tracking stepper auto-poll when customer has their tracking timeline open
  useEffect(() => {
    if (!isOrdersOpen || !currentUser) return;

    const pollOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setUserOrders(data);
      } catch (err) {
        console.error('Failed to auto-poll orders:', err);
      }
    };

    const interval = setInterval(pollOrders, 3000); // Check order delivery status transitions every 3 seconds
    return () => clearInterval(interval);
  }, [isOrdersOpen, currentUser]);

  useEffect(() => {
    if (isCheckoutOpen && cart.length === 0) {
      setIsCheckoutOpen(false);
    }
  }, [cart, isCheckoutOpen]);

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`likes_${currentUser.email}`);
      if (stored) {
        setLikedProducts(JSON.parse(stored));
      } else {
        setLikedProducts([]);
      }
    } else {
      setLikedProducts([]);
    }
  }, [currentUser]);

  const toggleLike = (productId: number) => {
    if (!currentUser) {
      setIsSignupOpen(true);
      return;
    }
    const updated = likedProducts.includes(productId)
      ? likedProducts.filter(id => id !== productId)
      : [...likedProducts, productId];
    setLikedProducts(updated);
    localStorage.setItem(`likes_${currentUser.email}`, JSON.stringify(updated));
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '/index.html') {
        setCurrentView('home');
        setSelectedCategory('All');
        setSelectedSubCategory(null);
      } else if (path === '/about') {
        setCurrentView('about');
      } else if (path === '/contact') {
        setCurrentView('contact');
      } else if (path === '/admin') {
        setCurrentView('admin');
      } else if (path.startsWith('/category/')) {
        const slug = path.replace('/category/', '');
        const cat = slugToCategory[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setSelectedCategory(cat);
        
        // Check for sub_category in URL search params
        const params = new URLSearchParams(window.location.search);
        const subCat = params.get('sub_category');
        setSelectedSubCategory(subCat || null);
        
        // Optional search param fallback
        const search = params.get('search');
        if (search) setSearchQuery(search);

        setCurrentView('category-page');
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Autoplay banner slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (!user || !user.email) {
        setCurrentUser(null);
      } else if (user.is_staff && !isAdminPort) {
        // Treat as anonymous visitor locally, do NOT logout from the backend to preserve the admin tab session
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
    } catch (err) {
      console.log('User not logged in');
    }
  };

  const fetchOffers = async () => {
    try {
      const data = await offersAPI.getAll(true);
      setOffers(data);
    } catch (err) {
      console.error('Failed to load active offers:', err);
    }
  };

  const fetchProducts = async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      const dbCatName = getDbCategoryName(selectedCategory);
      const data = await productsAPI.getAll(dbCatName, searchQuery);
      const filtered = selectedSubCategory 
        ? data.filter(p => matchSubCategory(p.sub_category, selectedSubCategory, selectedCategory))
        : data;
      setProducts(filtered);
      if (selectedCategory === 'All' && !searchQuery) {
        setAllProducts(data);
      } else {
        const allData = await productsAPI.getAll('All', '');
        setAllProducts(allData);
      }
    } catch (err: any) {
      setError('Failed to load products. Please make sure the Django backend is running.');
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await ordersAPI.cancelOrder(orderId);
      // Refresh orders
      const data = await ordersAPI.getAll();
      setUserOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateAddress = async (orderId: number) => {
    if (!newAddressText.trim()) return;
    try {
      setActionLoading(orderId);
      await ordersAPI.updateAddress(orderId, newAddressText);
      setEditingAddressOrderId(null);
      setNewAddressText('');
      // Refresh orders
      const data = await ordersAPI.getAll();
      setUserOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update address');
    } finally {
      setActionLoading(null);
    }
  };

  const addToCart = async (product: Product) => {
    if (!currentUser) {
      setIsSignupOpen(true);
      return;
    }

    try {
      await cartAPI.addToCart(product.id, 1);
      await fetchCart();
    } catch (err) {
      setError('Failed to add item to cart. Make sure you are logged in.');
      console.error(err);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await cartAPI.removeItem(cartItemId);
      } else {
        await cartAPI.updateQuantity(cartItemId, newQuantity);
      }
      await fetchCart();
    } catch (err) {
      setError('Failed to update cart');
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      setError(null);
      const response = await authAPI.login(loginUsername, loginPassword);
      if (response.user.is_staff) {
        await authAPI.logout();
        setError('Admin/Staff accounts are restricted to the dedicated Admin Portal (port 5175). Only registered customers can log in to the public store.');
        return;
      }
      setCurrentUser(response.user);
      setIsLoginOpen(false);
      setLoginUsername('');
      setLoginPassword('');
      await fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed. Please check your credentials.');
    }
  };

  const handleSendOtp = async () => {
    if (!signupName || !signupEmail || !signupPassword || !signupPassword2 || !signupAddress || !signupPincode) {
      setError('Please fill in all details (Name, Email, Passwords, Address, Pincode) before requesting OTP.');
      return;
    }
    if (signupPassword !== signupPassword2) {
      setError('Passwords do not match.');
      return;
    }
    setOtpLoading(true);
    setError(null);
    try {
      const response = await authAPI.sendOtp(signupEmail);
      setOtpSent(true);
      if (response.dev_otp) {
        setDevOtp(response.dev_otp);
      }
      // Simple dynamic success feedback
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.error || 'Failed to send OTP verification email. Please check the email format.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupOtp) {
      setError('Please enter the 6-digit OTP verification number.');
      return;
    }

    try {
      setError(null);
      const response = await authAPI.register({
        username: signupName.trim().toLowerCase().replace(/\s+/g, '_') || signupEmail.split('@')[0],
        email: signupEmail,
        password: signupPassword,
        password2: signupPassword2,
        phone: signupPhone,
        address: signupAddress,
        pincode: signupPincode,
        otp: signupOtp,
      });
      setCurrentUser(response.user);
      setIsSignupOpen(false);
      
      // Clear all fields
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupPassword2('');
      setSignupPhone('');
      setSignupAddress('');
      setSignupPincode('');
      setSignupOtp('');
      setOtpSent(false);
      setDevOtp('');

      await fetchCart();

      // Automatically open checkout so user can proceed to the order page immediately!
      setIsCheckoutOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.otp?.[0] || err.response?.data?.email?.[0] || err.response?.data?.username?.[0] || 'Registration failed. Please check your fields and try again.');
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'transparent', percent: 0 };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak Password', color: '#EF4444', percent: 25 };
    if (score <= 4) return { score, label: 'Good Password', color: '#F59E0B', percent: 65 };
    return { score, label: 'Strong & Secure Password', color: '#10B981', percent: 100 };
  };


  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setCurrentUser(null);
      setCart([]);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const openProfile = () => {
    if (currentUser) {
      const currentLang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1] || '/en/en';
      const lang = currentLang.endsWith('/ta') ? 'ta' : currentLang.endsWith('/te') ? 'te' : 'en';
      setProfileForm({
        first_name: currentUser.first_name || currentUser.username || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        pincode: currentUser.pincode || '',
        language: lang
      });
      setIsProfileOpen(true);
    }
  };

  const openOrdersTracking = async () => {
    if (!currentUser) {
      setIsSignupOpen(true);
      return;
    }
    try {
      setTrackingLoading(true);
      const data = await ordersAPI.getAll();
      setUserOrders(data);
      setIsOrdersOpen(true);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch your orders. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = await authAPI.updateUser(profileForm);
      setCurrentUser(updatedUser);
      setIsProfileOpen(false);
      
      const currentLangCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1] || '/en/en';
      const targetCookie = `/en/${profileForm.language}`;
      
      if (currentLangCookie !== targetCookie) {
        document.cookie = `googtrans=${targetCookie}; path=/`;
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to save profile. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactSubject.trim() || !contactMessage.trim()) {
      setError('Please fill in all inquiry fields before sending.');
      return;
    }
    setError(null);
    setContactLoading(true);
    try {
      await contactAPI.sendFeedback(
        contactName.trim(),
        contactEmail.trim(),
        contactSubject.trim(),
        contactMessage.trim()
      );
      setContactSuccess(true);
    } catch (err) {
      setError('Failed to dispatch feedback message. Please check your network or try again.');
      console.error(err);
    } finally {
      setContactLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      setIsSignupOpen(true);
      setIsCartOpen(false);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) return;

    try {
      const order = await ordersAPI.create(currentUser.address || '', currentUser.phone || '');
      setPlacedOrderTotal(parseFloat(order.total_amount.toString()));
      setIsCheckoutOpen(false);
      setIsOrderPlaced(true);
      setTimeout(() => {
        setIsOrderPlaced(false);
      }, 5000); // 5 seconds for user to comfortably read success details
      await fetchCart();
    } catch (err) {
      setError('Failed to place order');
      console.error(err);
    }
  };

  // Image error handling fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/logo.png";
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.total_price.toString()), 0);
  const deliveryCharge = totalPrice >= 500 ? 0 : 40;

  // Custom testimonials
  const reviews = [
    {
      name: "Aishwarya Sen",
      rating: 5,
      comment: "I absolute love their organic farm vegetables. The broccoli and greens are super fresh and crispy. Highly recommended!",
      role: "Verified Premium Customer",
      avatar: "/logo.png"
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "The fast 2-hour home delivery is outstanding. Best quality spices and milk in the entire area. Supermarket quality at home!",
      role: "Regular Buyer",
      avatar: "/logo.png"
    },
    {
      name: "Meera Patel",
      rating: 5,
      comment: "Excellent client service, packaging is premium, and prices are extremely reasonable. The website design is absolutely stellar!",
      role: "Verified Premium Customer",
      avatar: "/logo.png"
    }
  ];
  const currentBgColor = currentView === 'category-page' ? (categoryBgColors[selectedCategory] || '#FAF6FB') : '#FDFBFD';

  // Redirect /admin to the correct port if accessed from the user port
  if (currentView === 'admin' && !isAdminPort) {
    window.location.href = 'http://localhost:5175/';
    return null;
  }

  return (
    <div 
      className="min-h-screen text-gray-200 bg-[#0A000D] font-sans selection:bg-[#E4C560] selection:text-white transition-colors duration-500"
      style={{ backgroundColor: currentBgColor }}
    >
      {error && (
        <Alert severity="error" onClose={() => setError(null)} className="sticky top-0 z-50 shadow-md">
          {error}
        </Alert>
      )}

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-purple-900 to-[#1D0130] text-white py-2 px-4 shadow-inner text-xs sm:text-sm font-semibold tracking-wider border-b border-emerald-800/20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <Truck size={14} className="text-emerald-600 animate-bounce flex-shrink-0" />
            <span className="truncate">✨ Free Delivery above ₹500!</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold py-0.5 px-2 rounded-full">LIMITED OFFER</span>
            <span>Extra 10% Off Code: <strong className="text-[#E4C560]">UMA10</strong></span>
          </div>
          <div className="flex sm:hidden items-center gap-1.5 flex-shrink-0">
            <span className="bg-emerald-600 text-white text-[9px] uppercase font-bold py-0.5 px-1.5 rounded-full">UMA10</span>
            <span className="text-[#E4C560] text-[10px] font-bold">10% OFF</span>
          </div>
        </div>
      </div>

      {/* Custom Header - Matches EXACT Logo Background color (#1D0130) for seamless integration */}
      <header className="bg-[#1D0130]/95 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-40 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20 gap-4">
            
            
            {/* Hamburger Menu (Mobile Only) */}
            <div className="flex items-center lg:hidden">
              <IconButton onClick={() => setIsMobileMenuOpen(true)} sx={{ color: 'white' }}>
                <Menu size={26} />
              </IconButton>
            </div>

            {/* Left: Logo */}
            <div className="flex items-center gap-3 cursor-pointer animate-fade-in flex-shrink-0" onClick={() => {
              window.history.pushState({}, '', '/');
              setSelectedCategory('All');
              setSelectedSubCategory(null);
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <img 
                src="/logo.png" 
                alt="Uma Grocery Shop Logo" 
                className="h-16 w-auto object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden lg:flex items-center justify-center gap-6 flex-1">
              <Button
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  setSelectedCategory('All');
                  setSelectedSubCategory(null);
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#E4C560' }
                }}
              >
                <span className="font-serif">Home</span>
              </Button>

              {/* Premium Products Mega Menu Dropdown */}
              <div className="group">
                <Button
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    '&:hover': { color: '#E4C560' }
                  }}
                  endIcon={<ChevronDown size={14} className="text-emerald-600 group-hover:rotate-180 transition-transform duration-300" />}
                >
                  <span className="font-serif">Products</span>
                </Button>
                
                {/* Mega Dropdown Panel Panel with custom column alignments - Widescreen 5 Columns */}
              <div className="absolute left-0 right-0 mx-auto mt-2.5 w-[95vw] lg:w-[1000px] max-w-full bg-[#1D0130]/95 backdrop-blur-md border border-purple-900/40/80 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-7 grid grid-cols-5 gap-6 overflow-visible">
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-600/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#1D0130]/5 rounded-full blur-xl pointer-events-none"></div>
                
                {/* 5 Columns mapping all Categories dynamically */}
                {(() => {
                  // Sort categories descending by their estimated height (header space + items count)
                  const sortedSecs = [...dynamicMegaMenuData].sort((a, b) => {
                    const aHeight = 2 + a.items.length;
                    const bHeight = 2 + b.items.length;
                    return bHeight - aHeight;
                  });

                  const columns: any[][] = [[], [], [], [], []];
                  const colHeights = [0, 0, 0, 0, 0];

                  sortedSecs.forEach((sec) => {
                    const height = 2 + sec.items.length;
                    // Greedily assign to the column with the minimum height
                    let minColIdx = 0;
                    for (let i = 1; i < 5; i++) {
                      if (colHeights[i] < colHeights[minColIdx]) {
                        minColIdx = i;
                      }
                    }
                    columns[minColIdx].push(sec);
                    colHeights[minColIdx] += height;
                  });

                  return columns.map((colItems, colIndex) => (
                    <div key={colIndex} className="space-y-6 text-left">
                      {colItems.map((sec) => (
                        <div key={sec.category} className="space-y-2">
                          {/* Category Heading Link */}
                          <div 
                            onClick={() => {
                              window.history.pushState({}, '', `/category/${sec.slug}`);
                              setSelectedCategory(sec.category);
                              setSelectedSubCategory(null);
                              setCurrentView('category-page');
                              setSearchQuery('');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-emerald-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:text-gray-200 transition-colors border-b border-purple-900/40 pb-1"
                          >
                            <span>{sec.icon}</span>
                            <span className="font-serif">{sec.category}</span>
                          </div>
                          
                          {/* Sub-item List */}
                          <ul className="space-y-1 pl-5">
                            {sec.items.map((item: string) => (
                              <li key={item}>
                                <span
                                  onClick={() => {
                                    const subCatValue = item === 'All Products' ? null : item;
                                    
                                    if (subCatValue) {
                                      window.history.pushState({}, '', `/category/${sec.slug}?sub_category=${encodeURIComponent(subCatValue)}`);
                                    } else {
                                      window.history.pushState({}, '', `/category/${sec.slug}`);
                                    }
                                    
                                    setSelectedCategory(sec.category);
                                    setSearchQuery('');
                                    setSelectedSubCategory(subCatValue);
                                    setCurrentView('category-page');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="text-gray-400 text-[11px] font-medium cursor-pointer hover:text-emerald-600 transition-colors block py-0.5 text-left"
                                >
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
              </div>

              <Button
                onClick={() => {
                  window.history.pushState({}, '', '/about');
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#E4C560' }
                }}
              >
                <span className="font-serif">About Us</span>
              </Button>

              <Button
                onClick={() => {
                  window.history.pushState({}, '', '/contact');
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#E4C560' }
                }}
              >
                <span className="font-serif">Contact Us</span>
              </Button>
            </div>

            {/* Right: Quick Actions & Icons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div id="google_translate_element" className="opacity-0 h-0 w-0 overflow-hidden fixed -top-[1000px] -left-[1000px] pointer-events-none translate-container"></div>
              
              {/* Search Icon */}
              <IconButton 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
              >
                <Search size={22} />
              </IconButton>

              {/* Wishlist Icon */}
              <IconButton 
                onClick={() => {
                  if (!currentUser) {
                    setIsSignupOpen(true);
                  } else {
                    setIsLikesOpen(true);
                  }
                }} 
                sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
              >
                <Heart size={22} className={likedProducts.length > 0 ? "fill-red-500 text-red-500" : "text-gray-200"} />
              </IconButton>

              {/* Shopping Cart Icon */}
              <IconButton 
                onClick={() => setIsCartOpen(true)}
                sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
              >
                <Badge badgeContent={cart.length} showZero color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#4A0E4E', color: 'white', fontWeight: 'bold' } }}>
                  <ShoppingCart size={22} />
                </Badge>
              </IconButton>

              {/* User / Sign In */}
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <IconButton 
                    onClick={openOrdersTracking} 
                    title="Track My Orders"
                    sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
                  >
                    <Truck size={22} className="text-gray-200" />
                  </IconButton>
                  <IconButton onClick={openProfile} sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}>
                    <User size={22} />
                  </IconButton>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    onClick={() => setIsLoginOpen(true)}
                    sx={{
                      color: '#E4C560',
                      border: '1px solid rgba(228, 197, 96, 0.4)',
                      borderRadius: '9999px',
                      px: 2.5,
                      py: 0.5,
                      fontSize: '13px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { borderColor: '#E4C560', backgroundColor: 'rgba(228, 197, 96, 0.08)' }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsSignupOpen(true)}
                    sx={{
                      color: 'white',
                      backgroundColor: '#8B9A46', // Matching Terra Kind Green
                      borderRadius: '9999px',
                      px: 2.5,
                      py: 0.5,
                      fontSize: '13px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#7A8836' }
                    }}
                    startIcon={<User size={16} />}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar — only shows when search icon is clicked */}
      <div className={`transition-all duration-300 ease-in-out bg-[#1D0130]/98 backdrop-blur-md px-4 border-b border-purple-900/40 overflow-hidden md:hidden ${
        isSearchOpen ? 'max-h-24 pb-4 pt-2 opacity-100 shadow-lg' : 'max-h-0 pb-0 pt-0 opacity-0 pointer-events-none'
      }`}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search premium organic groceries..."
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            if (val) {
              const match = products.find(p => p.name.toLowerCase().includes(val.toLowerCase()) || p.description?.toLowerCase().includes(val.toLowerCase()));
              if (match) {
                const matchedCat = getCategoryDisplayName(match.category_name);
                const slug = categoryToSlug[matchedCat] || matchedCat.toLowerCase().replace(/\s+/g, '-');
                setSelectedCategory(matchedCat);
                setCurrentView('category-page');
                window.history.pushState({}, '', `/category/${slug}?search=${encodeURIComponent(val.toLowerCase())}`);
              } else {
                setSelectedCategory('All');
                setCurrentView('home');
                window.history.pushState({}, '', `/?search=${encodeURIComponent(val.toLowerCase())}`);
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
              '&:hover fieldset': { borderColor: '#E4C560' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.6)',
              opacity: 1
            }
          }}
          InputProps={{
            startAdornment: <Search className="mr-2 text-emerald-600" size={18} />,
          }}
        />
      </div>

      {currentView === 'home' ? (
        <>
          {/* Hero Carousel — Grocery Image Background */}
          <section
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'url(/hero_bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'local'
            }}
          >
            {/* Persistent dark overlay so text is always readable */}
            <div className="absolute inset-0 bg-black/55 z-0" />
            <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full transition-all duration-700 ease-in-out z-10">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between px-5 py-6 sm:p-10 md:p-14 transition-opacity duration-1000 bg-gradient-to-br ${slide.bgGradient} bg-opacity-60 ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={{ background: `linear-gradient(135deg, rgba(26,0,37,0.82) 0%, rgba(74,14,78,0.55) 60%, rgba(0,0,0,0.25) 100%)` }}
                >
                  {/* Slide Text Content */}
                  <div className="flex-1 text-gray-200 max-w-xl space-y-2 sm:space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-[#2A0033]/30 text-[#E4C560] py-1 px-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm">
                      <Percent size={12} />
                      <span>{slide.badge}</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-emerald-400 text-[10px] sm:text-sm font-bold tracking-widest uppercase">{slide.subtitle}</p>
                      <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-gray-200 leading-tight font-serif">
                        {slide.title}
                      </h2>
                      <h3 className="text-sm sm:text-lg text-gray-400 font-medium">
                        {slide.highlight}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-[11px] sm:text-sm max-w-lg leading-relaxed hidden sm:block">
                      {slide.description}
                    </p>
                    <div className="pt-1 sm:pt-2 flex items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => {
                          const element = document.getElementById('shop-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-gradient-to-r from-[#E4C560] to-[#C9A637] hover:from-white hover:to-white hover:text-white text-white font-bold text-[10px] sm:text-xs py-2 sm:py-2.5 px-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 tracking-wider uppercase"
                      >
                        {slide.cta}
                      </button>
                      <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>Secure Checkout</span>
                      </div>
                    </div>
                  </div>

                  {/* Slide Image — border radius reduced directly on the image */}
                  <div className="flex-shrink-0 w-[140px] h-[140px] sm:w-[260px] sm:h-[220px] md:w-[400px] md:h-[300px] relative mt-2 md:mt-0 transition-transform duration-700 hover:scale-105">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover rounded-xl drop-shadow-xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Slider Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-[#1D0130] text-gray-200 hover:text-white p-2.5 rounded-full transition-all duration-300 border border-white/30 hidden sm:block shadow-md backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-[#1D0130] text-gray-200 hover:text-white p-2.5 rounded-full transition-all duration-300 border border-white/30 hidden sm:block shadow-md backdrop-blur-sm"
            >
              <ArrowRight size={18} />
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentSlide ? 'w-6 bg-emerald-600' : 'w-2 bg-[#1D0130]/40'
                  }`}
                ></button>
              ))}
            </div>
          </section>

          {/* Trust Values Section */}
          <section className="bg-[#1D0130] border-b border-[#2A0033] py-6 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">Free Shipping</h4>
                    <p className="text-[10px] text-purple-300">On all orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">100% Quality</h4>
                    <p className="text-[10px] text-purple-300">Pure freshness guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">Best Pricing</h4>
                    <p className="text-[10px] text-purple-300">Direct farm rates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">Easy Returns</h4>
                    <p className="text-[10px] text-purple-300">Exchanges made simple</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Deluxe Collage of Categories (User Request 2) */}
          <section className="py-8 sm:py-16 bg-[#FAF7FB] border-t border-[#F3EDF5]">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-12">
                <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">Premium Sourcing</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D0130] font-serif mt-1">Explore Sourced Categories</h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-md mx-auto hidden sm:block">Click any category image in the collage to split and filter products instantly.</p>
                <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-emerald-600 to-teal-400 mx-auto mt-3 rounded-full"></div>
              </div>

              {/* Dynamic Asymmetric Collage Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {categoriesList.map((category, idx) => {
                  const isActive = selectedCategory === category;
                  const fallbackImages = [
                    '/cat_all.jpg',
                    '/cat_vegetables.jpg',
                    '/cat_dairy.jpg',
                    '/cat_chocolates.jpg',
                    '/cat_masala.jpg',
                  ];
                  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const dbCat = dbCategories.find(c => c.name === category);
                  const imgUrl = dbCat?.image_url || categoryImages[category] || fallbackImages[hash % fallbackImages.length];
                  const label = categoryLabels[category] || `✨ ${category}`;
                  
                  // Give some collage grid span items for variety
                  const isLarge = idx === 0 || idx === 4;

                  return (
                    <div
                      key={category}
                      onClick={() => {
                        const slug = categoryToSlug[category] || category.toLowerCase().replace(/\s+/g, '-');
                        window.history.pushState({}, '', slug === 'all' ? '/' : `/category/${slug}`);
                        setSelectedCategory(category);
                        setSelectedSubCategory(null);
                        setCurrentView(slug === 'all' ? 'home' : 'category-page');
                        
                        setTimeout(() => {
                          if (slug === 'all') {
                            document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }, 50);
                      }}
                      className={`relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border ${
                        isActive ? 'border-amber-400 ring-4 ring-purple-200/50 scale-102' : 'border-purple-100/10 hover:border-purple-300/30'
                      } ${isLarge ? 'col-span-2' : 'col-span-1'} h-48 sm:h-56`}
                    >
                      <img
                        src={imgUrl}
                        alt={category}
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Luxury Purple Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A0033]/90 via-[#4A0E4E]/40 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                      
                      {/* Category Details Text */}
                      <div className="absolute bottom-4 left-4 right-4 text-gray-200 z-10">
                        <span className="text-[10px] text-[#E4C560] font-extrabold uppercase tracking-widest block mb-1">
                          {isActive ? '● Currently Active' : 'Sourced Organic'}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold font-serif leading-tight">
                          {label}
                        </h3>
                        <div className="h-0.5 w-8 bg-amber-400 mt-2 transition-all duration-300 group-hover:w-16"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Deluxe Daily Deals Banner */}
          <section className="py-4 px-3 sm:px-4">
            <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#1a0025] to-slate-900 border border-purple-800/30 p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
              <div className="space-y-3 sm:space-y-4 max-w-xl text-left w-full lg:w-auto">
                <span className="bg-[#E4C560] text-[#1D0130] py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider">DELUXE DEALS OF THE WEEK</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif leading-tight">Fresh organic broccoli &amp; veggies up to 50% discount!</h3>
                <p className="text-gray-400 text-sm hidden sm:block">
                  Eat clean, stay healthy! Grab today's select high-grade vegetables, sourced from certified local farms. Offers end tonight!
                </p>
                <div className="flex items-center gap-3 sm:gap-6 pt-1 sm:pt-2">
                  <div className="text-center bg-white/10 border border-white/20 backdrop-blur-sm p-2 w-14 sm:w-16 rounded-xl">
                    <span className="block font-bold text-white text-lg sm:text-xl">12</span>
                    <span className="text-[10px] text-[#E4C560] font-bold uppercase">Hrs</span>
                  </div>
                  <div className="text-center bg-white/10 border border-white/20 backdrop-blur-sm p-2 w-14 sm:w-16 rounded-xl">
                    <span className="block font-bold text-white text-lg sm:text-xl">45</span>
                    <span className="text-[10px] text-[#E4C560] font-bold uppercase">Min</span>
                  </div>
                  <div className="text-center bg-white/10 border border-white/20 backdrop-blur-sm p-2 w-14 sm:w-16 rounded-xl">
                    <span className="block font-bold text-white text-lg sm:text-xl">30</span>
                    <span className="text-[10px] text-[#E4C560] font-bold uppercase">Sec</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[300px] sm:max-w-[340px] bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute top-3 left-3 bg-red-500 text-white font-bold text-[10px] uppercase py-0.5 px-2 rounded-full">
                  HOT SALE
                </div>
                <img 
                  src="/cat_vegetables.jpg" 
                  alt="Broccoli Deal" 
                  onError={handleImageError}
                  className="w-full h-40 sm:h-44 object-contain mx-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="text-center mt-3">
                  <h4 className="font-bold text-white text-sm sm:text-base">Organic Fresh Broccoli</h4>
                  <div className="flex items-center justify-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">1.0 kg unit</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-bold text-[#E4C560]">₹80.00</span>
                    <span className="text-xs line-through text-gray-500">₹160.00</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : currentView === 'category-page' ? (
        /* Render Beautiful Category Landing Page Header Banners! */
        (() => {
          // Custom category banner styles
          const dbCatName = getDbCategoryName(selectedCategory);
          const displayCat = getCategoryDisplayName(selectedCategory);
          let bannerTitle = selectedCategory === 'All' ? "Premium Sourced Catalog" : `${displayCat} Delights`;
          let bannerHighlight = selectedCategory === 'All' ? "Premium handpicked organic essentials" : `Explore our fresh and premium ${displayCat.toLowerCase()}`;
          let bannerGradient = "from-purple-950 via-[#1D0130] to-indigo-950";
          let bannerIcon = "🛍️";
          
          if (dbCatName === 'Dairy') {
            bannerTitle = "Farm-Fresh Dairy & Creamy Delights";
            bannerHighlight = "Fresh dairy, farm butter, curd & premium cow milk";
            bannerGradient = "from-blue-950 via-[#1D0130] to-slate-900";
            bannerIcon = "🥛";
          } else if (dbCatName === 'Vegetables') {
            bannerTitle = "Fresh Garden Sourced Vegetables";
            bannerHighlight = "Crispy green leaf vegetables, organic roots & daily greens";
            bannerGradient = "from-emerald-950 via-[#1D0130] to-teal-950";
            bannerIcon = "🥦";
          } else if (dbCatName === 'Chocolates') {
            bannerTitle = `${selectedCategory} Delights`;
            bannerHighlight = "Sweets, premium dark chocolates, cookies & organic treats";
            bannerGradient = "from-amber-950 via-[#1D0130] to-rose-950";
            bannerIcon = "🍫";
          } else if (dbCatName === 'Masala Powder') {
            bannerTitle = "Indian Spices & Culinary Masalas";
            bannerHighlight = "Organic spices, premium ground masala & turmeric";
            bannerGradient = "from-orange-950 via-[#1D0130] to-amber-950";
            bannerIcon = "🌶️";
          }

          const dbCat = dbCategories.find(c => c.name === dbCatName);
          const bannerImage = dbCat?.image_url;
          const bgImage = dbCat?.dedicated_image_url;
          
          return (
            <div 
              className={`py-12 px-6 sm:px-12 text-gray-200 text-left relative overflow-hidden ${!bgImage ? `bg-gradient-to-r ${bannerGradient}` : ''}`}
              style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {bgImage && <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10 z-0"></div>}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1D0130]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-[#E4C560] to-amber-600/10 rounded-full blur-3xl pointer-events-none z-0"></div>
              
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-4">
                  <div className="text-[10px] text-[#E4C560] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="cursor-pointer hover:underline" onClick={() => { window.history.pushState({}, '', '/'); setCurrentView('home'); setSelectedCategory('All'); }}>Catalog</span>
                    <span>/</span>
                    <span className="text-gray-200">{getCategoryDisplayName(selectedCategory)}</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#E4C560] leading-tight">
                    {bannerTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-lg font-light leading-relaxed">
                    {bannerHighlight}. Freshly sourced and hygienically packed under strict quality monitoring standards.
                  </p>
                  
                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        window.history.pushState({}, '', '/');
                        setCurrentView('home');
                        setSelectedCategory('All');
                        setSelectedSubCategory(null);
                      }}
                      sx={{
                        color: '#E4C560',
                        borderColor: '#E4C560',
                        borderWidth: '1.5px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 3,
                        py: 0.75,
                        borderRadius: '9999px',
                        '&:hover': {
                          backgroundColor: 'rgba(228, 197, 96, 0.1)',
                          borderColor: 'white',
                          color: 'white'
                        }
                      }}
                      variant="outlined"
                    >
                      ← Back to Home Catalog
                    </Button>
                  </div>
                </div>

                {!bgImage && (bannerImage ? (
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center p-2 rounded-2xl bg-[#1D0130]/20 border border-white/10 backdrop-blur-sm z-10">
                    <img 
                      src={bannerImage} 
                      alt={selectedCategory} 
                      className="w-40 h-40 md:w-56 md:h-56 rounded-xl object-cover shadow-2xl shadow-black/50" 
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="text-8xl select-none opacity-20 filter saturate-50 animate-pulse hidden md:block">
                    {bannerIcon}
                  </div>
                ))}
              </div>
            </div>
          );
        })()
      ) : currentView === 'about' ? (
        /* Render About Us View */
        <div className="animate-fade-in">
          {/* About Us Hero Banner */}
          <div className="py-16 px-6 sm:px-12 bg-gradient-to-r from-purple-950 via-[#1D0130] to-indigo-950 text-gray-200 text-left relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1D0130]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-[#E4C560] to-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="text-[10px] text-[#E4C560] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="cursor-pointer hover:underline" onClick={() => { window.history.pushState({}, '', '/'); setCurrentView('home'); setSelectedCategory('All'); }}>Home</span>
                  <span>/</span>
                  <span className="text-gray-200">About Us</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#1D0130]/5 border border-white/10 text-[#E4C560] py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span>🌿 Our Organic Heritage</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">Our Sourcing & Heritage Story</h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-light leading-relaxed">
                  Delivering pasture-raised organic foods, chemical-free greens, and pure grocery essentials from our trusted partner farms directly to your doorstep.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      window.history.pushState({}, '', '/');
                      setCurrentView('home');
                      setSelectedCategory('All');
                    }}
                    sx={{
                      color: '#E4C560',
                      borderColor: '#E4C560',
                      borderWidth: '1.5px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 3,
                      py: 0.75,
                      borderRadius: '9999px',
                      '&:hover': {
                        backgroundColor: 'rgba(228, 197, 96, 0.1)',
                        borderColor: 'white',
                        color: 'white'
                      }
                    }}
                    variant="outlined"
                  >
                    ← Start Shopping Sourced Items
                  </Button>
                </div>
              </div>
              <div className="text-8xl select-none opacity-20 filter saturate-50 animate-pulse hidden md:block">🌾</div>
            </div>
          </div>

          {/* About Us Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase block mb-1">WHO WE ARE</span>
                <h2 className="text-3xl font-extrabold text-[#E4C560] font-serif leading-tight mb-4">Pioneering Farm-To-Table Pure Organic Food Sourcing</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Uma Grocery Supermarket was established with a singular, unyielding vision: to connect health-conscious families with natural, pesticide-free, pure farm produce. We believe that clean nutrition shouldn't be a luxury, but a cornerstone of healthy living.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  By partnering directly with over 50 local multi-generation organic farmers, we establish a transparent, high-integrity supply chain. This direct-sourcing model ensures our growers receive fair compensation while delivering unmatched freshness and nutrient density directly to your dining table.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-xl h-80 border border-purple-900/40">
                <img 
                  src="/banner.png" 
                  alt="Organic Farming" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Sourcing Statistics */}
            <div className="bg-[#1D0130]/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-gray-200 mb-16 relative overflow-hidden shadow-xl border border-purple-900/40">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#1D0130]/10 rounded-full blur-3xl"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                <div className="space-y-1">
                  <span className="block text-4xl font-extrabold text-emerald-600 font-serif">50+</span>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Partner Organic Farms</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-4xl font-extrabold text-emerald-600 font-serif">10K+</span>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Satisfied Families</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-4xl font-extrabold text-emerald-600 font-serif">2 Hrs</span>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Delivery Time</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-4xl font-extrabold text-emerald-600 font-serif">100%</span>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Organic Certified</span>
                </div>
              </div>
            </div>

            {/* Story Cards Grid */}
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">OUR CORE PILLARS</p>
              <h2 className="text-2xl font-extrabold text-[#E4C560] font-serif mt-1">Excellence in Sourcing & Quality Standards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1D0130] border border-purple-900/40 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-4">🥦</div>
                <h3 className="text-lg font-bold text-[#E4C560] font-serif mb-2">Direct Farm Sourcing</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We eliminate intermediaries to establish short, transparent pathways directly from regional certified soil crops to your kitchen.
                </p>
              </div>
              <div className="bg-[#1D0130] border border-purple-900/40 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-4">🧪</div>
                <h3 className="text-lg font-bold text-[#E4C560] font-serif mb-2">Rigorous Quality Checks</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Every batch of incoming vegetables and dairy undergoes precise checks to guarantee zero pesticide and chemical residues.
                </p>
              </div>
              <div className="bg-[#1D0130] border border-purple-900/40 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-4">♻️</div>
                <h3 className="text-lg font-bold text-[#E4C560] font-serif mb-2">Eco-Friendly Packaging</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We are deeply committed to environment conservation. We package all grocery items in organic, food-grade biodegradable wraps.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Render Contact Us View */
        <div className="animate-fade-in">
          {/* Contact Us Hero Banner */}
          <div className="py-16 px-6 sm:px-12 bg-gradient-to-r from-purple-950 via-[#1D0130] to-indigo-950 text-gray-200 text-left relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1D0130]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-[#E4C560] to-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="text-[10px] text-[#E4C560] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="cursor-pointer hover:underline" onClick={() => { window.history.pushState({}, '', '/'); setCurrentView('home'); setSelectedCategory('All'); }}>Home</span>
                  <span>/</span>
                  <span className="text-gray-200">Contact Us</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#1D0130]/5 border border-white/10 text-[#E4C560] py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span>📞 24/7 Client Care Center</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">Get in Touch With Us</h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-light leading-relaxed">
                  Have questions about our farm partners, organic credentials, or need support with your checkout order? Our team is standing by to assist you.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      window.history.pushState({}, '', '/');
                      setCurrentView('home');
                      setSelectedCategory('All');
                    }}
                    sx={{
                      color: '#E4C560',
                      borderColor: '#E4C560',
                      borderWidth: '1.5px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 3,
                      py: 0.75,
                      borderRadius: '9999px',
                      '&:hover': {
                        backgroundColor: 'rgba(228, 197, 96, 0.1)',
                        borderColor: 'white',
                        color: 'white'
                      }
                    }}
                    variant="outlined"
                  >
                    ← Back to Store Shopping
                  </Button>
                </div>
              </div>
              <div className="text-8xl select-none opacity-20 filter saturate-50 animate-pulse hidden md:block">📞</div>
            </div>
          </div>

          {/* Dual Column Contact Us Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Sourcing Center Information */}
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase block mb-1">VISIT OR CALL US</span>
                  <h2 className="text-3xl font-extrabold text-[#E4C560] font-serif leading-tight">Our Premium Sourcing Headquarters</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mt-3">
                    Feel free to reach out to our customer care center. We strive to respond to all general inquiries and shipping updates within 1 hour.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 bg-[#FAF7FB] rounded-2xl border border-[#2A0033]">
                    <div className="bg-gray-800 text-gray-200 p-3 rounded-xl">
                      <MapPin size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E4C560] font-serif text-sm">Sourcing Headquarters</h4>
                      <p className="text-xs text-purple-300 mt-1 leading-relaxed">
                        Ayyampatty pillaiyar kovil street,<br />
                        Srivilliputtur-626125.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-[#FAF7FB] rounded-2xl border border-[#2A0033]">
                    <div className="bg-gray-800 text-gray-200 p-3 rounded-xl">
                      <Mail size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E4C560] font-serif text-sm">Direct Hotlines & Support</h4>
                      <p className="text-xs text-purple-300 mt-1">
                        Owner: <strong>M. Uma</strong><br />
                        Phones: <strong>7530085513, 6381225336</strong><br />
                        Support Email: <strong>support@umacgrocery.com</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-[#FAF7FB] rounded-2xl border border-[#2A0033]">
                    <div className="bg-gray-800 text-gray-200 p-3 rounded-xl">
                      <Truck size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E4C560] font-serif text-sm">Customer Care Sourcing Hours</h4>
                      <p className="text-xs text-purple-300 mt-1">
                        Open Daily: <strong>06:00 AM - 10:00 PM</strong><br />
                        Express Sourced Deliveries: Dispatched 24/7.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sourcing Inquiry Form */}
              <div className="bg-[#1D0130] border border-purple-900/40 p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full pointer-events-none"></div>
                
                <h3 className="text-xl font-bold text-[#E4C560] font-serif mb-2">Send us a Message</h3>
                <p className="text-purple-300 text-xs mb-6">Fill in details below and our sourcing coordinator will follow up immediately.</p>

                {contactSuccess ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 animate-fade-in my-6">
                    <CheckCircle size={48} className="text-green-600 mx-auto animate-bounce" />
                    <h4 className="text-lg font-bold text-green-950 font-serif">Message Dispatched Successfully!</h4>
                    <p className="text-xs text-green-800">
                      Thank you for contacting us, <strong>{contactName}</strong>. Our organic sourcing coordinator will contact you at <strong>{contactEmail}</strong> shortly.
                    </p>
                    <Button
                      onClick={() => {
                        setContactSuccess(false);
                        setContactName('');
                        setContactEmail('');
                        setContactSubject('');
                        setContactMessage('');
                      }}
                      sx={{
                        backgroundColor: '#4A0E4E',
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        px: 3,
                        py: 0.75,
                        borderRadius: '9999px',
                        '&:hover': { backgroundColor: '#2A0033' }
                      }}
                      variant="contained"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider">Your Full Name</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. Kanmani Raj"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider">Mail ID (Email Address)</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. name@domain.com"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider">Subject</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. Bulk organic sourcing, feedback, business partnership"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider">Message Description</label>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Detail your inquiry..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </div>

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={contactLoading}
                      onClick={handleContactSubmit}
                      sx={{
                        background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
                        color: '#1D0130',
                        borderRadius: '12px',
                        py: 1.25,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(228, 197, 96, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)',
                        }
                      }}
                    >
                      {contactLoading ? 'Dispatching Message...' : 'Dispatch Sourcing Message'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Shop / Products Grid Section */}
      {(currentView === 'home' || currentView === 'category-page') && (
        <main id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 text-left">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">Premium Selection</p>
              <h2 className="text-3xl font-extrabold text-[#E4C560] font-serif mt-1 animate-fade-in">
                {selectedCategory === 'All' ? 'Our Sourced Catalog' : `${getCategoryDisplayName(selectedCategory)} Collection`}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-600 to-teal-400 mt-2 rounded-full"></div>
            </div>
            <span className="text-xs font-bold text-white bg-[#1D0130] border border-purple-900/40 py-1.5 px-4 rounded-full">
              🛍️ {products.length} Products Found in {getCategoryDisplayName(selectedCategory)}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <CircularProgress sx={{ color: '#4A0E4E' }} />
            </div>
          ) : (() => {
            const filteredProducts = products;
            const ITEMS_PER_PAGE = 8;
            const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
            const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
            const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
            const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

            return (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                  {currentProducts.map((product, idx) => {
                    // Create dynamic labels/badges for premium aesthetics
                    const discounts = ["20% OFF", "POPULAR", "NEW", "ORGANIC"];
                    const discountLabel = discounts[idx % discounts.length];
                    const rating = 4 + (idx % 2 === 0 ? 0.8 : 0.5);

                    // Find if this product is already in the cart to render the dynamic quantity selector
                    const cartItem = cart.find(item => item.product_details.id === product.id);

                    return (
                      <Card 
                        key={product.id} 
                        sx={{
                          borderRadius: '24px',
                          border: '1px solid #F3EDF5',
                          boxShadow: '0 4px 20px rgba(74, 14, 78, 0.02)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'visible',
                          '&:hover': {
                            boxShadow: '0 12px 30px rgba(74, 14, 78, 0.08)',
                            transform: 'translateY(-6px)',
                            '& .add-btn': {
                              backgroundColor: '#4A0E4E',
                              color: 'white',
                            }
                          }
                        }}
                      >
                        {/* Floating Premium Badges (Aligned Top-Left) */}
                        <span className={`absolute top-4 left-4 z-10 text-[9px] font-extrabold text-gray-200 py-1 px-3 rounded-full uppercase tracking-wider shadow-sm ${
                          discountLabel === '20% OFF' || discountLabel === 'POPULAR' ? 'bg-[#4A0E4E]' : 'bg-emerald-600 text-white'
                        }`}>
                          {discountLabel}
                        </span>

                        {/* Properly padded and centered product image */}
                        <div 
                          className="rounded-t-[24px] flex items-center justify-center h-48 overflow-hidden relative cursor-pointer group/img"
                        >
                          {product.name.toLowerCase() === 'tomato' ? (
                            <>
                              <img
                                src={tomatoImages[tomatoSlideIndex]}
                                alt={product.name}
                                onClick={() => setViewingProduct({
                                  ...product,
                                  image_url: tomatoImages[tomatoSlideIndex]
                                })}
                                onError={handleImageError}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Left Arrow Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTomatoSlideIndex((prev) => (prev - 1 + tomatoImages.length) % tomatoImages.length);
                                }}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-[#1D0130]/95 backdrop-blur-md/70 hover:bg-emerald-600 text-gray-200 hover:text-white p-1.5 rounded-full transition-all duration-300 border border-purple-900/40 shadow-md z-20"
                              >
                                <ArrowLeft size={14} />
                              </button>

                              {/* Right Arrow Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTomatoSlideIndex((prev) => (prev + 1) % tomatoImages.length);
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#1D0130]/95 backdrop-blur-md/70 hover:bg-emerald-600 text-gray-200 hover:text-white p-1.5 rounded-full transition-all duration-300 border border-purple-900/40 shadow-md z-20"
                              >
                                <ArrowRight size={14} />
                              </button>

                              {/* Slide indicator dots */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                                {tomatoImages.map((_, dotIdx) => (
                                  <div
                                    key={dotIdx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      dotIdx === tomatoSlideIndex ? 'w-3.5 bg-emerald-600' : 'w-1.5 bg-gray-300'
                                    }`}
                                  ></div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <img
                                src={product.image_url}
                                alt={product.name}
                                onClick={() => setViewingProduct(product)}
                                onError={handleImageError}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Quick View Overlay on hover */}
                              <div className="absolute inset-0 bg-[#2A0033]/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" onClick={() => setViewingProduct(product)}>
                                <span className="bg-[#1D0130]/95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                                  🔍 Quick View
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <CardContent sx={{ px: 3, pt: 2, pb: 2, textAlign: 'left' }}>
                          <Typography variant="caption" sx={{ color: '#8E2DE2', fontStyle: 'italic', fontWeight: 'bold', textTransform: 'uppercase', tracking: 1.5 }}>
                            {getCategoryDisplayName(product.category_name)}
                          </Typography>
                          
                          {/* Brand New Layout: Product Name with Wishlist Heart Button right next to it! */}
                          <div className="flex items-start justify-between gap-2 mt-0.5 mb-1">
                            <Typography 
                              variant="h6" 
                              component="h3" 
                              onClick={() => setViewingProduct(product)}
                              sx={{ 
                                fontWeight: 'bold', 
                                color: '#2A0033', 
                                // minHeight removed 
                                overflow: 'hidden', 
                                display: '-webkit-box', 
                                WebkitLineClamp: 2, 
                                WebkitBoxOrient: 'vertical', 
                                fontSize: '1.05rem', 
                                lineHeight: '1.3',
                                flex: 1,
                                cursor: 'pointer',
                                '&:hover': {
                                  color: '#8E2DE2'
                                }
                              }}
                            >
                              {product.name}
                            </Typography>
                            {/* Perfect Alignment for the Wishlist heart button right next to name */}
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(product.id);
                              }}
                              className="transition-transform duration-300 hover:scale-110" 
                              sx={{ 
                                color: likedProducts.includes(product.id) ? '#EF4444' : '#8E2DE2',
                                border: '1px solid #F3EDF5',
                                backgroundColor: 'white',
                                p: 0.5,
                                mt: 0.5,
                                '&:hover': { backgroundColor: '#FDFBFE' },
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                              }}
                            >
                              <Heart size={14} className={likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-[#8E2DE2]"} />
                            </IconButton>
                          </div>

                          {/* Ratings Stars */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  className={`fill-current ${i < Math.floor(rating) ? 'text-emerald-600' : 'text-gray-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-purple-300 font-bold">({rating})</span>
                          </div>

                          <div className="flex items-center justify-between mt-1 font-sans">
                            <div>
                              <Typography variant="h5" sx={{ color: '#4A0E4E', fontWeight: '900', fontSize: '1.25rem' }}>
                                ₹{product.price}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                {product.unit}
                              </Typography>
                            </div>
                            
                            {/* Dynamic Add / Quantity Controller Button Block (Enhanced UI/UX) */}
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-[#4A0E4E] text-white rounded-full px-1 py-0.5" style={{ minWidth: '90px' }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                  <Minus size={14} />
                                </IconButton>
                                <span className="text-sm font-bold w-4 text-center">{cartItem.quantity}</span>
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                  <Plus size={14} />
                                </IconButton>
                              </div>
                            ) : (
                              <Button
                                variant="outlined"
                                className="add-btn"
                                onClick={() => addToCart(product)}
                                sx={{
                                  borderColor: '#4A0E4E',
                                  color: '#4A0E4E',
                                  borderRadius: '9999px',
                                  textTransform: 'none',
                                  fontWeight: 'bold',
                                  px: 3,
                                  py: 0.75,
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    backgroundColor: '#4A0E4E',
                                    color: 'white',
                                    borderColor: '#4A0E4E'
                                  }
                                }}
                                startIcon={<Plus size={14} />}
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Premium Luxury Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[#2A0033]">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                        setTimeout(() => {
                          document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      disabled={currentPage === 1}
                      sx={{
                        borderRadius: '12px',
                        borderColor: '#4A0E4E',
                        color: '#4A0E4E',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: 'rgba(74, 14, 78, 0.05)',
                          borderColor: '#4A0E4E',
                        },
                        '&.Mui-disabled': {
                          borderColor: 'rgba(74, 14, 78, 0.12)',
                          color: 'rgba(74, 14, 78, 0.3)'
                        }
                      }}
                    >
                      Previous
                    </Button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <IconButton
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            setTimeout(() => {
                              document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            backgroundColor: isActive ? '#E4C560' : 'transparent',
                            color: isActive ? '#1D0130' : '#4A0E4E',
                            border: isActive ? '1px solid #E4C560' : '1px solid rgba(74, 14, 78, 0.15)',
                            boxShadow: isActive ? '0 4px 10px rgba(228, 197, 96, 0.3)' : 'none',
                            '&:hover': {
                              backgroundColor: isActive ? '#E4C560' : 'rgba(74, 14, 78, 0.05)',
                              borderColor: isActive ? '#E4C560' : '#4A0E4E',
                            }
                          }}
                        >
                          {pageNum}
                        </IconButton>
                      );
                    })}

                    <Button
                      variant="outlined"
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        setTimeout(() => {
                          document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      disabled={currentPage === totalPages}
                      sx={{
                        borderRadius: '12px',
                        borderColor: '#4A0E4E',
                        color: '#4A0E4E',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: 'rgba(74, 14, 78, 0.05)',
                          borderColor: '#4A0E4E',
                        },
                        '&.Mui-disabled': {
                          borderColor: 'rgba(74, 14, 78, 0.12)',
                          color: 'rgba(74, 14, 78, 0.3)'
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            );
          })()}

          {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-[#1D0130] rounded-3xl border border-[#2A0033] p-8 shadow-inner">
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                No organic items found matching the filter criteria.
              </Typography>
            </div>
          )}
        </main>
      )}

      {/* Premium Promotional Offers & Ads Section */}
      {currentView === 'home' && offers.length > 0 && (
        <section id="offers-section" className="bg-[#FAF6FB] py-16 border-t border-[#2A0033]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">EXQUISITE OFFERS</p>
              <h2 className="text-3xl font-extrabold text-[#1D0130] font-serif mt-1">Exclusive Deals & Broadcasted Ads</h2>
              <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">Sourced directly from our partner farms. Broadcasted live to all registered shoppers.</p>
              <div className="h-1 w-20 bg-gradient-to-r from-emerald-600 to-teal-400 mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {offers.map((offer) => {
                const discount = offer.discount_percentage;
                const prod = offer.product_details;
                const image = offer.image_url || (prod ? prod.image_url : "/logo.png");
                
                return (
                  <div 
                    key={offer.id} 
                    className="bg-[#1D0130] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row relative text-left group"
                  >
                    {discount && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-extrabold text-xs uppercase py-1.5 px-3.5 rounded-full shadow-lg z-20 animate-pulse">
                        {discount}% OFF
                      </div>
                    )}
                    
                    {/* Offer Image */}
                    <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                      <img 
                        src={image} 
                        alt={offer.title} 
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1D0130]/90 md:to-[#1D0130] pointer-events-none"></div>
                    </div>

                    {/* Offer Details */}
                    <div className="p-8 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest block">
                          Broadcasted Promotion
                        </span>
                        <h3 className="text-xl font-bold text-[#E4C560] font-serif leading-snug">
                          {offer.title}
                        </h3>
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                          {offer.description}
                        </p>
                      </div>

                      {prod && (
                        <div className="bg-[#2A0033]/60 border border-purple-900/40 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={prod.image_url} 
                              alt={prod.name} 
                              onError={handleImageError}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10"
                            />
                            <div>
                              <h4 className="font-bold text-white text-xs truncate max-w-[120px]">{prod.name}</h4>
                              <p className="text-[10px] text-purple-300">{prod.unit}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-white">₹{prod.price}</span>
                                {discount && (
                                  <span className="text-[10px] line-through text-purple-400">
                                    ₹{(Number(prod.price) * (100 / (100 - discount))).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => addToCart(prod)}
                            size="small"
                            sx={{
                              backgroundColor: '#8B9A46',
                              color: 'white',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              borderRadius: '9999px',
                              px: 2,
                              fontSize: '11px',
                              '&:hover': { backgroundColor: '#7A8836' }
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      )}

                      {!prod && (
                        <div className="pt-2">
                          <Button
                            onClick={() => {
                              const element = document.getElementById('shop-section');
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            variant="outlined"
                            size="small"
                            sx={{
                              color: '#E4C560',
                              borderColor: '#E4C560',
                              borderRadius: '9999px',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              fontSize: '11px',
                              px: 3,
                              '&:hover': {
                                backgroundColor: 'rgba(228, 197, 96, 0.1)',
                                borderColor: 'white',
                                color: 'white'
                              }
                            }}
                          >
                            Explore Sourced Store
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Deluxe Supermarket Footer */}
      <footer className="bg-[#1D0130] border-t border-[#2A0033] text-gray-400 pt-16 pb-8 border-t-4 border-[#E4C560]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-purple-900/40">
            
            {/* Branding Column */}
            <div className="space-y-4 text-left">
              <img src="/logo.png" alt="Uma Footer Logo" className="h-16 w-auto object-contain bg-[#1D0130]/5 p-2 rounded-xl" />
              <p className="text-xs text-purple-300 leading-relaxed font-light">
                Uma Grocery Supermarket is your premium destination for the finest handpicked organic farm vegetables, dairy essentials, and quality pantry groceries.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-600 text-[#E4C560] font-extrabold uppercase py-0.5 px-2 rounded">
                  ESTD. 2026
                </span>
                <span className="text-xs text-purple-300">Fresh • Quality • Trusted</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-left">
              <h4 className="text-gray-200 font-bold text-sm tracking-widest uppercase mb-4 border-b border-purple-900/40 pb-2">Quick Navigation</h4>
              <ul className="space-y-2.5 text-xs text-purple-300">
                {categoriesList.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => {
                        setSelectedCategory(cat);
                        document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-600 transition-colors uppercase tracking-wider font-semibold text-[11px]"
                    >
                      Shop {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information Policy */}
            <div className="text-left">
              <h4 className="text-gray-200 font-bold text-sm tracking-widest uppercase mb-4 border-b border-purple-900/40 pb-2">Our Standards</h4>
              <ul className="space-y-2 text-xs text-purple-300">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Client Support Policies</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">100% Moneyback Returns</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Farm Sourcing & Testing</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Premium Service</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Agreement</a></li>
              </ul>
            </div>

            {/* Delivery Hours */}
            <div className="space-y-4 text-left">
              <h4 className="text-gray-200 font-bold text-sm tracking-widest uppercase border-b border-purple-900/40 pb-2">Working Hours</h4>
              <p className="text-xs text-purple-300 leading-relaxed font-light">
                Open Daily: <strong>06:00 AM - 10:00 PM</strong><br />
                Delivery Slots: Available every 2 hours.
              </p>
              <div className="p-3 bg-gray-900/40 border border-purple-900/40 rounded-xl">
                <span className="block text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Premium Hotlines</span>
                <span className="text-[13px] font-bold text-gray-200 tracking-wider block">7530085513</span>
                <span className="text-[13px] font-bold text-gray-200 tracking-wider block">6381225336</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300 text-left">
            <p>© 2026 Uma Grocery Supermarket. Designed with Modave multipurpose WooCommerce styling. All Rights Reserved.</p>
            <div className="flex items-center gap-3">
              <span className="bg-gray-900/80 py-1 px-3 border border-purple-900/40 rounded text-[10px] tracking-wider uppercase font-bold text-[#E4C560]">
                SECURE SSL PAYMENTS
              </span>
            </div>
          </div>
        </div>
      </footer>

      
      {/* Mobile Navigation Drawer */}
      <Drawer anchor="left" open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className="w-72 h-full flex flex-col bg-[#1D0130] text-white">
          <div className="p-5 flex items-center justify-between border-b border-purple-900/40">
            <img src="/logo.png" alt="Uma Grocery" className="h-10 w-auto object-contain" />
            <IconButton autoFocus onClick={() => setIsMobileMenuOpen(false)} sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <Button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setSelectedCategory('All');
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
            >
              <span className="font-serif">Home</span>
            </Button>
            <div className="border-t border-purple-900/40 my-2"></div>
            <Typography variant="overline" sx={{ px: 2, color: '#E4C560' }}>Categories</Typography>
            {dbCategories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => {
                  const slug = categoryToSlug[cat.name] || cat.name.toLowerCase().replace(/\s+/g, '-');
                  window.history.pushState({}, '', `/category/${slug}`);
                  setSelectedCategory(cat.name);
                  setCurrentView('category-page');
                  setSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                sx={{ color: 'gray', justifyContent: 'flex-start', textTransform: 'none', pl: 4 }}
              >
                {cat.name}
              </Button>
            ))}
            <div className="border-t border-purple-900/40 my-2"></div>
            <Button
              onClick={() => {
                window.history.pushState({}, '', '/about');
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
            >
              <span className="font-serif">About Us</span>
            </Button>
            <Button
              onClick={() => {
                window.history.pushState({}, '', '/contact');
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
            >
              <span className="font-serif">Contact Us</span>
            </Button>
            {currentUser && (
              <>
                <div className="border-t border-purple-900/40 my-2"></div>
                <Typography variant="overline" sx={{ px: 2, color: '#E4C560' }}>Account</Typography>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openProfile();
                  }}
                  sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
                  startIcon={<User size={18} />}
                >
                  <span className="font-serif">My Profile</span>
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openOrdersTracking();
                  }}
                  sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
                  startIcon={<Truck size={18} />}
                >
                  <span className="font-serif">Track My Orders</span>
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  sx={{ color: 'tomato', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
                >
                  <span className="font-serif">Logout</span>
                </Button>
              </>
            )}

          </div>
        </div>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <div className="w-96 h-full flex flex-col bg-[#FAF7FB]">
          <div className="p-5 border-b border-purple-900/40 flex items-center justify-between bg-gradient-to-r from-purple-950 to-indigo-950 text-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-[#E4C560]" />
              <Typography variant="h6" sx={{ fontStyle: 'serif', fontWeight: 'bold' }}>Shopping Bag ({cart.length})</Typography>
            </div>
            <IconButton autoFocus onClick={() => setIsCartOpen(false)} size="small" sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#1D0130] text-white rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingCart size={28} />
                </div>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'purple.950' }}>Your bag is empty</Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>Add high-quality organic fresh food items to start shopping!</Typography>
                </div>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  variant="contained" 
                  sx={{ backgroundColor: '#4A0E4E', color: 'white', px: 4, borderRadius: '9999px', mt: 2 }}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-purple-100 bg-white p-3 rounded-xl shadow-sm relative">
                    <img
                      src={item.product_details.image_url}
                      alt={item.product_details.name}
                      onError={handleImageError}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-left">
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1D0130' }}>
                        {item.product_details.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E2DE2', fontWeight: 'bold' }}>
                        ₹{item.product_details.price} {item.product_details.unit}
                      </Typography>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center justify-between bg-[#4A0E4E] text-white rounded-full px-1 py-0.5" style={{ minWidth: '90px' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <Minus size={14} />
                          </IconButton>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <Plus size={14} />
                          </IconButton>
                        </div>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          color="error"
                          className="ml-auto"
                          sx={{ p: 0.5, border: '1px solid #FFEDEE' }}
                        >
                          <X size={12} />
                        </IconButton>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4A0E4E' }}>
                        ₹{parseFloat(item.total_price.toString()).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-5 border-t border-purple-100 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between mb-2">
                <Typography variant="body2" sx={{ color: 'gray.500', fontStyle: 'serif' }}>Bag Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{totalPrice.toFixed(2)}</Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography variant="body2" sx={{ color: 'gray.500', fontStyle: 'serif' }}>Organic Sourcing & Delivery</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: deliveryCharge === 0 ? 'green.600' : 'gray.700' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </Typography>
              </div>
              <div className="flex justify-between mb-4 pt-2 border-t border-[#2A0033]">
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontStyle: 'serif', color: 'purple.950' }}>Total Amount</Typography>
                <Typography variant="h6" sx={{ color: '#4A0E4E', fontWeight: '900' }}>
                  ₹{(totalPrice + deliveryCharge).toFixed(2)}
                </Typography>
              </div>
              <Button 
                variant="contained" 
                fullWidth 
                size="large" 
                onClick={handleCheckout}
                sx={{
                  backgroundColor: '#4A0E4E',
                  color: 'white',
                  borderRadius: '9999px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  py: 1.5,
                  boxShadow: '0 4px 15px rgba(74, 14, 78, 0.3)',
                  '&:hover': { backgroundColor: '#2A0033' }
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Wishlist Drawer */}
      <Drawer anchor="right" open={isLikesOpen} onClose={() => setIsLikesOpen(false)}>
        <div className="w-96 h-full flex flex-col bg-[#FAF7FB]">
          <div className="p-5 border-b border-purple-900/40 flex items-center justify-between bg-gradient-to-r from-purple-950 to-indigo-950 text-gray-200">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-red-500 fill-red-500" />
              <Typography variant="h6" sx={{ fontStyle: 'serif', fontWeight: 'bold' }}>My Wishlist ({likedProducts.length})</Typography>
            </div>
            <IconButton autoFocus onClick={() => setIsLikesOpen(false)} size="small" sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {likedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#1D0130] text-white rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Heart size={28} className="text-gray-400" />
                </div>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'purple.950' }}>Your wishlist is empty</Typography>
                  <Typography variant="caption" color="text.secondary">Heart your favorite organic items to save them here!</Typography>
                </div>
                <Button 
                  onClick={() => setIsLikesOpen(false)}
                  variant="contained" 
                  sx={{ backgroundColor: '#4A0E4E', color: 'white', px: 4, borderRadius: '9999px', mt: 2 }}
                >
                  Discover Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {allProducts.filter(p => likedProducts.includes(p.id)).map(product => {
                  const isAlreadyInCart = cart.find(item => item.product_details.id === product.id);
                  return (
                    <div key={product.id} className="flex gap-4 pb-4 border-b border-purple-100 bg-white p-3 rounded-xl shadow-sm relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        onError={handleImageError}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 text-left">
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1D0130' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8E2DE2', fontWeight: 'bold' }}>
                          ₹{product.price} {product.unit}
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              addToCart(product);
                            }}
                            sx={{
                              backgroundColor: isAlreadyInCart ? '#4A0E4E' : '#E4C560',
                              color: isAlreadyInCart ? 'white' : '#1D0130',
                              textTransform: 'none',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              borderRadius: '9999px',
                              px: 2,
                              py: 0.5,
                              '&:hover': {
                                backgroundColor: isAlreadyInCart ? '#2A0033' : '#C7AB4B'
                              }
                            }}
                          >
                            {isAlreadyInCart ? 'Added' : 'Add to Bag'}
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => toggleLike(product.id)}
                            color="error"
                            className="ml-auto"
                            sx={{ p: 0.5, border: '1px solid #FFEDEE' }}
                          >
                            <X size={12} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Deluxe Portal Dialogs */}
      <Dialog 
        open={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', overflow: 'hidden' }
        }}
      >
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-5 text-white flex justify-between items-center">
          <h2 className="font-serif text-2xl font-bold">My Profile Settings</h2>
          <button onClick={() => setIsProfileOpen(false)} className="hover:text-emerald-400 transition-colors"><X size={24} /></button>
        </div>
        <DialogContent sx={{ p: 4 }}>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
              <input
                type="text"
                value={profileForm.first_name}
                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address (Read-Only)</label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                readOnly
                className="w-full border border-gray-200 bg-gray-50 text-gray-400 rounded-xl px-4 py-2 cursor-not-allowed font-medium select-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dispatch Address</label>
              <textarea
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pincode</label>
              <input
                type="text"
                value={profileForm.pincode}
                onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-purple-700 uppercase mb-2">Preferred Website Language</label>
              <select
                value={profileForm.language}
                onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                className="w-full border border-purple-200 bg-purple-50 text-purple-900 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="en">English (Default)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Changing your language will automatically translate the entire store and reload the page.</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => {
              handleLogout();
              setIsProfileOpen(false);
            }} 
            color="error" 
            variant="outlined" 
            sx={{ fontWeight: 'bold', borderRadius: '12px' }}
          >
            Logout Securely
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => setIsProfileOpen(false)} sx={{ color: 'gray', fontWeight: 'bold' }}>Cancel</Button>
            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              variant="contained" 
              sx={{ backgroundColor: '#1D0130', borderRadius: '12px', px: 4, fontWeight: 'bold', '&:hover': { backgroundColor: '#4A0E4E' } }}
            >
              {loading ? 'Saving...' : 'Save Profile Settings'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '24px', 
            p: 0,
            backgroundColor: '#1D0130',
            color: 'white',
            border: '1px solid rgba(228, 197, 96, 0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }
        }}
      >
        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Left Column: Brand Showcase Panel (Visible on Desktop) */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-[#2A0033] via-[#1D0130] to-[#0A000D] p-8 flex-col justify-between border-r border-purple-900/40/50 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#1D0130]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-left">
              <img src="/logo.png" alt="Uma Logo" className="h-14 w-auto object-contain mb-6 animate-pulse" />
              <h3 className="text-xl font-bold font-serif text-emerald-600 leading-tight">Welcome to Uma Grocery</h3>
              <p className="text-xs text-gray-400 mt-2 font-light">Your premier destination for handpicked fresh organic farm vegetables, premium dairy, and luxury grocery essentials.</p>
            </div>
            
            <div className="space-y-4 relative z-10 text-left my-8">
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold">✓</span>
                <span>100% Organic Sourcing</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold">✓</span>
                <span>Free Express Delivery above ₹500</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold">✓</span>
                <span>Secure Real-Time OTP Verification</span>
              </div>
            </div>
            
            <div className="relative z-10 text-[10px] text-purple-300 tracking-wider font-semibold uppercase">
              ESTD. 2026 • FRESH & TRUSTED
            </div>
          </div>

          {/* Right Column: Dynamic Form Fields Panel */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center relative bg-[#1D0130]/95 backdrop-blur-md">
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <Typography variant="h5" sx={{ fontStyle: 'serif', fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                Client Login Portal
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray.400', mb: 3, fontStyle: 'serif', fontSize: '13px' }}>
                Sign in to manage your luxury grocery orders
              </Typography>

              {error && (
                <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl flex gap-2 items-center text-left animate-fade-in">
                  <ShieldAlert size={16} className="text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email ID or Username</label>
                  <TextField
                    fullWidth
                    placeholder="Enter your Email ID or Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    InputProps={{
                      startAdornment: <Mail size={18} className="text-emerald-600 mr-2 opacity-80" />
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '14px', 
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&:hover fieldset': { borderColor: '#E4C560' },
                        '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                      }
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                  <TextField
                    fullWidth
                    placeholder="••••••••"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    InputProps={{
                      startAdornment: <Lock size={18} className="text-emerald-600 mr-2 opacity-80" />
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '14px', 
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&:hover fieldset': { borderColor: '#E4C560' },
                        '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mt-6">
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleLogin}
                  sx={{ 
                    background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
                    color: '#1D0130',
                    borderRadius: '14px', 
                    py: 1.5, 
                    fontWeight: 'bold', 
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(228, 197, 96, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)',
                    }
                  }}
                >
                  Authenticate
                </Button>
                
                <Button 
                  fullWidth 
                  onClick={() => setIsLoginOpen(false)} 
                  sx={{ 
                    borderRadius: '14px',
                    py: 1.25, 
                    textTransform: 'none', 
                    color: 'gray.400', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.03)' } 
                  }}
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-900/40 w-full text-center">
                <Typography variant="body2" color="gray.400">
                  Don't have an organic account?{' '}
                  <Button
                    size="small"
                    onClick={() => {
                      setIsLoginOpen(false);
                      setIsSignupOpen(true);
                    }}
                    sx={{ color: '#E4C560', fontWeight: 'bold', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog 
        open={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '24px', 
            p: 0,
            backgroundColor: '#1D0130',
            color: 'white',
            border: '1px solid rgba(228, 197, 96, 0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }
        }}
      >
        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Left Column: Brand Showcase Panel (Visible on Desktop) */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-[#2A0033] via-[#1D0130] to-[#0A000D] py-6 px-7 flex-col justify-between border-r border-purple-900/40/50 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#1D0130]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-left">
              <img src="/logo.png" alt="Uma Logo" className="h-14 w-auto object-contain mb-6 animate-pulse" />
              <h3 className="text-xl font-bold font-serif text-emerald-600 leading-tight">Join the Premium Club</h3>
              <p className="text-xs text-gray-400 mt-2 font-light">Register a premium customer account to access high-quality organic groceries, customized discounts, and farm-fresh greens.</p>
            </div>
            
            <div className="space-y-4 relative z-10 text-left my-8">
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold">✓</span>
                <span>Direct Organic Farm Sourcing</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold">✓</span>
                <span>Fast & Safe Checkout Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold">✓</span>
                <span>Instant OTP Verification Security</span>
              </div>
            </div>
            
            <div className="relative z-10 text-[10px] text-purple-300 tracking-wider font-semibold uppercase">
              ESTD. 2026 • FRESH & TRUSTED
            </div>
          </div>

          {/* Right Column: Dynamic Form Fields Panel */}
          <div className="w-full md:w-3/5 py-6 px-7 flex flex-col justify-center relative bg-[#1D0130]/95 backdrop-blur-md">
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="text-center md:text-left mb-3">
                <Typography variant="h5" sx={{ fontStyle: 'serif', fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                  {otpSent ? 'Verify OTP Code' : 'Register Premium Account'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray.400', fontStyle: 'serif', fontSize: '13px' }}>
                  {otpSent ? 'Please enter the 6-digit verification code sent to your Mail ID' : 'Join Uma Grocery for an exquisite shopping experience'}
                </Typography>
              </div>

              {error && (
                <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl flex gap-2 items-center text-left animate-fade-in">
                  <ShieldAlert size={16} className="text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Input Registration Details */}
              {!otpSent ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">User Name (Full Name)</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. kanmani"
                        value={signupName}
                        name="username"
                        id="signup-username"
                        autoComplete="username"
                        onChange={(e) => setSignupName(e.target.value)}
                        InputProps={{
                          startAdornment: <User size={15} className="text-emerald-600 mr-2 opacity-80" />
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px', 
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mail ID (Email)</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. name@domain.com"
                        type="email"
                        value={signupEmail}
                        name="email"
                        id="signup-email"
                        autoComplete="email"
                        onChange={(e) => setSignupEmail(e.target.value)}
                        InputProps={{
                          startAdornment: <Mail size={15} className="text-emerald-600 mr-2 opacity-80" />
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px', 
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. 976546755"
                        value={signupPhone}
                        name="phone"
                        id="signup-phone"
                        autoComplete="tel"
                        onChange={(e) => setSignupPhone(e.target.value)}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px', 
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pincode</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. 987654"
                        value={signupPincode}
                        name="pincode"
                        id="signup-pincode"
                        autoComplete="postal-code"
                        onChange={(e) => setSignupPincode(e.target.value)}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px', 
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={signupPassword}
                        name="password"
                        id="signup-password"
                        autoComplete="new-password"
                        onChange={(e) => setSignupPassword(e.target.value)}
                        InputProps={{
                          startAdornment: <Lock size={15} className="text-emerald-600 mr-2 opacity-80" />,
                          endAdornment: (
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{ color: 'rgba(255,255,255,0.4)', p: 0.5, mr: 0.5, '&:hover': { color: 'white' } }}
                            >
                              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </IconButton>
                          )
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px', 
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="••••••••"
                        type={showPassword2 ? "text" : "password"}
                        value={signupPassword2}
                        name="confirm-password"
                        id="signup-confirm-password"
                        autoComplete="new-password"
                        onChange={(e) => setSignupPassword2(e.target.value)}
                        InputProps={{
                          startAdornment: <Lock size={15} className="text-emerald-600 mr-2 opacity-80" />,
                          endAdornment: (
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword2(!showPassword2)}
                              sx={{ color: 'rgba(255,255,255,0.4)', p: 0.5, mr: 0.5, '&:hover': { color: 'white' } }}
                            >
                              {showPassword2 ? <EyeOff size={15} /> : <Eye size={15} />}
                            </IconButton>
                          )
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px', 
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>

                    {signupPassword && (() => {
                      const strength = getPasswordStrength(signupPassword);
                      return (
                        <div className="col-span-1 sm:col-span-2 space-y-1 mt-0.5 animate-fade-in text-left">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span style={{ color: strength.color }}>{strength.label}</span>
                            <span className="text-gray-400">{strength.percent}% Secure</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-500 ease-out" 
                              style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                            ></div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery Address</label>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter premium home delivery address..."
                      multiline
                      rows={1.5}
                      value={signupAddress}
                      name="address"
                      id="signup-address"
                      autoComplete="street-address"
                      onChange={(e) => setSignupAddress(e.target.value)}
                      InputProps={{
                        startAdornment: <MapPin size={15} className="text-emerald-600 mr-2 mt-0.5 opacity-80 align-top" />
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: '12px', 
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                          '&:hover fieldset': { borderColor: '#E4C560' },
                          '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4 mt-4 pt-1.5 border-t border-emerald-800/20">
                    <Button 
                      onClick={() => setIsSignupOpen(false)} 
                      sx={{ 
                        px: 3,
                        py: 1,
                        borderRadius: '14px',
                        textTransform: 'none', 
                        color: 'gray.400', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.03)' } 
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      disabled={otpLoading}
                      onClick={handleSendOtp}
                      sx={{ 
                        background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
                        color: '#1D0130',
                        borderRadius: '14px', 
                        px: 4, 
                        py: 1, 
                        fontWeight: 'bold', 
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(228, 197, 96, 0.25)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)',
                        }
                      }}
                    >
                      {otpLoading ? 'Generating OTP...' : 'Send OTP Verification Code'}
                    </Button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-900/40 w-full text-center">
                    <Typography variant="body2" color="gray.400">
                      Already registered?{' '}
                      <Button
                        size="small"
                        onClick={() => {
                          setIsSignupOpen(false);
                          setIsLoginOpen(true);
                        }}
                        sx={{ color: '#E4C560', fontWeight: 'bold', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        Log In
                      </Button>
                    </Typography>
                  </div>
                </div>
              ) : (
                /* Step 2: Input OTP Verification Number */
                <div className="space-y-5 text-center">
                  {/* Real-time Status Notification Badge */}
                  <div className="bg-emerald-600/10 border border-[#E4C560]/30 rounded-xl p-4 text-left">
                    <div className="flex gap-2.5 items-start">
                      <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', fontStyle: 'serif' }}>
                          OTP Verification Code Sent!
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'gray.400' }}>
                          A real-time OTP has been dispatched to <strong className="text-gray-200">{signupEmail}</strong>. Please enter the 6-digit code below to finalize.
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Enter 6-Digit OTP</label>
                      <TextField
                        fullWidth
                        placeholder="e.g. 123456"
                        value={signupOtp}
                        onChange={(e) => setSignupOtp(e.target.value)}
                        InputProps={{
                          startAdornment: <ShieldCheck size={18} className="text-emerald-600 mr-2 opacity-80" />
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '16px', 
                            color: 'white',
                            fontSize: '18px',
                            letterSpacing: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                            '&:hover fieldset': { borderColor: '#E4C560' },
                            '&.Mui-focused fieldset': { borderColor: '#E4C560' }
                          }
                        }}
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <Button 
                        fullWidth
                        variant="outlined"
                        onClick={() => setOtpSent(false)} 
                        sx={{ 
                          borderRadius: '14px', 
                          py: 1.25,
                          borderColor: 'rgba(255,255,255,0.15)',
                          color: 'gray.300',
                          textTransform: 'none',
                          '&:hover': { borderColor: 'white', color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        Back to Edit Details
                      </Button>
                      
                      <Button 
                        fullWidth
                        variant="contained" 
                        onClick={handleSignup}
                        sx={{ 
                          background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
                          color: '#1D0130',
                          borderRadius: '14px', 
                          py: 1.25, 
                          fontWeight: 'bold', 
                          textTransform: 'none',
                          boxShadow: '0 4px 15px rgba(228, 197, 96, 0.25)',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)',
                          }
                        }}
                      >
                        Verify & Register
                      </Button>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </Dialog>

      <Dialog 
        open={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontStyle: 'serif', fontWeight: 'bold', color: '#4A0E4E', pb: 0 }}>
          Order Summary & Invoice
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <div className="my-4 p-4 bg-[#FAF7FB] border border-purple-900/40 rounded-2xl text-left">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'purple.950' }} gutterBottom>
                🚚 Dispatch Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{currentUser.username || currentUser.first_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser.address}
                {currentUser.pincode && ` - Pincode: ${currentUser.pincode}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">Phone: {currentUser.phone}</Typography>
            </div>
          )}


          <div className="space-y-3 my-4 max-h-48 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-[#FAF6FB]/50 p-2.5 rounded-xl border border-[#2A0033] text-left gap-3">
                <img
                  src={item.product_details.image_url}
                  alt={item.product_details.name}
                  onError={handleImageError}
                  className="w-12 h-12 object-cover rounded-lg border border-[#4A0E4E]/10 bg-white flex-shrink-0"
                />
                <div className="flex-1">
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2A0033' }}>{item.product_details.name}</Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-medium">₹{item.product_details.price} / {item.product_details.unit}</span>
                    <div className="flex items-center gap-1.5 bg-[#4A0E4E]/10 border border-[#4A0E4E]/20 text-[#4A0E4E] rounded-full px-1 py-0.25">
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        sx={{ color: '#4A0E4E', p: 0.25, '&:hover': { backgroundColor: 'rgba(74, 14, 78, 0.1)' } }}
                      >
                        <Minus size={11} />
                      </IconButton>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{ color: '#4A0E4E', p: 0.25, '&:hover': { backgroundColor: 'rgba(74, 14, 78, 0.1)' } }}
                      >
                        <Plus size={11} />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4A0E4E' }}>
                    ₹{parseFloat(item.total_price.toString()).toFixed(2)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeFromCart(item.id)}
                    color="error"
                    sx={{ p: 0.5, border: '1px solid #FFEDEE', '&:hover': { backgroundColor: '#FFF5F5' } }}
                    title="Remove item"
                  >
                    <X size={12} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-purple-900/40 pt-3 space-y-2 text-left">
            <div className="flex justify-between">
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{totalPrice.toFixed(2)}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2" color="text.secondary">Premium Delivery Sourcing</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: deliveryCharge === 0 ? 'green.600' : 'gray.700' }}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </Typography>
            </div>
            <div className="flex justify-between border-t border-purple-900/40 pt-3">
              <Typography variant="h6" sx={{ fontStyle: 'serif', fontWeight: 'bold', color: 'purple.950' }}>Total Amount</Typography>
              <Typography variant="h6" sx={{ color: '#4A0E4E', fontWeight: '900' }}>
                ₹{(totalPrice + deliveryCharge).toFixed(2)}
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setIsCheckoutOpen(false)} sx={{ textTransform: 'none', color: 'gray.500' }}>Modify Bag</Button>
          <Button 
            variant="contained" 
            onClick={handlePlaceOrder} 
            startIcon={<Truck />}
            sx={{ backgroundColor: '#4A0E4E', borderRadius: '12px', px: 4, py: 1, fontWeight: 'bold', textTransform: 'none' }}
          >
            Confirm Dispatch
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={isOrderPlaced} 
        onClose={() => setIsOrderPlaced(false)}
        PaperProps={{
          sx: { borderRadius: '24px', p: 2 }
        }}
      >
        <DialogContent className="text-center py-8">
          <CheckCircle size={64} className="mx-auto text-green-600 mb-4 animate-pulse" />
          <Typography variant="h4" sx={{ fontStyle: 'serif', fontWeight: 'bold', color: '#4A0E4E' }} gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" className="mb-4">
            Your premium grocery package will arrive at your location within **2-3 hours**.
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'purple.950' }}>
            Paid Total: ₹{placedOrderTotal.toFixed(2)}
          </Typography>
          <Button 
            autoFocus 
            onClick={() => setIsOrderPlaced(false)} 
            variant="contained" 
            sx={{ backgroundColor: '#1D0130', borderRadius: '12px', mt: 3, fontWeight: 'bold', '&:hover': { backgroundColor: '#4A0E4E' } }}
          >
            Got it!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Premium Product Detail Dialog */}
      <Dialog
        open={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 0,
            backgroundColor: '#1D0130',
            color: 'white',
            border: '1px solid rgba(228, 197, 96, 0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }
        }}
      >
        {viewingProduct && (() => {
          const cartItem = cart.find(item => item.product_details.id === viewingProduct.id);
          const rating = 4.8; // beautiful standard rating

          return (
            <div className="flex flex-col md:flex-row min-h-[460px] relative">
              {/* Close Button */}
              <IconButton 
                autoFocus
                onClick={() => setViewingProduct(null)}
                sx={{ 
                  position: 'absolute', 
                  right: 16, 
                  top: 16, 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  '&:hover': { backgroundColor: 'rgba(228, 197, 96, 0.2)' },
                  zIndex: 10
                }}
              >
                <X size={20} />
              </IconButton>

              {/* Left Column: Complete Details Panel */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between relative text-left bg-[#1D0130]/95 backdrop-blur-md">
                {/* Background Ambient Glows */}
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#1D0130]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-4">
                  {/* Category Name Badge */}
                  <div>
                    <span className="bg-emerald-600/10 border border-[#E4C560]/30 text-emerald-600 text-[10px] font-extrabold py-1 px-3.5 rounded-full uppercase tracking-wider">
                      {getCategoryDisplayName(viewingProduct.category_name)}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-2xl font-bold font-serif text-gray-200 leading-tight">
                    {viewingProduct.name}
                  </h3>

                  {/* Rating & Star Reviews */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className="fill-current text-emerald-600" 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-purple-300 font-bold">({rating} Customer Rating)</span>
                  </div>

                  {/* Price & Unit Details */}
                  <div className="flex items-baseline gap-3 pt-1 border-t border-purple-900/40">
                    <span className="text-3xl font-extrabold text-emerald-600">₹{viewingProduct.price}</span>
                    <span className="text-sm text-gray-400 font-medium">/ {viewingProduct.unit}</span>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-purple-300 uppercase tracking-widest">Description</span>
                    <p className="text-gray-400 text-xs leading-relaxed max-h-36 overflow-y-auto pr-1">
                      {viewingProduct.description || (
                        `This premium quality, handpicked organic fresh item is sourced directly from our local partner farms. Cultivated under strict quality standards and processed with premium hygienic food-grade packaging to keep all nutrition and taste intact. Free from harmful chemicals and preservatives, ensuring absolute goodness for your family's health.`
                      )}
                    </p>
                  </div>

                  {/* Quick Sourcing Bullet points */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-light pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>100% Organically Grown</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Strict Quality Tested</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Hygienically Packed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Zero Preservatives</span>
                    </div>
                  </div>
                </div>

                {/* Footer / Interactive Cart Action Button Grid */}
                <div className="mt-8 pt-4 border-t border-purple-900/40 flex items-center justify-between gap-4">
                  {cartItem ? (
                    <div className="flex items-center gap-4 bg-[#1D0130]/5 rounded-2xl px-4 py-2 border border-purple-900/40 w-full justify-between">
                      <span className="text-xs text-gray-400 font-medium">Quantity in Bag:</span>
                      <div className="flex items-center gap-3">
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          sx={{ color: '#E4C560', backgroundColor: 'rgba(255,255,255,0.05)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                        >
                          <Minus size={14} />
                        </IconButton>
                        <span className="text-sm font-extrabold text-gray-200 w-6 text-center">{cartItem.quantity}</span>
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          sx={{ color: '#E4C560', backgroundColor: 'rgba(255,255,255,0.05)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                        >
                          <Plus size={14} />
                        </IconButton>
                      </div>
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        addToCart(viewingProduct);
                      }}
                      startIcon={<Plus size={18} />}
                      sx={{
                        background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
                        color: '#1D0130',
                        borderRadius: '14px', 
                        py: 1.5, 
                        fontWeight: 'bold', 
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(228, 197, 96, 0.25)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)',
                        }
                      }}
                    >
                      Add Premium Sourced Item
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column: Premium Product Image showcase */}
              <div className="w-full md:w-1/2 bg-[#FAF8FB] p-0 flex items-center justify-center relative min-h-[300px] overflow-hidden">
                <span className="absolute top-4 left-4 bg-[#4A0E4E] text-gray-200 text-[9px] font-extrabold py-1 px-3 rounded-full uppercase tracking-wider shadow-sm z-10">
                  Premium Quality
                </span>
                
                {(() => {
                  const isTomato = viewingProduct.name.toLowerCase() === 'tomato';
                  const dbSlideImages = [
                    viewingProduct.image_url,
                    viewingProduct.image_url_2,
                    viewingProduct.image_url_3,
                    viewingProduct.image_url_4
                  ].filter(Boolean) as string[];

                  const hasMultipleDbImages = dbSlideImages.length > 1;
                  const slideImages = isTomato 
                    ? tomatoImages 
                    : (hasMultipleDbImages ? dbSlideImages : [viewingProduct.image_url, viewingProduct.image_url, viewingProduct.image_url]);
                  
                  const imgClass = "w-full h-full object-cover transition-all duration-500 hover:scale-105";
                  
                  return (
                    <>
                      <img 
                        src={slideImages[productSlideIndex]} 
                        alt={viewingProduct.name}
                        onError={handleImageError}
                        className={imgClass}
                      />

                      {/* Left Arrow Button */}
                      <button
                        onClick={() => setProductSlideIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#1D0130]/95 backdrop-blur-md/75 hover:bg-emerald-600 text-gray-200 hover:text-white p-2 rounded-full transition-all duration-300 border border-purple-900/40 shadow-md z-20"
                      >
                        <ArrowLeft size={16} />
                      </button>

                      {/* Right Arrow Button */}
                      <button
                        onClick={() => setProductSlideIndex((prev) => (prev + 1) % slideImages.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1D0130]/95 backdrop-blur-md/75 hover:bg-emerald-600 text-gray-200 hover:text-white p-2 rounded-full transition-all duration-300 border border-purple-900/40 shadow-md z-20"
                      >
                        <ArrowRight size={16} />
                      </button>

                      {/* View Indicator Badge */}
                      {!isTomato && !hasMultipleDbImages && (
                        <span className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[9px] py-1 px-3 rounded-full font-bold tracking-wider uppercase z-20">
                          {productSlideIndex === 0 ? "Standard Shape" : productSlideIndex === 1 ? "Magnifier Circle" : "Widescreen Crop"}
                        </span>
                      )}

                      {!isTomato && hasMultipleDbImages && (
                        <span className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[9px] py-1 px-3 rounded-full font-bold tracking-wider uppercase z-20">
                          Image {productSlideIndex + 1} of {slideImages.length}
                        </span>
                      )}

                      {/* Slide indicator dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {slideImages.map((_, dotIdx) => (
                          <div
                            key={dotIdx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              dotIdx === productSlideIndex ? 'w-4 bg-emerald-600' : 'w-2 bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          );
        })()}
      </Dialog>

      {/* Visual Order Sourcing & Tracking Timeline Stepper Dialog */}
      <Dialog 
        open={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '24px', 
            overflow: 'hidden',
            backgroundColor: '#1D0130',
            color: 'white',
            border: '1px solid rgba(228, 197, 96, 0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }
        }}
      >
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-5 text-white flex justify-between items-center border-b border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <Truck size={24} className="text-[#E4C560]" />
            <h2 className="font-serif text-2xl font-bold">My Order Sourcing & Tracking</h2>
          </div>
          <IconButton onClick={() => setIsOrdersOpen(false)} sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}>
            <X size={24} />
          </IconButton>
        </div>

        <DialogContent sx={{ p: 4, maxHeight: '70vh', overflowY: 'auto' }}>
          {trackingLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <CircularProgress sx={{ color: '#E4C560' }} />
              <Typography variant="body2" color="gray.400">Fetching your order history...</Typography>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-white/5 text-white rounded-full flex items-center justify-center mx-auto shadow-inner border border-white/10">
                <Truck size={28} className="text-gray-400" />
              </div>
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>No orders found</Typography>
                <Typography variant="caption" color="text.secondary">You haven't placed any premium organic orders yet.</Typography>
              </div>
              <Button 
                onClick={() => setIsOrdersOpen(false)}
                variant="contained" 
                sx={{ 
                  background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
                  color: '#1D0130', 
                  px: 4, 
                  borderRadius: '9999px',
                  mt: 2,
                  fontWeight: 'bold'
                }}
              >
                Start Sourcing Goods
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => {
                // Determine step index based on status
                const steps = ['confirmed', 'processing', 'out_for_delivery', 'delivered'];
                const stepLabels = ['Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];
                const currentStepIdx = steps.indexOf(order.status);
                const isCancelled = order.status === 'cancelled';
                const placedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md space-y-6 relative overflow-hidden">
                    {/* Top Glow */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

                    {/* Order Meta Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] text-[#E4C560] font-extrabold uppercase tracking-widest block mb-1">
                          CONCIERGE DELIVERY
                        </span>
                        <h4 className="text-lg font-bold font-serif text-white">
                          Order ID: #{order.id}
                        </h4>
                        <span className="text-[11px] text-gray-400">{placedDate}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-gray-400 block">Total Sourced Value</span>
                        <span className="text-xl font-extrabold text-[#E4C560]">₹{order.total_amount}</span>
                        <span className="text-[10px] text-gray-400 block">(includes ₹{order.delivery_charge} delivery)</span>
                      </div>
                    </div>

                    {/* Timeline Stepper */}
                    {!isCancelled ? (
                      <div className="py-4 px-2">
                        {/* Desktop & Mobile Stepper Progress Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 relative">
                          {/* Connection Lines (Desktop only) */}
                          <div className="absolute top-[18px] left-[40px] right-[40px] h-[5px] bg-white/5 -z-10 hidden md:block rounded-full border border-white/5 shadow-inner"></div>
                          <div 
                            className="absolute top-[18px] left-[40px] h-[5px] bg-gradient-to-r from-emerald-500 via-[#E4C560] to-teal-400 -z-10 hidden md:block rounded-full transition-all duration-[1200ms] ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                            style={{ 
                              width: `${currentStepIdx <= 0 ? 0 : (currentStepIdx / 3) * 100 - 8}%` 
                            }}
                          ></div>

                          {/* Mobile Connection Line (Vertical, only on mobile) */}
                          <div className="absolute left-[19px] top-6 bottom-6 w-[5px] bg-white/5 -z-10 md:hidden rounded-full border border-white/5 shadow-inner"></div>
                          <div 
                            className="absolute left-[19px] top-6 w-[5px] bg-gradient-to-b from-emerald-500 via-[#E4C560] to-teal-400 -z-10 md:hidden rounded-full transition-all duration-[1200ms] ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                            style={{ 
                              height: `${currentStepIdx <= 0 ? 0 : (currentStepIdx / 3) * 100 - 10}%`,
                              maxHeight: 'calc(100% - 48px)'
                            }}
                          ></div>

                          {/* Stepper Steps */}
                          {stepLabels.map((label, idx) => {
                            const isCompleted = idx < currentStepIdx;
                            const isActive = idx === currentStepIdx;
                            const isMuted = idx > currentStepIdx;
                            
                            const stepIcons = [
                              <CheckCircle size={16} className="flex-shrink-0" />,
                              <RefreshCw size={16} className={`flex-shrink-0 ${isActive ? "animate-spin" : ""}`} />,
                              <Truck size={16} className={`flex-shrink-0 ${isActive ? "animate-bounce" : ""}`} />,
                              <ShieldCheck size={16} className="flex-shrink-0" />
                            ];

                            return (
                              <div key={label} className="flex flex-row md:flex-col items-center gap-5 md:gap-3 w-full md:w-32 relative z-10 text-left md:text-center">
                                {/* Step Circle */}
                                <div 
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-500 ${
                                    isCompleted 
                                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                                      : isActive 
                                      ? 'bg-gradient-to-br from-[#E4C560] to-amber-500 border-[#E4C560] text-[#1D0130] font-extrabold scale-110 shadow-[0_0_25px_rgba(228,197,96,0.7)]'
                                      : 'bg-white/5 border-white/20 text-gray-400'
                                  }`}
                                >
                                  {stepIcons[idx]}
                                </div>

                                {/* Step details */}
                                <div className="text-left md:text-center">
                                  <span 
                                    className={`text-xs font-bold block tracking-wide ${
                                      isCompleted 
                                        ? 'text-emerald-400' 
                                        : isActive 
                                        ? 'text-[#E4C560] uppercase tracking-wider font-black text-[12px] animate-pulse' 
                                        : 'text-gray-500'
                                    }`}
                                  >
                                    {label}
                                  </span>
                                  {isActive && (
                                    <span className="text-[9px] text-gray-300 block font-semibold uppercase tracking-widest mt-0.5 animate-pulse">
                                      IN PROGRESS
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl p-3.5 flex gap-2.5 items-center text-left animate-fade-in">
                        <ShieldAlert size={20} className="text-red-400 flex-shrink-0" />
                        <div>
                          <h5 className="font-bold text-red-300">This Sourced Order Was Cancelled</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5">Please contact customer support for refund details or create a new cart checkout.</p>
                        </div>
                      </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      {/* Left: Sourced Items */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Items Purchased</span>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center bg-white/3 border border-white/5 rounded-xl p-2.5 text-xs">
                              <div>
                                <span className="font-bold text-white block">{item.product_name}</span>
                                <span className="text-[10px] text-gray-400 font-light">Quantity: {item.quantity} x ₹{item.price}</span>
                              </div>
                              <span className="font-bold text-gray-200">₹{item.total_price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Sourcing Target & Address */}
                      <div className="space-y-2.5 text-left border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-5">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Phone</span>
                          <span className="text-xs text-gray-200 font-medium block">{order.phone}</span>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Destination</span>
                            {!isCancelled && order.status !== 'delivered' && editingAddressOrderId !== order.id && (
                              <button 
                                onClick={() => {
                                  setEditingAddressOrderId(order.id);
                                  setNewAddressText(order.delivery_address);
                                }}
                                className="text-[10px] text-[#E4C560] hover:underline"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                          
                          {editingAddressOrderId === order.id ? (
                            <div className="space-y-2 mt-2">
                              <textarea 
                                value={newAddressText}
                                onChange={(e) => setNewAddressText(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded text-xs p-2 text-white resize-none"
                                rows={3}
                              />
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => setEditingAddressOrderId(null)}
                                  className="text-[10px] text-gray-400 hover:text-white px-2 py-1"
                                  disabled={actionLoading === order.id}
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleUpdateAddress(order.id)}
                                  className="text-[10px] bg-[#E4C560] text-[#1D0130] font-bold px-3 py-1 rounded hover:bg-[#F5D777]"
                                  disabled={actionLoading === order.id}
                                >
                                  {actionLoading === order.id ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 items-start">
                              <MapPin size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-200 leading-relaxed font-light">{order.delivery_address}</p>
                            </div>
                          )}
                        </div>
                        
                        {!isCancelled && order.status !== 'delivered' && (
                          <div className="pt-3 mt-3 border-t border-white/5">
                            <button
                              onClick={() => {
                                if(window.confirm('Are you sure you want to cancel this order?')) {
                                  handleCancelOrder(order.id);
                                }
                              }}
                              disabled={actionLoading === order.id}
                              className="text-xs text-red-400 hover:text-red-300 font-medium border border-red-500/30 rounded-lg px-3 py-1.5 w-full transition-colors hover:bg-red-500/10"
                            >
                              {actionLoading === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button 
            onClick={() => setIsOrdersOpen(false)}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)', 
              color: '#1D0130',
              fontWeight: 'bold',
              py: 1,
              px: 4,
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)',
              }
            }}
          >
            Close Tracking Panel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
