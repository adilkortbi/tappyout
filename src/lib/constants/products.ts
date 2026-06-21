import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'standard-black',
    name: 'Standard Black PVC Card',
    description: 'Sleek black business card with NFC technology for seamless contact sharing.',
    price: 17.99,
    image1: 'https://images2.imgbox.com/3d/7a/HgTpHCd1_o.png',
    image2: 'https://images2.imgbox.com/3d/7a/HgTpHCd1_o.png',
    features: [
      'Durable PVC Material',
      'Custom Logo Printing',
      'Contact Sharing',
      'Social Media Links'
    ],
    category: 'standard'
  },
  {
    id: 'standard-white',
    name: 'Standard White PVC Card',
    description: 'Luxurious business card with advanced NFC chip technology.',
    price: 17.99,
    image1: 'https://images2.imgbox.com/5b/11/72I3a8GK_o.png',
    image2: 'https://images2.imgbox.com/5b/11/72I3a8GK_o.png',
    features: [
      'Durable PVC Material',
      'Custom Logo Printing',
      'Contact Sharing',
      'Social Media Links'
    ],
    category: 'standard'
  },
  {
    id: 'premium-wood',
    name: 'Premium Wood Business Card',
    description: 'Eco-friendly wooden business card with embedded NFC technology.',
    price: 17.99,
    image1: 'https://images2.imgbox.com/35/9e/dBSl2Bwn_o.png',
    image2: 'https://images2.imgbox.com/35/9e/dBSl2Bwn_o.png',
    features: [
      'Sustainable Wood Material',
      'Laser Engraving',
      'Unique Grain Pattern',
      'Eco-Friendly Packaging'
    ],
    category: 'premium'
  }
];