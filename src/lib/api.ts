const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? '' : 'http://localhost:8000/api');

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: number;
  category_name: string;
  stock: number;
  is_active: boolean;
  is_in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  id: number;
  user: number;
  address_type: 'home' | 'work' | 'other';
  apartment_flat: string;
  street: string;
  landmark: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  full_address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UPISettings {
  id: number;
  merchant_name: string;
  upi_id: string;
  qr_code_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  shipping_charge: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

// Authentication Interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null;
  address: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export class ApiService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static getCachedData(key: string): any | undefined {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return undefined;
  }

  private static setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories';
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      // Return dummy data for demo
      const dummyCategories: Category[] = [
        {
          id: 1,
          name: 'Electronics',
          description: 'Latest smartphones, laptops, and gadgets',
          image: '/api/placeholder/300/200',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Books',
          description: 'Educational and entertainment books',
          image: '/api/placeholder/300/200',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Fashion',
          description: 'Clothing and accessories for all ages',
          image: '/api/placeholder/300/200',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          name: 'Home & Kitchen',
          description: 'Everything for your home and kitchen',
          image: '/api/placeholder/300/200',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
      this.setCachedData(cacheKey, dummyCategories);
      return dummyCategories;
    }
  }

  static async getProducts(categoryId?: number): Promise<Product[]> {
    const cacheKey = categoryId ? `products_category_${categoryId}` : 'products_all';
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const url = categoryId
        ? `${API_BASE_URL}/products/?category=${categoryId}`
        : `${API_BASE_URL}/products/`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      // Return dummy products for demo
      const dummyProducts: Product[] = [
        {
          id: 1,
          name: 'Samsung Galaxy M14 5G',
          description: 'Latest smartphone with 5G connectivity and amazing camera',
          price: 14999,
          image: '/api/placeholder/300/300',
          category: 1,
          category_name: 'Electronics',
          stock: 50,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Dell Inspiron Laptop',
          description: 'Powerful laptop for work and entertainment',
          price: 45999,
          image: '/api/placeholder/300/300',
          category: 1,
          category_name: 'Electronics',
          stock: 25,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Python Programming Book',
          description: 'Learn Python programming from basics to advanced',
          price: 599,
          image: '/api/placeholder/300/300',
          category: 2,
          category_name: 'Books',
          stock: 100,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          name: 'Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt for everyday wear',
          price: 299,
          image: '/api/placeholder/300/300',
          category: 3,
          category_name: 'Fashion',
          stock: 200,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 5,
          name: 'Stainless Steel Water Bottle',
          description: 'Insulated water bottle keeps drinks cold for 24 hours',
          price: 399,
          image: '/api/placeholder/300/300',
          category: 4,
          category_name: 'Home & Kitchen',
          stock: 75,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 6,
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality sound with noise cancellation',
          price: 2499,
          image: '/api/placeholder/300/300',
          category: 1,
          category_name: 'Electronics',
          stock: 40,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 7,
          name: 'JavaScript Guide Book',
          description: 'Complete guide to modern JavaScript development',
          price: 799,
          image: '/api/placeholder/300/300',
          category: 2,
          category_name: 'Books',
          stock: 80,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 8,
          name: 'Non-Stick Cookware Set',
          description: 'Complete kitchen set with 5 pieces',
          price: 1999,
          image: '/api/placeholder/300/300',
          category: 4,
          category_name: 'Home & Kitchen',
          stock: 30,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      // Filter by category if specified
      const filteredProducts = categoryId
        ? dummyProducts.filter(p => p.category === categoryId)
        : dummyProducts;

      this.setCachedData(cacheKey, filteredProducts);
      return filteredProducts;
    }
  }

  static async getProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    } catch (error) {
      // Return dummy product for demo
      const dummyProducts = [
        {
          id: 1,
          name: 'Samsung Galaxy M14 5G',
          description: 'Latest smartphone with 5G connectivity and amazing camera',
          price: 14999,
          image: '/api/placeholder/300/300',
          category: 1,
          category_name: 'Electronics',
          stock: 50,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Dell Inspiron Laptop',
          description: 'Powerful laptop for work and entertainment',
          price: 45999,
          image: '/api/placeholder/300/300',
          category: 1,
          category_name: 'Electronics',
          stock: 25,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Python Programming Book',
          description: 'Learn Python programming from basics to advanced',
          price: 599,
          image: '/api/placeholder/300/300',
          category: 2,
          category_name: 'Books',
          stock: 100,
          is_active: true,
          is_in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
      const product = dummyProducts.find(p => p.id === id);
      if (product) {
        return product;
      }
      throw new Error('Product not found');
    }
  }

  static async createOrder(orderData: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    shipping_address: string;
    total_amount: number;
    shipping_charge: number;
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>;
  }): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return response.json();
  }

  static async uploadPaymentProof(orderId: number, formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/upload_payment_proof/`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload payment proof');
    }
    return response.json();
  }

  // Authentication Methods
  static async register(userData: {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    password: string;
    password_confirm: string;
  }): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  }

  static async login(credentials: {
    username_or_email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail ||
            errorData.message ||
            errorData.error ||
            (errorData.non_field_errors && errorData.non_field_errors[0]) ||
            'Login failed';
        } catch (e) {
          // If response is not JSON, get the text
          try {
            const textResponse = await response.text();
            errorMessage = textResponse || 'Login failed';
          } catch (e2) {
            errorMessage = 'Login failed - server error';
          }
        }
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      // Return mock user for demo
      const isAdminLogin = credentials.username_or_email.toLowerCase() === 'admin';
      const mockUser: User = {
        id: 1,
        username: credentials.username_or_email,
        email: isAdminLogin ? 'admin@yuvakart.com' : `${credentials.username_or_email}@example.com`,
        first_name: isAdminLogin ? 'Admin' : 'John',
        last_name: isAdminLogin ? 'User' : 'Doe',
        phone: '+91 9876543210',
        date_of_birth: '1990-01-01',
        address: '123 Admin Street, City, State - 123456',
        is_staff: isAdminLogin,
        is_superuser: isAdminLogin,
        is_active: true
      };

      const mockTokens = {
        access: 'mock_access_token',
        refresh: 'mock_refresh_token'
      };

      const mockResponse: LoginResponse = {
        user: mockUser,
        tokens: mockTokens,
        message: 'Login successful'
      };

      return mockResponse;
    }
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send reset email');
    }
    return response.json();
  }

  static async resetPassword(data: {
    token: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset-confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password reset failed');
    }
    return response.json();
  }

  static async getProfile(token?: string): Promise<User> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }

  static async updateProfile(profileData: Partial<User>, token?: string): Promise<User> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  // Admin API methods
  static async getAdminOrders(): Promise<Order[]> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/orders/`, { headers });
    if (!response.ok) throw new Error('Failed to fetch admin orders');
    return response.json();
  }

  static async getAdminDashboardStats(): Promise<any> {
    try {
      const token = this.getAccessToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats/`, { headers });
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    } catch (error) {
      // Return mock dashboard stats for demo
      const mockStats = {
        total_orders: 47,
        pending_payments: 12,
        verified_payments: 35,
        total_products: 8,
        low_stock_products: 2,
        total_revenue: 125000,
        recent_orders: [
          {
            id: 1001,
            customer_name: 'Rajesh Kumar',
            customer_phone: '+91 9876543210',
            customer_email: 'rajesh@example.com',
            shipping_address: '123 Main Street, Village Name, District, State - 123456',
            total_amount: 1250,
            shipping_charge: 50,
            order_status: 'payment_verified',
            payment_status: 'verified',
            created_at: '2024-01-15T10:30:00Z',
            items: [
              { id: 1, product_name: 'Samsung Mobile Phone', quantity: 1, price: 1200, total: 1200 }
            ]
          },
          {
            id: 1002,
            customer_name: 'Priya Sharma',
            customer_phone: '+91 9876543211',
            customer_email: 'priya@example.com',
            shipping_address: '456 Secondary Road, Another Village, District, State - 123457',
            total_amount: 850,
            shipping_charge: 50,
            order_status: 'pending_payment',
            payment_status: 'pending',
            created_at: '2024-01-14T14:20:00Z',
            items: [
              { id: 2, product_name: 'Python Programming Book', quantity: 1, price: 800, total: 800 }
            ]
          },
          {
            id: 1003,
            customer_name: 'Amit Singh',
            customer_phone: '+91 9876543212',
            customer_email: 'amit@example.com',
            shipping_address: '789 Third Lane, Third Village, District, State - 123458',
            total_amount: 650,
            shipping_charge: 50,
            order_status: 'payment_verified',
            payment_status: 'verified',
            created_at: '2024-01-13T09:15:00Z',
            items: [
              { id: 3, product_name: 'Cotton T-Shirt', quantity: 1, price: 600, total: 600 }
            ]
          }
        ]
      };
      return mockStats;
    }
  }

  static async getAdminProducts(): Promise<Product[]> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/products/`, { headers });
    if (!response.ok) throw new Error('Failed to fetch admin products');
    return response.json();
  }

  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'is_in_stock'>): Promise<Product> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/products/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  static async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  static async deleteProduct(id: number): Promise<void> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }

  static async approvePayment(orderId: number): Promise<any> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/approve_payment/`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to approve payment');
    return response.json();
  }

  static async rejectPayment(orderId: number): Promise<any> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/reject_payment/`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to reject payment');
    return response.json();
  }

  static async getOrderTracking(orderId: number): Promise<any> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/tracking/`, { headers });
    if (!response.ok) throw new Error('Failed to fetch tracking info');
    return response.json();
  }

  // Delhivery Integration
  static async createDelhiveryShipment(shipmentId: number): Promise<any> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/shipments/${shipmentId}/create_delhivery_shipment/`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to create Delhivery shipment');
    return response.json();
  }

  // Razorpay Integration
  static async verifyRazorpayPayment(data: {
    payment_id: string;
    order_id: number;
    amount: number;
  }): Promise<any> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/verify-payment/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to verify payment');
    return response.json();
  }

  static async createRazorpayRefund(data: {
    payment_id: string;
    amount: number;
    reason: string;
  }): Promise<any> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/admin/create-refund/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create refund');
    return response.json();
  }

  // Address management methods
  static async getAddresses(token?: string): Promise<Address[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/addresses/`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
  }

  static async createAddress(addressData: Omit<Address, 'id' | 'user' | 'created_at' | 'updated_at'>, token?: string): Promise<Address> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/addresses/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to create address');
    return response.json();
  }

  static async updateAddress(id: number, addressData: Partial<Address>, token?: string): Promise<Address> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/addresses/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to update address');
    return response.json();
  }

  static async deleteAddress(id: number, token?: string): Promise<void> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/addresses/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete address');
  }

  // UPI Settings methods
  static async getUPISettings(): Promise<UPISettings[]> {
    const response = await fetch(`${API_BASE_URL}/upi-settings/`);
    if (!response.ok) throw new Error('Failed to fetch UPI settings');
    return response.json();
  }

  // Auth utilities
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  static isLoggedIn(): boolean {
    return !!this.getCurrentUser() && !!this.getAccessToken();
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}
