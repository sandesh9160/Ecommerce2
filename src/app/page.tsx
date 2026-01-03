'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApiService, Category, Product } from '@/lib/api';
import { ShoppingBag, Truck, Shield, Zap, Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fix hydration by ensuring client-side only state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Banner carousel slides data
  const bannerSlides = [
    {
      title: "Smart Shopping, Easy Living",
      subtitle: "Your trusted eCommerce platform for rural and semi-urban India",
      gradient: "from-green-600 via-green-700 to-green-800",
      primaryText: "Shop Now",
      secondaryText: "Learn More"
    },
    {
      title: "Quality Products, Local Delivery",
      subtitle: "Fresh groceries, electronics, and daily essentials delivered to your doorstep",
      gradient: "from-blue-600 via-blue-700 to-blue-800",
      primaryText: "Explore Categories",
      secondaryText: "View Offers"
    },
    {
      title: "Rural India, Modern Shopping",
      subtitle: "Bringing the best of eCommerce to every corner of rural and semi-urban India",
      gradient: "from-purple-600 via-purple-700 to-purple-800",
      primaryText: "Start Shopping",
      secondaryText: "Our Story"
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  // Auto-scroll banner carousel - only on client side to prevent hydration mismatch
  useEffect(() => {
    // Delay to ensure hydration is complete
    const startAutoScroll = () => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
      }, 5000); // Change slide every 5 seconds

      return interval;
    };

    const timeoutId = setTimeout(startAutoScroll, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [bannerSlides.length]);



  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('Loading categories...');
      const categoriesData = await ApiService.getCategories();
      console.log('Categories loaded:', categoriesData);
      setCategories(categoriesData);
      await loadProducts();
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const productsData = await ApiService.getProducts(selectedCategory || undefined);
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-screen"
        >
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-red-600">Oops!</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadInitialData} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Section - Banner Carousel */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-black/10" />

        {/* Carousel Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`relative bg-gradient-to-br ${bannerSlides[currentSlide].gradient} py-20 lg:py-32`}
          >
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                >
                  {bannerSlides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90"
                >
                  {bannerSlides[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button asChild size="lg" className="bg-white text-gray-800 hover:bg-gray-50 hover:text-gray-900 shadow-lg">
                    <Link href="#products" className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      {bannerSlides[currentSlide].primaryText}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-800 shadow-lg">
                    <Link href="/about">
                      {bannerSlides[currentSlide].secondaryText}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots - Only render on client to prevent hydration mismatch */}
        {isClient && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows - Only render on client to prevent hydration mismatch */}
        {isClient && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Discover products across different categories tailored for your needs
            </motion.p>
          </motion.div>

          {/* Categories Grid - Show All Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {(() => {
              const staticCategories = [
                { name: 'Electronics', icon: '📱', color: 'bg-blue-100', textColor: 'text-blue-600', id: null },
                { name: 'Books', icon: '📚', color: 'bg-purple-100', textColor: 'text-purple-600', id: null },
                { name: 'Gifts', icon: '🎁', color: 'bg-pink-100', textColor: 'text-pink-600', id: null },
                { name: 'Photos', icon: '📸', color: 'bg-green-100', textColor: 'text-green-600', id: null },
                { name: 'Accessories', icon: '💍', color: 'bg-yellow-100', textColor: 'text-yellow-600', id: null },
                { name: 'Home Decor', icon: '🏠', color: 'bg-indigo-100', textColor: 'text-indigo-600', id: null },
                { name: 'Fashion', icon: '👕', color: 'bg-red-100', textColor: 'text-red-600', id: null },
                { name: 'Sports', icon: '⚽', color: 'bg-orange-100', textColor: 'text-orange-600', id: null },
                { name: 'Beauty', icon: '💄', color: 'bg-rose-100', textColor: 'text-rose-600', id: null },
                { name: 'Toys', icon: '🧸', color: 'bg-cyan-100', textColor: 'text-cyan-600', id: null },
                { name: 'Groceries', icon: '🛒', color: 'bg-emerald-100', textColor: 'text-emerald-600', id: null },
                { name: 'Stationery', icon: '✏️', color: 'bg-slate-100', textColor: 'text-slate-600', id: null }
              ];
              const apiCategories = categories.slice(0, 4).map(cat => ({ ...cat, icon: '📦', color: 'bg-primary/10', textColor: 'text-foreground' }));
              return [...staticCategories, ...apiCategories];
            })().map((category, index) => (
              <motion.div
                key={`category-${index}-${category.name}-${category.id || 'static'}`}
                variants={itemVariants}
                className="w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full h-full rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 p-4 text-center group cursor-pointer"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.3 }
                    }}
                    className={`w-12 h-12 mx-auto mb-3 ${category.color || 'bg-primary/10'} rounded-full flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                  >
                    <span className="text-2xl">{category.icon || '📦'}</span>
                  </motion.div>
                  <h3 className={`font-semibold text-xs sm:text-sm mb-2 ${category.textColor || 'text-foreground'}`}>
                    {category.name}
                  </h3>
                  <div className="w-full bg-muted rounded-full h-1 mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: '100%',
                        transition: {
                          duration: 0.8,
                          delay: index * 0.1 + 0.3,
                          ease: "easeOut"
                        }
                      }}
                      viewport={{ once: true }}
                      className={`h-full ${category.color || 'bg-primary'} rounded-full`}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {selectedCategory
                  ? `${categories.find(c => c.id === selectedCategory)?.name} Products`
                  : 'Featured Products'
                }
              </h2>
              <p className="text-muted-foreground">
                {selectedCategory ? 'Browse products in this category' : 'Discover our most popular items'}
              </p>
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="shrink-0"
              >
                View All Products
              </Button>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoadingProducts ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-16"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-16"
              >
                {/* Sample Products Showcase */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <p className="text-muted-foreground text-center">
                    Discover our most popular items loved by customers
                  </p>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {[
                    {
                      name: "Samsung Galaxy M14",
                      price: 14999,
                      image: "/api/placeholder/300/300",
                      category: "Electronics",
                      rating: 4.5,
                      discount: "10% OFF"
                    },
                    {
                      name: "Stainless Steel Water Bottle",
                      price: 399,
                      image: "/api/placeholder/300/300",
                      category: "Home & Kitchen",
                      rating: 4.8,
                      discount: "15% OFF"
                    },
                    {
                      name: "Herbal Shampoo 500ml",
                      price: 225,
                      image: "/api/placeholder/300/300",
                      category: "Personal Care",
                      rating: 4.6,
                      discount: "20% OFF"
                    },
                    {
                      name: "Premium Basmati Rice 5kg",
                      price: 425,
                      image: "/api/placeholder/300/300",
                      category: "Groceries",
                      rating: 4.9,
                      discount: "5% OFF"
                    },
                    {
                      name: "Power Bank 20000mAh",
                      price: 1299,
                      image: "/api/placeholder/300/300",
                      category: "Electronics",
                      rating: 4.7,
                      discount: "12% OFF"
                    },
                    {
                      name: "Non-Stick Cookware Set",
                      price: 1999,
                      image: "/api/placeholder/300/300",
                      category: "Home & Kitchen",
                      rating: 4.4,
                      discount: "8% OFF"
                    },
                    {
                      name: "Aloe Vera Face Cream",
                      price: 175,
                      image: "/api/placeholder/300/300",
                      category: "Personal Care",
                      rating: 4.3,
                      discount: "25% OFF"
                    },
                    {
                      name: "Cooking Oil 1L",
                      price: 165,
                      image: "/api/placeholder/300/300",
                      category: "Groceries",
                      rating: 4.8,
                      discount: "10% OFF"
                    }
                  ].map((product, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-6xl opacity-50">📦</span>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="mb-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-green-600">
                              ₹{product.price}
                            </span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>⭐</span>
                              <span className="ml-1">{product.rating}</span>
                            </div>
                          </div>

                          <Button className="w-full" size="sm">
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mt-12"
                >
                  <p className="text-muted-foreground mb-6">
                    Ready to start shopping? Browse all our products!
                  </p>
                  <Button size="lg" className="mr-4">
                    Shop Now
                  </Button>
                  <Button variant="outline" size="lg">
                    View Categories
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="api-products"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about shopping on YuvaKart
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {[
              {
                question: "How long does delivery take?",
                answer: "Delivery typically takes 3-7 business days depending on your location. Rural areas may take 5-10 days with tracking updates throughout."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept UPI payments only (Google Pay, PhonePe, Paytm, etc.). No credit/debit cards or net banking required."
              },
              {
                question: "Are your products genuine?",
                answer: "Yes! All products are sourced directly from authorized manufacturers and distributors with authenticity guarantee."
              },
              {
                question: "Can I track my order?",
                answer: "Absolutely! You'll receive tracking information via WhatsApp and can check order status on our website."
              },
              {
                question: "What is your return policy?",
                answer: "We offer returns within 7 days for damaged/defective products. Free return shipping for valid claims."
              },
              {
                question: "Is UPI payment safe?",
                answer: "Yes, UPI is RBI-regulated and bank-level secure. We never store your payment information."
              }
            ].map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {faq.answer}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Button asChild variant="outline">
              <Link href="/faq">
                View All FAQ
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-muted text-muted-foreground py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-primary mb-4">YuvaKart</h3>
              <p className="text-sm leading-relaxed">
                Smart Shopping, Easy Living for rural and semi-urban India. Your trusted partner for quality products and reliable service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                <li><Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-primary transition-colors">Customer Support</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
              <p className="text-sm mb-4">
                Follow us for updates, offers, and rural eCommerce insights.
              </p>
              <div className="flex space-x-3">
                <Badge variant="outline">📱 WhatsApp</Badge>
                <Badge variant="outline">📧 Email</Badge>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t border-border pt-8 text-center text-sm"
          >
            <p>&copy; 2025 YuvaKart. All rights reserved. Made with ❤️ for rural India.</p>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}
