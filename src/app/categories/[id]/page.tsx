'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApiService, Category, Product } from '@/lib/api';
import { ArrowLeft, Package, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';

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

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategoryAndProducts();
  }, [categoryId]);

  const loadCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load category details
      const categories = await ApiService.getCategories();
      const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));

      if (!currentCategory) {
        setError('Category not found');
        return;
      }

      setCategory(currentCategory);

      // Load products for this category
      const categoryProducts = await ApiService.getProducts(parseInt(categoryId));
      setProducts(categoryProducts);

    } catch (err) {
      console.error('Error loading category:', err);
      setError(`Failed to load category: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !category) {
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
                {error || 'Category Not Found'}
              </CardTitle>
              <CardDescription>
                The category you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full mb-4">
                <Link href="/categories">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </>
    );
  }

  const displayData = getCategoryDisplayData(category);

  return (
    <>
      <Header />

      {/* Category Header */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-4"
          >
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/categories">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-24 h-24 ${displayData.colorClass} rounded-2xl flex items-center justify-center text-5xl border-4 shadow-xl`}
            >
              {displayData.icon}
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                {category.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-white/90 mb-4"
              >
                {category.description || `Explore our ${category.name.toLowerCase()} collection`}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">{products.length} Products</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Available Now
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {category.name} Products
              </h2>
              <p className="text-muted-foreground">
                Discover amazing {category.name.toLowerCase()} products
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/categories">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Categories
                </Link>
              </Button>
              <Button asChild>
                <Link href="/cart">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View Cart
                </Link>
              </Button>
            </div>
          </motion.div>

          {products.length > 0 ? (
            <motion.div
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
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're working on adding amazing {category.name.toLowerCase()} products to this category.
                Check back soon for exciting new arrivals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/categories">
                    Browse Other Categories
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">
                    Notify Me When Available
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore More Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover products from other categories that might interest you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">View All Categories</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
