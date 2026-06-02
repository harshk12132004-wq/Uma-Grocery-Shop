import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  ImageIcon,
  FolderTree,
  Tag,
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  MenuItem,
  Snackbar,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  adminAPI,
  productsAPI,
  categoriesAPI,
  offersAPI,
  ordersAPI,
  Product,
  User as UserType,
  Category,
  Offer,
  Order,
} from '../services/api';

const getCategoryLabel = (name: string): string => {
  const mapping: Record<string, string> = {
    'Dairy': 'Dairy Products',
    'Chocolates': 'Snacks & Biscuits',
    'Masala Powder': 'Oil & Spices',
    'Shamppo': 'Shampoo',
  };
  return mapping[name] || name;
};

interface AdminPanelProps {
  products: Product[];
  categories: string[];
  currentUser: UserType | null;
  onProductsChanged: () => void;
  onNavigateHome: () => 
    void;
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'products' | 'categories' | 'feedback' | 'users' | 'offers' | 'orders';

export default function AdminPanel({ products, categories, currentUser, onProductsChanged, onNavigateHome, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Products state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Category state
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formCategoryDescription, setFormCategoryDescription] = useState('');
  const [formCategoryImage, setFormCategoryImage] = useState('');
  const [formDedicatedImage, setFormDedicatedImage] = useState('');

  // Product form
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<number>(1);
  const [formSubCategory, setFormSubCategory] = useState('');
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImageUrl2, setFormImageUrl2] = useState('');
  const [formImageUrl3, setFormImageUrl3] = useState('');
  const [formImageUrl4, setFormImageUrl4] = useState('');
  const [formUnit, setFormUnit] = useState('1.0 kg');
  const [formDescription, setFormDescription] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  
  // Delete confirm states
  const [deleteCategoryConfirmId, setDeleteCategoryConfirmId] = useState<number | null>(null);

  const [formSaving, setFormSaving] = useState(false);

  // Feedback state
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState('');

