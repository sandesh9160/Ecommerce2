'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface ShipmentForm {
  awb_number: string;
  courier_partner: string;
  tracking_url: string;
  estimated_delivery: string;
  shipment_notes: string;
}

function CreateShipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<ShipmentForm>({
    awb_number: '',
    courier_partner: 'Delhivery',
    tracking_url: '',
    estimated_delivery: '',
    shipment_notes: ''
  });
  const [errors, setErrors] = useState<Partial<ShipmentForm>>({});

  useEffect(() => {
    if (orderId) {
      loadOrder(parseInt(orderId));
    } else {
      router.push('/admin/orders');
    }
  }, [orderId, router]);

  const loadOrder = async (id: number) => {
    try {
      setLoading(true);
      // Mock order data - in production, fetch from API
      const mockOrder: Order = {
        id: id,
        customer_name: 'Rajesh Kumar',
        customer_phone: '+91 9876543210',
        customer_email: 'rajesh@example.com',
        shipping_address: '123 Main Street, Village Name, District, State - 123456',
        total_amount: 1250,
        order_status: 'payment_verified',
        payment_status: 'verified',
        items: [
          { id: 1, product_name: 'Samsung Mobile Phone', quantity: 1, price: 1200 }
        ]
      };
      setOrder(mockOrder);

      // Auto-generate AWB number
      const awbNumber = `DEL${Date.now().toString().slice(-8)}`;
      setFormData(prev => ({
        ...prev,
        awb_number: awbNumber,
        tracking_url: `https://www.delhivery.com/track/package/${awbNumber}`
      }));

    } catch (error) {
      console.error('Error loading order:', error);
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShipmentForm> = {};

    if (!formData.awb_number.trim()) {
      newErrors.awb_number = 'AWB number is required';
    }

    if (!formData.courier_partner.trim()) {
      newErrors.courier_partner = 'Courier partner is required';
    }

    if (!formData.estimated_delivery) {
      newErrors.estimated_delivery = 'Estimated delivery date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShipmentForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCreateShipment = async () => {
    if (!validateForm() || !order) {
      return;
    }

    setCreating(true);
    try {
      // In production, call Delhivery API to create shipment
      // For MVP, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update order status to shipped
      // In production, call backend API

      router.push(`/admin/orders/${order.id}?shipment_created=true`);

    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Failed to create shipment. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"
        />
    </div>
  );
}

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Order Not Found</CardTitle>
            <CardDescription>The specified order could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Shipment</h1>
              <p className="text-sm text-gray-600">Order #{order.id} - {order.customer_name}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Shipment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Order ID</p>
                    <p className="font-mono">#{order.id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Payment Status</p>
                    <Badge variant="default">Verified</Badge>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Order Status</p>
                    <Badge variant="secondary">Payment Verified</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity} × {item.product_name}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Details Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipment Details
                </CardTitle>
                <CardDescription>
                  Configure shipping information for this order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      AWB Number *
                    </label>
                    <Input
                      value={formData.awb_number}
                      onChange={(e) => handleInputChange('awb_number', e.target.value)}
                      placeholder="Enter AWB number"
                      className={errors.awb_number ? 'border-red-500' : ''}
                    />
                    {errors.awb_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.awb_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Courier Partner *
                    </label>
                    <select
                      value={formData.courier_partner}
                      onChange={(e) => handleInputChange('courier_partner', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Delhivery">Delhivery</option>
                      <option value="DTDC">DTDC</option>
                      <option value="BlueDart">BlueDart</option>
                      <option value="FedEx">FedEx</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tracking URL
                  </label>
                  <Input
                    value={formData.tracking_url}
                    onChange={(e) => handleInputChange('tracking_url', e.target.value)}
                    placeholder="Enter tracking URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Delivery Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.estimated_delivery}
                    onChange={(e) => handleInputChange('estimated_delivery', e.target.value)}
                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={errors.estimated_delivery ? 'border-red-500' : ''}
                  />
                  {errors.estimated_delivery && (
                    <p className="text-red-500 text-sm mt-1">{errors.estimated_delivery}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipment Notes (Optional)
                  </label>
                  <Textarea
                    value={formData.shipment_notes}
                    onChange={(e) => handleInputChange('shipment_notes', e.target.value)}
                    placeholder="Any special handling instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer_phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>

                {order.customer_email && (
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.customer_email}</p>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {order.shipping_address}
                </p>
              </CardContent>
            </Card>

            {/* Shipment Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Checklist</CardTitle>
                <CardDescription>
                  Ensure everything is ready before creating shipment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Payment verified</span>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Order items packed</span>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Address verified</span>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">AWB number generated</span>
                </div>

                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Courier pickup scheduled</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCreateShipment}
                disabled={creating}
                className="w-full h-12"
                size="lg"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Shipment...
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5 mr-2" />
                    Create Shipment
                  </>
                )}
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href={`/admin/orders/${order.id}`}>
                  Cancel
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure all items are properly packed</li>
                <li>• Double-check delivery address</li>
                <li>• Customer will receive WhatsApp update</li>
                <li>• Tracking information will be shared</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Export with SSR disabled to prevent hydration errors with useSearchParams
export default dynamic(() => Promise.resolve(CreateShipmentPage), {
  ssr: false,
});
