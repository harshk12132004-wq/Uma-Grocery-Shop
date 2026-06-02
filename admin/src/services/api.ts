import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to recursively traverse and replace Unsplash URLs with local static assets
function getLocalFallbackImage(url: string, contextName: string = ''): string {
  const lowerUrl = url.toLowerCase();
  const lowerContext = contextName.toLowerCase();
  
  if (
    lowerUrl.includes('tomato') || 
    lowerUrl.includes('vegetable') || 
    lowerContext.includes('tomato') || 
    lowerContext.includes('vegetable') ||
    lowerContext.includes('veg') ||
    lowerContext.includes('onion') ||
    lowerContext.includes('chilli') ||
    lowerContext.includes('potato') ||
    lowerContext.includes('carrot') ||
    lowerContext.includes('garlic') ||
    lowerContext.includes('ginger') ||
    lowerContext.includes('brinjal') ||
    lowerContext.includes('lady') ||
    lowerContext.includes('cucumber')
  ) {
    const index = (url.length % 4) + 1;
    return `/tomato_${index}.jpg`;
  }
  
  if (lowerUrl.includes('banner') || lowerUrl.includes('background') || lowerContext.includes('banner') || lowerContext.includes('background')) {
    return '/banner.png';
  }
  
  // Deterministic index for other items based on the length/hash of the URL
  const hash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = (hash % 4) + 1;
  return `/tomato_${index}.jpg`;
}

function replaceUnsplashUrls(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => replaceUnsplashUrls(item));
  }
  
  if (typeof obj === 'object') {
    const newObj = { ...obj };
    const contextName = (newObj.name || newObj.category_name || newObj.title || newObj.product_name || '').toLowerCase();
    
    for (const key in newObj) {
      if (Object.prototype.hasOwnProperty.call(newObj, key)) {
        const val = newObj[key];
        if (typeof val === 'string' && val.includes('images.unsplash.com')) {
          newObj[key] = getLocalFallbackImage(val, contextName);
        } else if (typeof val === 'object') {
          newObj[key] = replaceUnsplashUrls(val);
        }
      }
    }
    return newObj;
  }
  
  return obj;
}

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = replaceUnsplashUrls(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Product {
  id: number;
  name: string;
  price: number;
  category: number;
  category_name: string;
  image_url: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  unit: string;
  description?: string;
  sub_category?: string;
  in_stock: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
    dedicated_image_url?: string;
  product_count: number;
}

export interface CartItem {
  id: number;
  product: number;
  product_details: Product;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  created_at?: string;
}


export interface Order {
  id: number;
  user: number;
  user_name: string;
  status: string;
  delivery_address: string;
  phone: string;
  total_amount: number;
  delivery_charge: number;
  items: OrderItem[];
  created_at: string;
  delivered_at?: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  discount_percentage?: number;
  product?: number;
  product_details?: Product;
  image_url?: string;
  is_active: boolean;
  send_email_notification?: boolean;
  created_at: string;
}

// Authentication
export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    phone: string;
    address: string;
    pincode: string;
    otp: string;
  }) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  sendOtp: async (email: string) => {
    const response = await api.post('/auth/send-otp/', { email });
    return response.data;
  },

  updateUser: async (data: any) => {
    const response = await api.put('/auth/user/', data);
    return response.data;
  },

  login: async (username: string, password: string) => {
    // Pass username as both username and email to backend so it authenticates seamlessly with either
    const response = await api.post('/auth/login/', { username, email: username, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/user/');
    return response.data;
  },
};


// Products
export const productsAPI = {
  getAll: async (category?: string, search?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const response = await api.get(`/products/?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/`);
  },

  getSubCategories: async (categoryId: number): Promise<string[]> => {
    const response = await api.get(`/products/sub_categories/?category_id=${categoryId}`);
    return response.data;
  },
};

// Admin Dashboard Services
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin-users/');
    return response.data;
  },

  getFeedback: async (): Promise<any[]> => {
    const response = await api.get('/feedback/');
    return response.data;
  },

  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}/`);
  },
};

// Categories
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories/');
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/`);
  },
};

// Cart
export const cartAPI = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart/');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await api.post('/cart/', {
      product: productId,
      quantity,
    });
    return response.data;
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.patch(`/cart/${cartItemId}/update_quantity/`, {
      quantity,
    });
    return response.data;
  },

  removeItem: async (cartItemId: number) => {
    const response = await api.delete(`/cart/${cartItemId}/`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear/');
    return response.data;
  },
};

// Orders
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders/');
    return response.data;
  },

  create: async (delivery_address: string, phone: string) => {
    const response = await api.post('/orders/', {
      delivery_address,
      phone,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/orders/${id}/update_status/`, {
      status,
    });
    return response.data;
  },
};

// Contact Feedback
export const contactAPI = {
  sendFeedback: async (name: string, email: string, subject: string, message: string) => {
    const response = await api.post('/contact/', { name, email, subject, message });
    return response.data;
  }
};

// Offers API
export const offersAPI = {
  getAll: async (activeOnly: boolean = true): Promise<Offer[]> => {
    const response = await api.get(`/offers/${activeOnly ? '?active=true' : ''}`);
    return response.data;
  },
  
  create: async (data: Partial<Offer>): Promise<Offer> => {
    const response = await api.post('/offers/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Offer>): Promise<Offer> => {
    const response = await api.put(`/offers/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/offers/${id}/`);
  }
};

export default api;
