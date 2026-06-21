export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image1: string;
  image2: string;
  features: string[];
  category: 'standard' | 'premium' | 'luxury';
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    logo?: File;
    logoPosition?: { x: number; y: number };
    logoSize?: { width: number; height: number };
    logoRotation?: number;
    nfcUrl?: string;
    canvasDesign?: object;
    canvasImage?: string; // Base64 data URL of the customized card design
    logoImage?: string; // Base64 data URL of the original logo
  };
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  shippingAddress: Address;
  paymentIntent?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}