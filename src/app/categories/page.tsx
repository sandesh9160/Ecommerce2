'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApiService, Category } from '@/lib/api';
import { ShoppingBag, Package, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
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
    scale: 1.05,
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('Loading categories...');
      const categoriesData = await ApiService.getCategories();
      console.log('Categories loaded:', categoriesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(`Failed to load categories: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Static category icons and colors for better UX
  const getCategoryDisplayData = (category: Category) => {
    const iconMap: Record<string, string> = {
      'Electronics': '📱',
      'Books': '📚',
      'Fashion': '👕',
      'Home & Kitchen': '🏠',
      'Sports': '⚽',
      'Beauty': '💄',
    };

    const colorMap: Record<string, string> = {
      'Electronics': 'bg-blue-100 text-blue-600 border-blue-200',
      'Books': 'bg-purple-100 text-purple-600 border-purple-200',
      'Fashion': 'bg-pink-100 text-pink-600 border-pink-200',
      'Home & Kitchen': 'bg-green-100 text-green-600 border-green-200',
      'Sports': 'bg-orange-100 text-orange-600 border-orange-200',
      'Beauty': 'bg-rose-100 text-rose-600 border-rose-200',
    };

    return {
      icon: iconMap[category.name] || '📦',
      colorClass: colorMap[category.name] || 'bg-gray-100 text-gray-600 border-gray-200',
    };
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
              <CardTitle className="text-red-600 flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Oops!
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadCategories} className="w-full">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Shop by Category
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
            >
              Discover amazing products across all our categories. From electronics to fashion, find everything you need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-8 mb-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold">{categories.length}</div>
                <div className="text-white/80">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-white/80">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/80">Support</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((category, index) => {
              const displayData = getCategoryDisplayData(category);
              return (
                <motion.div
                  key={`category-${index}-${category.name}-${category.id || 'api'}`}
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <Link href={`/categories/${category.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 group cursor-pointer">
                      <CardHeader className="text-center pb-4">
                        <motion.div
                          whileHover={{
                            scale: 1.2,
                            rotate: [0, -10, 10, 0],
                            transition: { duration: 0.3 }
                          }}
                          className={`w-20 h-20 mx-auto mb-4 ${displayData.colorClass} rounded-full flex items-center justify-center text-4xl border-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                        >
                          {displayData.icon}
                        </motion.div>
                        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="px-3 py-1">
                            <Package className="w-3 h-3 mr-1" />
                            Browse Products
                          </Badge>
                          <Badge variant="outline" className="px-3 py-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        </div>

                        <Button className="w-full group-hover:bg-primary/90 transition-colors" size="lg">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Shop {category.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {categories.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Categories Found</h3>
              <p className="text-muted-foreground mb-4">
                We're working on adding more categories. Check back soon!
              </p>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse all our products or contact our support team for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/" className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Browse All Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact" className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Get Help
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
