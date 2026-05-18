import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  picture?: string;        // for Google avatar
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;  // <-- new
  logout: () => void;
  placeOrder: (orderData: OrderData) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  zipCode: string;
}

interface OrderData {
  quantity: number;
  totalPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database - In production, replace with actual API calls
const mockUsers: Map<string, { user: User; password: string }> = new Map();
const mockOrders: Map<string, Order[]> = new Map();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOrders = localStorage.getItem('orders');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = mockUsers.get(email);
    if (userData && userData.password === password) {
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData.user));
      const userOrders = mockOrders.get(userData.user.id) || [];
      setOrders(userOrders);
      localStorage.setItem('orders', JSON.stringify(userOrders));
    } else {
      throw new Error('Invalid email or password');
    }
    setIsLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mockUsers.has(userData.email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.set(userData.email, { user: newUser, password: userData.password });
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  // 🆕 Google Login – decodes JWT and creates/retrieves user
  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate network

    // Decode the JWT payload (credential is the id_token)
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const payload = JSON.parse(jsonPayload);

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Check if user already exists in mock DB
    let existingEntry = mockUsers.get(email);
    let userObj: User;

    if (existingEntry) {
      userObj = existingEntry.user;
      // Update name/picture if changed
      if (userObj.name !== name) userObj.name = name;
      if (!userObj.picture) userObj.picture = picture;
      mockUsers.set(email, { user: userObj, password: '' }); // no password for Google users
    } else {
      // Create new user
      userObj = {
        id: Date.now().toString(),
        name: name,
        email: email,
        picture: picture,
        createdAt: new Date().toISOString(),
      };
      mockUsers.set(email, { user: userObj, password: '' });
    }

    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));

    // Load orders (none for new user)
    const userOrders = mockOrders.get(userObj.id) || [];
    setOrders(userOrders);
    localStorage.setItem('orders', JSON.stringify(userOrders));

    setIsLoading(false);
  };

  const placeOrder = async (orderData: OrderData): Promise<Order> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: user.id,
      quantity: orderData.quantity,
      totalPrice: orderData.totalPrice,
      status: 'confirmed',
      orderDate: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress,
    };
    
    const existingOrders = mockOrders.get(user.id) || [];
    const updatedOrders = [newOrder, ...existingOrders];
    mockOrders.set(user.id, updatedOrders);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    setIsLoading(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    if (user) {
      mockOrders.set(user.id, updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('user');
    localStorage.removeItem('orders');
  };

  return (
    <AuthContext.Provider value={{
      user,
      orders,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      loginWithGoogle,       // <-- exposed
      logout,
      placeOrder,
      updateOrderStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};