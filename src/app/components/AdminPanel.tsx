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
  Product,
  User as UserType,
  Category,
} from '../services/api';

interface AdminPanelProps {
  products: Product[];
  categories: string[];
  currentUser: UserType | null;
  onProductsChanged: () => void;
  onNavigateHome: () => 
    void;
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'products' | 'categories' | 'feedback' | 'users';

export default function AdminPanel({ products, categories, currentUser, onProductsChanged, onNavigateHome, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(false);

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
  const [formImageUrl, setFormImageUrl] = useState('');
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
      const [prods, cats, fbks, usrs] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        adminAPI.getFeedback(),
        adminAPI.getUsers(),
      ]);
      setAllProducts(prods);
      setCategoryList(cats);
      setFeedbacks(fbks);
      setUsers(usrs);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setSnackbar({ open: true, message: 'Failed to load admin data', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Product form helpers
  const resetProductForm = () => {
    setFormName('');
    setFormPrice('');
    setFormCategory(categoryList.length > 0 ? categoryList[0].id : 1);
    setFormImageUrl('');
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
    setFormImageUrl(product.image_url);
    setFormUnit(product.unit);
    setFormDescription(product.description || '');
    setFormInStock(product.in_stock);
    setIsProductDialogOpen(true);
  };

  // File upload helper converting selected file to Base64
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: 'Image size must be less than 2MB',
        severity: 'error'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageState(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
        image_url: formImageUrl,
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

  // Stats
  const stats = [
    { label: 'Total Products', value: allProducts.length, icon: <Package size={28} />, gradient: 'from-purple-700 to-purple-900', lightBg: 'bg-purple-50' },
    { label: 'Registered Users', value: users.length, icon: <Users size={28} />, gradient: 'from-amber-500 to-amber-700', lightBg: 'bg-amber-50' },
    { label: 'Feedback Received', value: feedbacks.length, icon: <MessageSquare size={28} />, gradient: 'from-emerald-500 to-emerald-700', lightBg: 'bg-emerald-50' },
    { label: 'Categories', value: categoryList.length, icon: <ShoppingBag size={28} />, gradient: 'from-rose-500 to-rose-700', lightBg: 'bg-rose-50' },
  ];

  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { key: 'products', label: 'Products', icon: <Package size={20} /> },
    { key: 'categories', label: 'Categories', icon: <FolderTree size={20} /> },
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
                        <p className="text-xs text-gray-500">{product.category_name} • {product.unit}</p>
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
                              <p className="text-[11px] text-gray-400 max-w-[200px] truncate">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Chip label={product.category_name} size="small" sx={{ backgroundColor: '#FAF6FB', color: '#4A0E4E', fontWeight: 'bold', fontSize: '11px' }} />
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
                            <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover border border-purple-100 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
                              <FolderTree size={16} className="text-purple-300" />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#1D0130]">{cat.name}</td>
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
                              <span className="text-xs font-bold text-red-600">Delete {cat.name}?</span>
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
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category Image (Optional)</label>
            <input
              type="text"
              value={formCategoryImage}
              onChange={(e) => setFormCategoryImage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E4C560] transition-shadow mb-2"
              placeholder="Paste image URL (https://...)"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">or</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setFormCategoryImage)}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
            </div>
          </div>
          
          {formCategoryImage && (
              <div className="flex items-center gap-4 p-4 mt-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formCategoryImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Image Preview</p>
              </div>
          )}

          <div className="mb-6 mt-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dedicated Category Page Background Image (Optional)</label>
            <input
              type="text"
              value={formDedicatedImage}
              onChange={(e) => setFormDedicatedImage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E4C560] transition-shadow mb-2"
              placeholder="Paste background image URL (https://...)"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">or</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setFormDedicatedImage)}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
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
                onChange={(e) => setFormCategory(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm appearance-none"
              >
                {categoryList.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image (URL or Local File) <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block p-3.5 transition-all shadow-sm mb-2"
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">or</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFormImageUrl)}
                  className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
              </div>
            </div>
            
            {formImageUrl && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formImageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Image Preview</p>
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
