'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ApiService } from '@/lib/api';
import { ShoppingBag, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await ApiService.register({
        username: formData.email, // Use email as username
        email: formData.email,
        first_name: formData.name.split(' ')[0],
        last_name: formData.name.split(' ').slice(1).join(' '),
        phone: formData.phone,
        password: formData.password,
        password_confirm: formData.confirmPassword,
      });

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8"
        >
          {/* Logo/Brand */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <ShoppingBag className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Join YuvaKart</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account and start shopping
            </p>
          </motion.div>

          {/* Register Form */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </motion.div>

                  {/* Phone Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        placeholder="Create a password (min 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        </motion.div>
                      ) : null}
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Register Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <span className="mr-2">📱</span>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <span className="mr-2">📘</span>
                    Facebook
                  </Button>
                </div>

                {/* Login Link */}
                <motion.div variants={itemVariants} className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Terms */}
          <motion.div variants={itemVariants} className="text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex justify-center flex-wrap gap-2 mt-8">
              <Badge variant="outline" className="flex items-center gap-1">
                🆓 Free Registration
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                🚚 Free Delivery
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                🎁 Welcome Offers
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
