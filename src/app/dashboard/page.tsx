'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

import { ApiService } from '@/lib/api';
import {
  User,
  ShoppingBag,
  Package,
  Heart,
  Settings,
  LogOut,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  Menu,
  X,
  Home,
  ShoppingCart,
  User as UserIcon,
  Edit3,
  Save,
  Eye,
  EyeOff,
  ChevronRight,
  BarChart3,
  Star,
  MessageSquare
} from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null;
  address: string;
}

const sidebarVariants = {
  open: {
    x: 0
  },
  closed: {
    x: "-100%"
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // Try to get user from localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfileData(userData);
        setLoading(false);
        return;
      }

      // Try API call
      try {
        const userData = await ApiService.getProfile();
        setUser(userData);
        setProfileData(userData);
      } catch (apiError) {
        console.log('API not available, redirecting to login');
        router.push('/login');
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      // In a real app, you'd call the API to update the profile
      // For now, we'll just update localStorage
      localStorage.setItem('user', JSON.stringify(profileData));
      setUser(profileData as UserProfile);
      setEditingProfile(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'cart', label: 'Shopping Cart', icon: ShoppingCart },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'support', label: 'Support', icon: MessageSquare },
  ];

  // Show loading until component is mounted to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>You need to be logged in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0 bg-white shadow-lg">
        <motion.div
          className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-40 lg:relative lg:top-auto lg:left-auto lg:h-full lg:z-auto"
        >
          <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-3"
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {user ? (user.first_name || user.username) : 'Guest User'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate max-w-full">
                    {user ? user.email : 'guest@example.com'}
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-6">
              <motion.ul
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {sidebarItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.8 }}
                    >
                      <motion.button
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className={`p-2 rounded-lg mr-3 ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-gray-100 group-hover:bg-white'
                          }`}
                          whileHover={{ rotate: 5 }}
                        >
                          <Icon className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-gray-600'
                          }`} />
                        </motion.div>
                        <span className={`font-medium ${
                          isActive ? 'text-white' : 'text-gray-700'
                        }`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 bg-white/50">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="font-medium">Logout</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-40 lg:hidden"
      >
        <div className="flex flex-col h-full bg-white">
          {/* Debug: Force visible content */}
          <div className="p-2 bg-blue-100 text-xs text-center border-b">
            SIDEBAR LOADED - USER: {user ? 'YES' : 'NO'}
          </div>

          {/* Sidebar Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between lg:justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md"
              >
                <User className="w-5 h-5 text-white" />
              </motion.div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 text-sm">
                {user ? (user.first_name || user.username) : 'Guest User'}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {user ? user.email : 'guest@example.com'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 bg-white">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                      {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t bg-white">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-20 left-4 z-30 bg-white p-2 rounded-lg shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold mb-2">
                            Welcome back, {user.first_name || user.username}!
                          </h1>
                          <p className="text-green-100">
                            Here's what's happening with your account today.
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">No orders yet</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Items in wishlist</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Product reviews</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Open tickets</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common tasks to get you started</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                          <Link href="/categories">
                            <ShoppingBag className="w-6 h-6" />
                            <span className="text-sm">Browse Categories</span>
                          </Link>
                        </Button>

                        <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                          <Link href="/dashboard?tab=orders">
                            <Package className="w-6 h-6" />
                            <span className="text-sm">View Orders</span>
                          </Link>
                        </Button>

                        <Button
                          onClick={() => setActiveTab('profile')}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2"
                        >
                          <Settings className="w-6 h-6" />
                          <span className="text-sm">Edit Profile</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your account details and preferences</CardDescription>
                      </div>
                      <Button
                        onClick={() => setEditingProfile(!editingProfile)}
                        variant={editingProfile ? "outline" : "default"}
                      >
                        {editingProfile ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                        {editingProfile ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          {editingProfile ? (
                            <Input
                              value={profileData.first_name || ''}
                              onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                              placeholder="Enter your first name"
                            />
                          ) : (
                            <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                              {user.first_name || 'Not provided'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          {editingProfile ? (
                            <Input
                              value={profileData.last_name || ''}
                              onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                              placeholder="Enter your last name"
                            />
                          ) : (
                            <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                              {user.last_name || 'Not provided'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Username</label>
                          <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                            {user.username}
                          </p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                            {user.email}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          {editingProfile ? (
                            <Input
                              value={profileData.phone || ''}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                              {user.phone || 'Not provided'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Address</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Address</label>
                        {editingProfile ? (
                          <Textarea
                            value={profileData.address || ''}
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            placeholder="Enter your full address"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                            {user.address || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    {editingProfile && (
                      <div className="flex justify-end">
                        <Button onClick={handleProfileUpdate} disabled={saving}>
                          {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>Track your order history and current orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-gray-600 mb-6">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                      </p>
                      <Button asChild>
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>Shopping Cart</CardTitle>
                    <CardDescription>Items in your shopping cart</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Your Cart is Empty</h3>
                      <p className="text-gray-600 mb-6">
                        Add items to your cart to see them here.
                      </p>
                      <Button asChild>
                        <Link href="/categories">Browse Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Items you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
                      <p className="text-gray-600 mb-6">
                        Save items you like to your wishlist to see them here.
                      </p>
                      <Button asChild>
                        <Link href="/categories">Browse Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>My Reviews</CardTitle>
                    <CardDescription>Reviews you've written for products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-6">
                        You haven't written any reviews yet. Purchase products to leave reviews.
                      </p>
                      <Button asChild>
                        <Link href="/categories">Browse Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Center</CardTitle>
                    <CardDescription>Get help with your orders and account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
                      <p className="text-gray-600 mb-6">
                        Contact our support team for assistance with your orders and account.
                      </p>
                      <Button asChild>
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Export with SSR disabled to prevent hydration errors
export default dynamic(() => Promise.resolve(DashboardPage), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  ),
});