  // Users state
  const [users, setUsers] = useState<UserType[]>([]);
  const [userSearch, setUserSearch] = useState('');

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerSearch, setOfferSearch] = useState('');
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteOfferConfirmId, setDeleteOfferConfirmId] = useState<number | null>(null);

  // Offer form state
  const [formOfferTitle, setFormOfferTitle] = useState('');
  const [formOfferDescription, setFormOfferDescription] = useState('');
  const [formOfferDiscount, setFormOfferDiscount] = useState('');
  const [formOfferProduct, setFormOfferProduct] = useState<number | ''>('');
  const [formOfferImageUrl, setFormOfferImageUrl] = useState('');
  const [formOfferIsActive, setFormOfferIsActive] = useState(true);
  const [formOfferSendEmail, setFormOfferSendEmail] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  // Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, fbks, usrs, ofrs, ords] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        adminAPI.getFeedback(),
        adminAPI.getUsers(),
        offersAPI.getAll(false), // fetch both active and inactive offers for management
        ordersAPI.getAll(),
      ]);
      setAllProducts(prods);
      setCategoryList(cats);
      setFeedbacks(fbks);
      setUsers(usrs);
      setOffers(ofrs);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setSnackbar({ open: true, message: 'Failed to load admin data', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      setSnackbar({ open: true, message: `Order #${orderId} status updated to ${status.toUpperCase()} successfully!`, severity: 'success' });
      fetchAllData();
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to update order status';
      setSnackbar({ open: true, message: errMsg, severity: 'error' });
      
      // If unauthorized or forbidden, prompt them to re-authenticate as admin after 2 seconds
      if (err.response?.status === 403 || err.response?.status === 401) {
        setTimeout(() => {
          onLogout();
        }, 2000);
      }
    }
  };

  // Fetch sub-categories when selected category changes
  const fetchSubCategories = async (catId: number) => {
    try {
      const subs = await productsAPI.getSubCategories(catId);
      setAvailableSubCategories(subs);
    } catch {
      setAvailableSubCategories([]);
    }
  };

  // Product form helpers
  const resetProductForm = () => {
    setFormName('');
    setFormPrice('');
    setFormCategory(categoryList.length > 0 ? categoryList[0].id : 1);
    setFormSubCategory('');
    setAvailableSubCategories([]);
    setFormImageUrl('');
    setFormImageUrl2('');
    setFormImageUrl3('');
    setFormImageUrl4('');
    setFormUnit('1.0 kg');
    setFormDescription('');
    setFormInStock(true);
    setEditingProduct(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setIsProductDialogOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormCategory(product.category);
    setFormSubCategory(product.sub_category || '');
    fetchSubCategories(product.category);
    setFormImageUrl(product.image_url);
    setFormImageUrl2(product.image_url_2 || '');
    setFormImageUrl3(product.image_url_3 || '');
    setFormImageUrl4(product.image_url_4 || '');
    setFormUnit(product.unit);
    setFormDescription(product.description || '');
    setFormInStock(product.in_stock);
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formName || !formPrice || !formImageUrl) {
      setSnackbar({ open: true, message: 'Please fill all required fields (Name, Price, Image URL)', severity: 'error' });
      return;
    }
    setFormSaving(true);
    try {
      const data = {
        name: formName,
        price: parseFloat(formPrice),
        category: formCategory,
        sub_category: formSubCategory || null,
        image_url: formImageUrl,
        image_url_2: formImageUrl2 || null,
        image_url_3: formImageUrl3 || null,
        image_url_4: formImageUrl4 || null,
        unit: formUnit,
        description: formDescription,
        in_stock: formInStock,
      };
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        setSnackbar({ open: true, message: `Product "${formName}" updated successfully!`, severity: 'success' });
      } else {
        await productsAPI.create(data);
        setSnackbar({ open: true, message: `Product "${formName}" added successfully!`, severity: 'success' });
      }
      setIsProductDialogOpen(false);
      resetProductForm();
      const prods = await productsAPI.getAll();
      setAllProducts(prods);
      onProductsChanged();
    } catch (err: any) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Failed to save product';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
    setFormSaving(false);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productsAPI.delete(id);
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
      setDeleteConfirmId(null);
      const prods = await productsAPI.getAll();
      setAllProducts(prods);
      onProductsChanged();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    try {
      await adminAPI.deleteFeedback(id);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      setSnackbar({ open: true, message: 'Feedback deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete feedback', severity: 'error' });
    }
  };

  // Category handlers
  const resetCategoryForm = () => {
    setFormCategoryName('');
    setFormCategoryDescription('');
    setFormCategoryImage('');
    setFormDedicatedImage('');
    setEditingCategory(null);
  };

  const openAddCategory = () => {
    resetCategoryForm();
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormCategoryName(category.name);
    setFormCategoryDescription(category.description || '');
    setFormCategoryImage(category.image_url || '');
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!formCategoryName) {
      setSnackbar({ open: true, message: 'Name is required', severity: 'error' });
      return;
    }
    setFormSaving(true);
    try {
      const data = { name: formCategoryName, description: formCategoryDescription, image_url: formCategoryImage, dedicated_image_url: formDedicatedImage };
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, data);
        setSnackbar({ open: true, message: `Category updated!`, severity: 'success' });
      } else {
        await categoriesAPI.create(data);
        setSnackbar({ open: true, message: `Category added!`, severity: 'success' });
      }
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      const cats = await categoriesAPI.getAll();
      setCategoryList(cats);
    } catch (err: any) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Failed to save category';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
    setFormSaving(false);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoriesAPI.delete(id);
      setSnackbar({ open: true, message: 'Category deleted!', severity: 'success' });
      setDeleteCategoryConfirmId(null);
      const cats = await categoriesAPI.getAll();
      setCategoryList(cats);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete category (it may contain products)', severity: 'error' });
    }
  };

  // Offer handlers
  const resetOfferForm = () => {
    setFormOfferTitle('');
    setFormOfferDescription('');
    setFormOfferDiscount('');
    setFormOfferProduct('');
    setFormOfferImageUrl('');
    setFormOfferIsActive(true);
    setFormOfferSendEmail(false);
    setEditingOffer(null);
  };

  const openAddOffer = () => {
    resetOfferForm();
    setIsOfferDialogOpen(true);
  };

  const openEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setFormOfferTitle(offer.title);
    setFormOfferDescription(offer.description);
    setFormOfferDiscount(offer.discount_percentage ? String(offer.discount_percentage) : '');
    setFormOfferProduct(offer.product || '');
    setFormOfferImageUrl(offer.image_url || '');
    setFormOfferIsActive(offer.is_active);
    setFormOfferSendEmail(false);
    setIsOfferDialogOpen(true);
  };

  const handleSaveOffer = async () => {
    if (!formOfferTitle || !formOfferDescription) {
      setSnackbar({ open: true, message: 'Title and Description are required', severity: 'error' });
      return;
    }
    setFormSaving(true);
    try {
      const data = {
        title: formOfferTitle,
        description: formOfferDescription,
        discount_percentage: formOfferDiscount ? parseInt(formOfferDiscount) : undefined,
        product: formOfferProduct || undefined,
        image_url: formOfferImageUrl || undefined,
        is_active: formOfferIsActive,
        send_email_notification: formOfferSendEmail,
      };
      if (editingOffer) {
        await offersAPI.update(editingOffer.id, data);
        setSnackbar({ open: true, message: `Offer "${formOfferTitle}" updated successfully!`, severity: 'success' });
      } else {
        await offersAPI.create(data);
        setSnackbar({ open: true, message: `Offer "${formOfferTitle}" added and broadcasted successfully!`, severity: 'success' });
      }
      setIsOfferDialogOpen(false);
      resetOfferForm();
      const ofrs = await offersAPI.getAll(false);
      setOffers(ofrs);
    } catch (err: any) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Failed to save offer';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
    setFormSaving(false);
  };

  const handleDeleteOffer = async (id: number) => {
    try {
      await offersAPI.delete(id);
      setSnackbar({ open: true, message: 'Offer deleted successfully!', severity: 'success' });
      setDeleteOfferConfirmId(null);
      const ofrs = await offersAPI.getAll(false);
      setOffers(ofrs);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete offer', severity: 'error' });
    }
  };

  // Filtered lists
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCategories = categoryList.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter(f =>
    f.name?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
    f.email?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
    f.subject?.toLowerCase().includes(feedbackSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOffers = offers.filter(o =>
    o.title.toLowerCase().includes(offerSearch.toLowerCase()) ||
    o.description.toLowerCase().includes(offerSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      String(order.id).includes(orderSearch) ||
      (order.user_name || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.phone || '').includes(orderSearch) ||
      (order.delivery_address || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.items.some(item => item.product_name.toLowerCase().includes(orderSearch.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = [
    { label: 'Total Products', value: allProducts.length, icon: <Package size={28} />, gradient: 'from-purple-700 to-purple-900', lightBg: 'bg-purple-50' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={28} />, gradient: 'from-fuchsia-600 to-fuchsia-800', lightBg: 'bg-fuchsia-50' },
    { label: 'Registered Users', value: users.length, icon: <Users size={28} />, gradient: 'from-amber-500 to-amber-700', lightBg: 'bg-amber-50' },
    { label: 'Offers Active', value: offers.filter(o => o.is_active).length, icon: <Tag size={28} />, gradient: 'from-blue-600 to-blue-800', lightBg: 'bg-blue-50' },
  ];

  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { key: 'products', label: 'Products', icon: <Package size={20} /> },
    { key: 'categories', label: 'Categories', icon: <FolderTree size={20} /> },
    { key: 'offers', label: 'Offers', icon: <Tag size={20} /> },
    { key: 'users', label: 'Users', icon: <Users size={20} /> },
    { key: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <CircularProgress sx={{ color: '#E4C560' }} size={48} />
          <Typography variant="h6" sx={{ color: '#1D0130', fontFamily: 'serif' }}>Loading Admin Panel...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-[#1D0130] to-indigo-950 text-white py-8 px-6 sm:px-10 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={12} /> Admin Control Center
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif mt-1">
              Uma Grocery <span className="text-[#E4C560]">Dashboard</span>
            </h1>
            <p className="text-xs text-white/50 mt-1">Welcome back, {currentUser?.first_name || currentUser?.username || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-3">
            
            <Button
              onClick={fetchAllData}
              variant="outlined"
              sx={{
                color: '#E4C560',
                borderColor: 'rgba(228, 197, 96, 0.4)',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '12px',
                px: 3,
                '&:hover': { borderColor: '#E4C560', backgroundColor: 'rgba(228, 197, 96, 0.08)' }
              }}
            >
              ↻ Refresh
            </Button>
            <Button
              onClick={onLogout}
              variant="contained"
              sx={{
                background: 'rgba(220, 38, 38, 0.1)',
                color: '#FCA5A5',
                borderColor: 'rgba(220, 38, 38, 0.4)',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '12px',
                px: 3,
                boxShadow: 'none',
                '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#FECACA', boxShadow: 'none' }
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-purple-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#1D0130] to-purple-800 text-[#E4C560] shadow-lg shadow-purple-200'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`${stat.lightBg} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-4xl font-extrabold text-[#1D0130] mt-1 font-serif">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <h3 className="text-lg font-bold text-[#1D0130] font-serif mb-4 flex items-center gap-2">
                  <Package size={20} className="text-purple-700" /> Latest Products
                </h3>
                <div className="space-y-3">
                  {allProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1D0130] truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{getCategoryLabel(product.category_name)} • {product.unit}</p>
                      </div>
                      <span className="text-sm font-bold text-purple-700">₹{product.price}</span>
                    </div>
                  ))}
                  {allProducts.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
                  )}
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <h3 className="text-lg font-bold text-[#1D0130] font-serif mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-emerald-600" /> Recent Feedback
                </h3>
                <div className="space-y-3">
                  {feedbacks.slice(0, 5).map(fb => (
                    <div key={fb.id} className="p-3 rounded-xl hover:bg-emerald-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[#1D0130]">{fb.name}</p>
                        <span className="text-[10px] text-gray-400">{new Date(fb.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-purple-700 font-semibold mt-0.5">{fb.subject}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{fb.message}</p>
                    </div>
                  ))}
                  {feedbacks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No feedback yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with search and add */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" size={18} /> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E4C560' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1D0130' },
                    }
                  }}
                />
              </div>
              <Button
                onClick={openAddProduct}
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{
                  background: 'linear-gradient(90deg, #1D0130 0%, #4A0E4E 100%)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                  boxShadow: '0 4px 15px rgba(29, 1, 48, 0.25)',
                  '&:hover': { background: 'linear-gradient(90deg, #2A0245 0%, #5C1263 100%)' }
                }}
              >
                Add Product
              </Button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-amber-50">
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Product</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Category</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Price</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Unit</th>
                      <th className="text-center px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Stock</th>
                      <th className="text-center px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, idx) => (
                      <tr key={product.id} className={`border-t border-purple-50 hover:bg-purple-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => setPreviewImage(product.image_url)}
                              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                            />
                            <div>
                              <p className="text-sm font-bold text-[#1D0130]">{product.name}</p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                {product.sub_category && (
                                  <span className="text-[9px] bg-purple-50 text-[#4A0E4E] border border-purple-200 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                    {product.sub_category}
                                  </span>
                                )}
                                <span className="text-[11px] text-gray-400 max-w-[200px] truncate" title={product.description || ''}>
                                  {product.description || 'No description'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Chip label={getCategoryLabel(product.category_name)} size="small" sx={{ backgroundColor: '#FAF6FB', color: '#4A0E4E', fontWeight: 'bold', fontSize: '11px' }} />
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-purple-700">₹{product.price}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{product.unit}</td>
                        <td className="px-5 py-4 text-center">
                          {product.in_stock ? (
                            <Chip label="In Stock" size="small" sx={{ backgroundColor: '#ECFDF5', color: '#059669', fontWeight: 'bold', fontSize: '11px' }} icon={<CheckCircle size={14} color="#059669" />} />
                          ) : (
                            <Chip label="Out of Stock" size="small" sx={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: 'bold', fontSize: '11px' }} icon={<AlertTriangle size={14} color="#DC2626" />} />
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => openEditProduct(product)} sx={{ color: '#4A0E4E', '&:hover': { backgroundColor: 'rgba(74, 14, 78, 0.08)' } }}>
                                <Pencil size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteConfirmId(product.id)} sx={{ color: '#DC2626', '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.08)' } }}>
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 font-semibold">No products found</p>
                  <p className="text-xs text-gray-300 mt-1">Try adjusting your search or add a new product</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== CATEGORIES TAB ===== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <Search className="mr-2 text-gray-400" size={18} />,
                  }}
                />
              </div>
              <Button
                variant="contained"
                onClick={openAddCategory}
                sx={{ backgroundColor: '#1D0130', '&:hover': { backgroundColor: '#2A0033' }, borderRadius: '9999px', textTransform: 'none', fontWeight: 'bold' }}
                startIcon={<Plus size={18} />}
              >
                Add Category
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full relative">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-amber-50">
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider w-20">Image</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Name</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Description</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Products</th>
                      <th className="text-right px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((cat, idx) => (
                      <tr key={cat.id} className={`border-t border-purple-50 hover:bg-purple-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-5 py-4">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={getCategoryLabel(cat.name)} className="w-10 h-10 rounded-lg object-cover border border-purple-100 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
                              <FolderTree size={16} className="text-purple-300" />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#1D0130]">{getCategoryLabel(cat.name)}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{cat.description || '—'}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{cat.product_count || 0}</td>
                        <td className="px-5 py-4 text-right space-x-2 relative">
                          <button onClick={() => openEditCategory(cat)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-full transition-colors" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteCategoryConfirmId(cat.id)} className="p-2 text-rose-600 hover:bg-rose-100 rounded-full transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                          
                          {/* Inline Delete Confirm */}
                          {deleteCategoryConfirmId === cat.id && (
                            <div className="absolute right-12 mt-[-30px] bg-white border border-red-200 shadow-xl rounded-lg p-3 z-10 animate-fade-in flex items-center gap-3">
                              <span className="text-xs font-bold text-red-600">Delete {getCategoryLabel(cat.name)}?</span>
                              <button onClick={() => handleDeleteCategory(cat.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Yes</button>
                              <button onClick={() => setDeleteCategoryConfirmId(null)} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300">No</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <FolderTree size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 font-semibold">No categories found</p>
                </div>
              )}
            </div>
          </div>
        )}

                {/* ===== USERS TAB ===== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <h2 className="text-2xl font-serif font-bold text-[#1D0130]">User Management</h2>
              <div className="w-full sm:w-72">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" size={18} /> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E4C560' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1D0130' },
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                      <th className="p-4">User</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4 hidden sm:table-cell">Address</th>
                      <th className="p-4 text-center">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-[#1D0130]">{user.first_name || user.username || 'N/A'}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-gray-800">{user.email || 'No email'}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                        </td>
                        <td className="p-4 hidden sm:table-cell max-w-xs">
                          <p className="text-xs text-gray-600 truncate">{user.address || 'No address provided'}</p>
                          {user.pincode && <p className="text-[10px] text-gray-400 mt-0.5">PIN: {user.pincode}</p>}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 font-semibold">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== FEEDBACK TAB ===== */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex-1 max-w-md">
              <TextField
                fullWidth
                size="small"
                placeholder="Search feedback..."
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" size={18} /> }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E4C560' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1D0130' },
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredFeedbacks.map(fb => (
                <div key={fb.id} className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-bold text-[#1D0130]">{fb.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fb.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{new Date(fb.created_at).toLocaleDateString()}</span>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFeedback(fb.id)}
                          sx={{ color: '#DC2626', opacity: 0.6, '&:hover': { opacity: 1, backgroundColor: 'rgba(220, 38, 38, 0.08)' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 mb-2">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Subject</p>
                    <p className="text-sm text-[#1D0130] font-semibold mt-0.5">{fb.subject}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{fb.message}</p>
                </div>
              ))}
            </div>
            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 font-semibold">No feedback found</p>
              </div>
            )}
          </div>
        )}

        {/* ===== OFFERS TAB ===== */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search offers..."
                  value={offerSearch}
                  onChange={(e) => setOfferSearch(e.target.value)}
                  InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" size={18} /> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E4C560' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1D0130' },
                    }
                  }}
                />
              </div>
              <Button
                variant="contained"
                onClick={openAddOffer}
                sx={{
                  background: 'linear-gradient(90deg, #1D0130 0%, #4A0E4E 100%)',
                  color: '#E4C560',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                  boxShadow: '0 4px 15px rgba(29, 1, 48, 0.25)',
                  '&:hover': { background: 'linear-gradient(90deg, #2A0245 0%, #5C1263 100%)' }
                }}
                startIcon={<Plus size={18} />}
              >
                Add Offer
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOffers.map(offer => (
                <div key={offer.id} className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-[#1D0130] font-serif leading-snug">{offer.title}</h4>
                        <span className="text-[10px] text-gray-400 mt-1 block">Created on: {new Date(offer.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Chip
                          label={offer.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            backgroundColor: offer.is_active ? '#ECFDF5' : '#FEF2F2',
                            color: offer.is_active ? '#059669' : '#DC2626',
                            fontWeight: 'bold',
                            fontSize: '11px',
                          }}
                        />
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => openEditOffer(offer)}
                            sx={{ color: '#4A0E4E', '&:hover': { backgroundColor: 'rgba(74, 14, 78, 0.08)' } }}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteOfferConfirmId(offer.id)}
                            sx={{ color: '#DC2626', '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.08)' } }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{offer.description}</p>

                    {offer.discount_percentage && (
                      <div className="inline-block bg-[#1D0130] text-[#E4C560] font-bold text-xs uppercase py-1 px-3 rounded-full mb-4">
                        {offer.discount_percentage}% OFF Discount
                      </div>
                    )}

                    {offer.product_details && (
                      <div className="bg-[#FAF6FB] border border-purple-100 p-3.5 rounded-xl flex items-center gap-3">
                        <img
                          src={offer.product_details.image_url}
                          alt={offer.product_details.name}
                          className="w-12 h-12 rounded-lg object-cover border border-purple-200"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        />
                        <div>
                          <p className="text-xs font-bold text-[#1D0130]">{offer.product_details.name}</p>
                          <p className="text-[10px] text-gray-500">{offer.product_details.unit} • ₹{offer.product_details.price}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {offer.image_url && (
                    <div className="mt-4 overflow-hidden rounded-xl h-32 w-full">
                      <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredOffers.length === 0 && (
              <div className="text-center py-16">
                <Tag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 font-semibold">No offers found</p>
                <p className="text-xs text-gray-300 mt-1">Add a new special discount offer to broadcast it to all users</p>
              </div>
            )}
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search orders by ID, user, phone, address, product..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" size={18} /> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E4C560' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1D0130' },
                    }
                  }}
                />
              </div>
              
              {/* Status Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'confirmed', label: 'Confirmed' },
                  { key: 'processing', label: 'Processing' },
                  { key: 'out_for_delivery', label: 'Out for Delivery' },
                  { key: 'delivered', label: 'Delivered' },
                  { key: 'cancelled', label: 'Cancelled' },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => setStatusFilter(chip.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      statusFilter === chip.key
                        ? 'bg-[#1D0130] text-[#E4C560] shadow-md shadow-purple-100 border border-[#1D0130]'
                        : 'bg-white text-purple-700 border border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-6">
              {filteredOrders.map((order) => {
                const placedDate = new Date(order.created_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                // Status theme mapping
                const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
                  pending: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: 'Pending' },
                  confirmed: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Confirmed' },
                  processing: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'Processing' },
                  out_for_delivery: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'Out for Delivery' },
                  delivered: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Delivered' },
                  cancelled: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Cancelled' },
                };
                
                const currentStyle = statusStyles[order.status] || { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', label: order.status };

                return (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-6 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Left: Info */}
                    <div className="flex-1 space-y-4 text-left">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-bold font-serif text-[#1D0130]">Order #{order.id}</h4>
                        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border ${currentStyle.bg} ${currentStyle.text}`}>
                          {currentStyle.label}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{placedDate}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/40 p-4 rounded-2xl border border-purple-100/50">
                        <div>
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Details</span>
                          <p className="text-sm font-bold text-[#1D0130] mt-1">{order.user_name || `User ID: ${order.user}`}</p>
                          <p className="text-xs text-gray-500 font-semibold">{order.phone}</p>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Address</span>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{order.delivery_address}</p>
                        </div>
                      </div>
                      
                      {/* Items Summaries */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Purchased Items</span>
                        <div className="space-y-2">
                          {order.items.map((item) => {
                            const rate = parseFloat(item.price.toString());
                            const totalVal = rate * item.quantity;
                            return (
                              <div key={item.id} className="flex justify-between items-center bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs">
                                <div>
                                  <span className="font-bold text-[#1D0130] block">{item.product_name}</span>
                                  <span className="text-[10px] text-gray-400">Quantity: {item.quantity} x ₹{rate.toFixed(2)}</span>
                                </div>
                                <span className="font-bold text-purple-950">₹{totalVal.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Sourcing Price & Update Status Actions */}
                    <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-purple-100 pt-6 lg:pt-0 lg:pl-8 text-left">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 block font-semibold">Total Sourced Value</span>
                        <h4 className="text-2xl font-black text-[#1D0130]">₹{parseFloat(order.total_amount.toString()).toFixed(2)}</h4>
                        <span className="text-[10px] text-gray-400 block font-medium">(includes ₹{parseFloat(order.delivery_charge.toString()).toFixed(2)} delivery charge)</span>
                      </div>
                      
                      {/* Update Status Controls */}
                      <div className="space-y-2 mt-6 lg:mt-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Delivery Status</label>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                            disabled={order.status === 'confirmed' || order.status === 'cancelled' || order.status === 'delivered'}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 ${
                              order.status === 'confirmed'
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50/50 disabled:opacity-40'
                            }`}
                          >
                            Confirm
                          </button>
                          
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            disabled={order.status === 'processing' || order.status === 'cancelled' || order.status === 'delivered'}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 ${
                              order.status === 'processing'
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50/50 disabled:opacity-40'
                            }`}
                          >
                            Process
                          </button>
                          
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                            disabled={order.status === 'out_for_delivery' || order.status === 'cancelled' || order.status === 'delivered'}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 ${
                              order.status === 'out_for_delivery'
                                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                                : 'bg-white border-orange-100 text-orange-600 hover:bg-orange-50/50 disabled:opacity-40'
                            }`}
                          >
                            Out for Deliv
                          </button>
                          
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 ${
                              order.status === 'delivered'
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                : 'bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50/50 disabled:opacity-40'
                            }`}
                          >
                            Deliver
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          disabled={order.status === 'cancelled' || order.status === 'delivered'}
                          className="w-full mt-2 bg-rose-50 border border-rose-100 text-rose-600 font-bold hover:bg-rose-100 text-xs py-2 rounded-xl transition-all duration-300 disabled:opacity-40"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-purple-100">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 font-semibold">No orders found</p>
                <p className="text-xs text-gray-300 mt-1">Orders placed by customers will appear here in real-time</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== ADD/EDIT CATEGORY DIALOG ===== */}
      <Dialog
        open={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', padding: '16px' }
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#1D0130] font-serif">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button onClick={() => setIsCategoryDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category Name *</label>
            <input
              type="text"
              value={formCategoryName}
              onChange={(e) => setFormCategoryName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E4C560] transition-shadow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
            <textarea
              value={formCategoryDescription}
              onChange={(e) => setFormCategoryDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E4C560] transition-shadow min-h-[100px]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category Image URL (Optional)</label>
            <input
              type="text"
              value={formCategoryImage}
              onChange={(e) => setFormCategoryImage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E4C560] transition-shadow"
              placeholder="https://..."
            />
          </div>
          
          {formCategoryImage && (
              <div className="flex items-center gap-4 p-4 mt-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formCategoryImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Image Preview</p>
              </div>
          )}

          <div className="mb-6 mt-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dedicated Category Page Background Image URL (Optional)</label>
            <input
              type="text"
              value={formDedicatedImage}
              onChange={(e) => setFormDedicatedImage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E4C560] transition-shadow"
              placeholder="https://... (Full-size horizontal background)"
            />
          </div>
          
          {formDedicatedImage && (
              <div className="flex items-center gap-4 p-4 mt-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <img src={formDedicatedImage} alt="Background Preview" className="w-40 h-16 rounded-lg object-cover border border-indigo-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Background Image Preview</p>
              </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button
              onClick={() => setIsCategoryDialogOpen(false)}
              sx={{ color: 'gray', textTransform: 'none', fontWeight: 'bold' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveCategory}
              disabled={formSaving}
              sx={{ backgroundColor: '#E4C560', color: '#1D0130', '&:hover': { backgroundColor: '#C9A637' }, borderRadius: '9999px', textTransform: 'none', fontWeight: 'bold', px: 4 }}
            >
              {formSaving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ===== ADD/EDIT PRODUCT DIALOG ===== */}
      <Dialog
        open={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(90deg, #1D0130 0%, #4A0E4E 100%)',
          color: '#E4C560',
          fontFamily: 'serif',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
          <IconButton onClick={() => setIsProductDialogOpen(false)} sx={{ color: 'white' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, pb: 2, px: 4, backgroundColor: '#FDFBFD' }}>
          <div className="space-y-5 mt-1">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="e.g., Organic Bananas"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block pl-8 p-3.5 transition-all shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unit</label>
                <input
                  type="text"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                  placeholder="e.g., per kg, per bunch"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category <span className="text-red-500">*</span></label>
              <select
                value={formCategory}
                onChange={(e) => {
                  const catId = Number(e.target.value);
                  setFormCategory(catId);
                  setFormSubCategory('');
                  fetchSubCategories(catId);
                }}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm appearance-none"
              >
                {categoryList.map(cat => (
                  <option key={cat.id} value={cat.id}>{getCategoryLabel(cat.name)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sub-Category</label>
              <div className="relative">
                <input
                  type="text"
                  list="sub-category-options"
                  value={formSubCategory}
                  onChange={(e) => setFormSubCategory(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                  placeholder="Select or type a sub-category..."
                />
                <datalist id="sub-category-options">
                  {availableSubCategories.map(sub => (
                    <option key={sub} value={sub} />
                  ))}
                </datalist>
              </div>
              {availableSubCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {availableSubCategories.map(sub => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setFormSubCategory(sub)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                        formSubCategory === sub
                          ? 'bg-[#1D0130] text-[#E4C560] border-[#1D0130] shadow-md'
                          : 'bg-purple-50 text-[#4A0E4E] border-purple-200 hover:bg-purple-100 hover:border-purple-300'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {formImageUrl && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formImageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Image Preview</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slide Image 2 URL (Optional)</label>
              <input
                type="text"
                value={formImageUrl2}
                onChange={(e) => setFormImageUrl2(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="https://example.com/slide2.jpg"
              />
            </div>
            
            {formImageUrl2 && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formImageUrl2} alt="Preview 2" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Slide 2 Preview</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slide Image 3 URL (Optional)</label>
              <input
                type="text"
                value={formImageUrl3}
                onChange={(e) => setFormImageUrl3(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="https://example.com/slide3.jpg"
              />
            </div>
            
            {formImageUrl3 && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formImageUrl3} alt="Preview 3" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Slide 3 Preview</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slide Image 4 URL (Optional)</label>
              <input
                type="text"
                value={formImageUrl4}
                onChange={(e) => setFormImageUrl4(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="https://example.com/slide4.jpg"
              />
            </div>
            
            {formImageUrl4 && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formImageUrl4} alt="Preview 4" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Slide 4 Preview</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm resize-none"
                placeholder="Write a brief description of the product..."
              />
            </div>

            <div className="pt-2">
              <FormControlLabel
                control={<Switch checked={formInStock} onChange={(e) => setFormInStock(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1D0130' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4A0E4E', opacity: 1 } }} />}
                label={<span className="text-sm font-bold text-[#1D0130] uppercase tracking-wide">In Stock Available</span>}
              />
            </div>

          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setIsProductDialogOpen(false)} sx={{ textTransform: 'none', color: '#666', borderRadius: '12px' }}>Cancel</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={formSaving}
            sx={{
              background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)',
              color: '#1D0130',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 4,
              boxShadow: '0 4px 12px rgba(228, 197, 96, 0.3)',
              '&:hover': { background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)' },
              '&:disabled': { opacity: 0.7 }
            }}
          >
            {formSaving ? <CircularProgress size={20} sx={{ color: '#1D0130' }} /> : (editingProduct ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== ADD/EDIT OFFER DIALOG ===== */}
      <Dialog
        open={isOfferDialogOpen}
        onClose={() => setIsOfferDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(90deg, #1D0130 0%, #4A0E4E 100%)',
          color: '#E4C560',
          fontFamily: 'serif',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {editingOffer ? 'Edit Special Offer' : 'Add New Special Offer'}
          <IconButton onClick={() => setIsOfferDialogOpen(false)} sx={{ color: 'white' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, pb: 2, px: 4, backgroundColor: '#FDFBFD' }}>
          <div className="space-y-5 mt-1">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Offer Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formOfferTitle}
                onChange={(e) => setFormOfferTitle(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="e.g., Weekend Farm Fresh Bonanza!"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Offer Description <span className="text-red-500">*</span></label>
              <textarea
                value={formOfferDescription}
                onChange={(e) => setFormOfferDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm resize-none"
                placeholder="Describe the offer and tell customers what savings they will receive..."
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={formOfferDiscount}
                  onChange={(e) => setFormOfferDiscount(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                  placeholder="e.g., 20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Applicable Product</label>
                <select
                  value={formOfferProduct}
                  onChange={(e) => setFormOfferProduct(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm appearance-none"
                >
                  <option value="">-- None (Store-wide Ad) --</option>
                  {allProducts.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name} (₹{prod.price})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Offer Banner Image URL (Optional)</label>
              <input
                type="text"
                value={formOfferImageUrl}
                onChange={(e) => setFormOfferImageUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm"
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            {formOfferImageUrl && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formOfferImageUrl} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Banner Preview</p>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              <FormControlLabel
                control={<Switch checked={formOfferIsActive} onChange={(e) => setFormOfferIsActive(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1D0130' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4A0E4E', opacity: 1 } }} />}
                label={<span className="text-sm font-bold text-[#1D0130] uppercase tracking-wide">Offer is Active</span>}
              />
              <FormControlLabel
                control={<Switch checked={formOfferSendEmail} onChange={(e) => setFormOfferSendEmail(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#059669' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10B981', opacity: 1 } }} />}
                label={<span className="text-sm font-bold text-[#1D0130] uppercase tracking-wide flex items-center gap-1">Broadcast Email Update to All Registered Users <Chip label="Real-time SMTP" size="small" color="success" sx={{ fontSize: '9px', height: '18px' }} /></span>}
              />
            </div>

          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setIsOfferDialogOpen(false)} sx={{ textTransform: 'none', color: '#666', borderRadius: '12px' }}>Cancel</Button>
          <Button
            onClick={handleSaveOffer}
            variant="contained"
            disabled={formSaving}
            sx={{
              background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)',
              color: '#1D0130',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 4,
              boxShadow: '0 4px 12px rgba(228, 197, 96, 0.3)',
              '&:hover': { background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)' },
              '&:disabled': { opacity: 0.7 }
            }}
          >
            {formSaving ? <CircularProgress size={20} sx={{ color: '#1D0130' }} /> : (editingOffer ? 'Update Offer' : 'Add & Broadcast Offer')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== DELETE OFFER CONFIRMATION ===== */}
      <Dialog
        open={deleteOfferConfirmId !== null}
        onClose={() => setDeleteOfferConfirmId(null)}
        PaperProps={{ sx: { borderRadius: '20px', px: 1, py: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#1D0130' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={24} />
            <Typography>Are you sure you want to delete this special offer? This action cannot be undone.</Typography>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteOfferConfirmId(null)} sx={{ textTransform: 'none', borderRadius: '12px' }}>Cancel</Button>
          <Button
            onClick={() => deleteOfferConfirmId && handleDeleteOffer(deleteOfferConfirmId)}
            variant="contained"
            sx={{
              backgroundColor: '#DC2626',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#B91C1C' }
            }}
          >
            Delete Offer
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== DELETE CONFIRMATION ===== */}
      <Dialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{ sx: { borderRadius: '20px', px: 1, py: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#1D0130' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={24} />
            <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ textTransform: 'none', borderRadius: '12px' }}>Cancel</Button>
          <Button
            onClick={() => deleteConfirmId && handleDeleteProduct(deleteConfirmId)}
            variant="contained"
            sx={{
              backgroundColor: '#DC2626',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#B91C1C' }
            }}
          >
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== IMAGE PREVIEW ===== */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', backgroundColor: 'transparent', boxShadow: 'none' } }}
      >
        <div className="relative">
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
          >
            <X size={18} />
          </IconButton>
          {previewImage && <img src={previewImage} alt="Product preview" className="max-w-full max-h-[80vh] rounded-2xl" />}
        </div>
      </Dialog>

      {/* ===== SNACKBAR ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: '12px', fontWeight: 'bold' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
