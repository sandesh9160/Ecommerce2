'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApiService, Order, Product } from '@/lib/api';
import {
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Plus,
  Settings,
  BarChart3,
  ArrowUpRight,
  Eye,
  DollarSign,
  LogOut,
  Search,
  FileText,
  IndianRupee,
  Check,
  X,
  RefreshCw,
  LayoutDashboard,
  User,
  BarChart,
  Ship,
  ShoppingCart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  total_orders: number;
  pending_payments: number;
  verified_payments: number;
  total_products: number;
  low_stock_products: number;
  total_revenue: number;
  recent_orders: Order[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    if (!ApiService.isLoggedIn()) {
      router.push('/admin-login');
      return;
    }

    // Check if user has admin privileges
    const currentUser = ApiService.getCurrentUser();
    if (!currentUser || (!currentUser.is_staff && !currentUser.is_superuser)) {
      router.push('/admin-login');
      return;
    }

    loadDashboardStats();
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use optimized dashboard stats endpoint
      const dashboardData = await ApiService.getAdminDashboardStats();

      // Transform the data to match expected format
      setStats({
        total_orders: dashboardData.total_orders,
        pending_payments: dashboardData.pending_payments,
        verified_payments: dashboardData.verified_payments,
        total_products: dashboardData.total_products,
        low_stock_products: dashboardData.low_stock_products,
        total_revenue: parseFloat(dashboardData.total_revenue),
        recent_orders: dashboardData.recent_orders.map((order: any) => ({
          id: order.id,
          customer_name: order.customer_name,
          total_amount: parseFloat(order.total_amount),
          payment_status: order.payment_status,
          created_at: order.created_at
        }))
      });

    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      // If unauthorized, redirect might be handled by ApiService or here
      if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
        router.push('/admin-login');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    ApiService.logout();
    router.push('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"
        />
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Add Products', icon: Plus },
    { id: 'shipments', label: 'Shipments', icon: Ship },
    { id: 'users', label: 'User Details', icon: User },
    { id: 'stats', label: 'Statistics', icon: BarChart },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return stats ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Total Products</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.total_products}</h3>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <IndianRupee className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">₹{stats.total_revenue.toLocaleString()}</h3>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.pending_payments}</h3>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Truck className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Total Orders</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.total_orders}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <CardDescription>Latest transactions requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recent_orders.length > 0 ? (
                      stats.recent_orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">Order #{order.id}</p>
                              <Badge
                                variant={order.payment_status === 'verified' ? 'default' : 'secondary'}
                                className={order.payment_status === 'verified' ?
                                  'bg-green-100 text-green-700' :
                                  'bg-orange-100 text-orange-700'
                                }
                              >
                                {order.payment_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{order.customer_name}</p>
                            <p className="text-sm font-semibold text-slate-900">
                              ₹{Number(order.total_amount).toLocaleString()}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent orders</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null;

      case 'products':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Add New Product</CardTitle>
                <CardDescription>Add products to your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" size="lg">
                  <Link href="/admin/products/new">
                    <Plus className="w-5 h-5 mr-3" />
                    Create New Product
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/products">
                    <Package className="w-4 h-4 mr-3" />
                    Manage All Products
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/categories">
                    <FileText className="w-4 h-4 mr-3" />
                    Manage Categories
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'shipments':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Shipment Management</CardTitle>
                <CardDescription>Handle deliveries with Delhivery integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/admin/shipments">
                    <Truck className="w-5 h-5 mr-3" />
                    View All Shipments
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/admin/shipments/create">
                    <Plus className="w-5 h-5 mr-3" />
                    Create New Shipment
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delhivery Integration</CardTitle>
                <CardDescription>Connected to Delhivery API for seamless shipping</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">API Connected</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Ready to create shipments and track deliveries
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription>View and manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Total Users</p>
                      <p className="text-sm text-slate-600">Registered customers</p>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">1,234</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Active Users</p>
                      <p className="text-sm text-slate-600">Users with recent activity</p>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">892</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">New This Month</p>
                      <p className="text-sm text-slate-600">Recently registered users</p>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">156</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'stats':
        return stats ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Detailed Statistics</CardTitle>
                <CardDescription>Comprehensive analytics and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Verified Payments:</span>
                        <span className="font-semibold text-green-600">₹{stats.total_revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Amount:</span>
                        <span className="font-semibold text-orange-600">₹{((stats.pending_payments * 500) || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Order Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span className="font-semibold">{stats.total_orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified Orders:</span>
                        <span className="font-semibold text-green-600">{stats.verified_payments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Orders:</span>
                        <span className="font-semibold text-orange-600">{stats.pending_payments}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Inventory Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-semibold">{stats.total_products}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Stock Items:</span>
                      <span className="font-semibold text-red-600">{stats.low_stock_products}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Healthy Stock:</span>
                      <span className="font-semibold text-green-600">{stats.total_products - stats.low_stock_products}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null;

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 min-h-screen">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">Management Console</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 capitalize">
                {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-slate-600">
                {activeSection === 'dashboard' && 'Overview and key metrics'}
                {activeSection === 'products' && 'Add and manage products'}
                {activeSection === 'shipments' && 'Handle deliveries and logistics'}
                {activeSection === 'users' && 'User accounts and details'}
                {activeSection === 'stats' && 'Detailed analytics and reports'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
                <Button variant="link" size="sm" onClick={loadDashboardStats} className="ml-2 text-red-700">
                  Retry
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
