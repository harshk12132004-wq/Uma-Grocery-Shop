import { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, Button, CircularProgress } from '@mui/material';
import { authAPI, productsAPI, categoriesAPI, Product, User as UserType } from './services/api';
import AdminPanel from './components/AdminPanel';
import './styles/index.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkCurrentUser();
    fetchProducts();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (user && user.is_staff) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      setCurrentUser(null);
      console.log('Admin not logged in');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      const cats = await categoriesAPI.getAll();
      setCategoriesList(['All', ...cats.map(c => c.name)]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(loginUsername, loginPassword);
      if (response.user.is_staff) {
        setCurrentUser(response.user);
        await fetchProducts();
      } else {
        await authAPI.logout();
        setError('Only administrators and staff accounts can log in here.');
      }
    } catch (err: any) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setCurrentUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (currentUser?.is_staff) {
    return (
      <div className="min-h-screen font-sans selection:bg-[#1D0130] selection:text-white transition-colors duration-500 bg-[#FDFBFD]">
        <AdminPanel
          products={products}
          categories={categoriesList}
          currentUser={currentUser}
          onProductsChanged={fetchProducts}
          onNavigateHome={() => {
            window.location.href = 'http://localhost:5173/';
          }}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Admin Login Portal
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#130120] p-4 font-sans selection:bg-[#E4C560] selection:text-white">
      <div className="w-full max-w-md bg-[#1D0130]/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-6">
            <img 
              src="/logo.png" 
              alt="Uma Grocery Shop Logo" 
              className="h-24 w-auto object-contain drop-shadow-xl"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-[#E4C560] font-serif tracking-wide">Admin <span className="text-[#E4C560]">Portal</span></h2>
          <p className="text-sm text-gray-400 mt-2 font-medium">Authorized personnel only</p>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username or Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-purple-300" />
              </div>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-[#1D0130]/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block pl-11 p-3.5 transition-all placeholder-gray-600"
                placeholder="Enter admin credentials"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-purple-300" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#1D0130]/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-[#E4C560] focus:border-transparent block pl-11 pr-11 p-3.5 transition-all placeholder-gray-600"
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300 hover:text-[#E4C560] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #E4C560 0%, #F5D777 100%)',
              color: '#130120',
              fontWeight: 'bold',
              py: 1.5,
              mt: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(228, 197, 96, 0.3)',
              '&:hover': { background: 'linear-gradient(90deg, #C7AB4B 0%, #E4C560 100%)' }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#130120' }} /> : 'Secure Login'}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => {
              window.location.href = 'http://localhost:5173/';
            }}
            variant="text"
            sx={{ color: 'gray', textTransform: 'none', fontSize: '12px', '&:hover': { color: 'white' } }}
          >
            ← Return to Public Store
          </Button>
        </div>
      </div>
    </div>
  );
}
