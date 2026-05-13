import { Testimonial, FAQ } from '../types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "Sapphire Barbers",
    role: 'Owner',
    company: 'Sams Barbers',
    content: 'Since switching to Tappy-Out NFC cards, it’s made a serious difference. Clients can book appointments or follow our Instagram instantly. No more explaining usernames or handing out paper cards that get lost. It just works.',
    rating: 5,
    avatar: '/images/avatars/sarah.jpg'
  },
  {
    id: '2',
    name: 'CoElectrical',
    role: 'Sales Manager',
    company: 'CoElectrical',
    content: 'We use Tappy-Out cards on every job now. It makes us look more professional and customers are impressed straight away. It’s a simple thing but it gives a strong first impression and helps bring in repeat work.',
    rating: 5,
    avatar: '/images/avatars/michael.jpg'
  },
  {
    id: '3',
    name: 'Independent Business Owner',
    role: 'Owner',
    company: 'Global Innovations',
    content: 'I didn’t realise how much time I was wasting with normal business cards until I switched. Now everything is done in seconds. People actually engage more, and I’ve noticed more traffic to my page.',
    rating: 5,
    avatar: '/images/avatars/emily.jpg'
  }
];

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'What is NFC technology and how does it work?',
    answer: 'NFC (Near Field Communication) is a wireless technology that allows devices to communicate when they are in close proximity. Simply tap your NFC card against any NFC-enabled smartphone to instantly share your contact information.',
    category: 'Technology'
  },
  {
    id: '2',
    question: 'Are NFC business cards compatible with all smartphones?',
    answer: 'Yes, NFC cards work with all modern smartphones (iPhone and Android) that have NFC capabilities. This includes virtually all smartphones released in the last 5 years.',
    category: 'Compatibility'
  },
  {
    id: '3',
    question: 'How do I customize my NFC business card?',
    answer: 'Use our intuitive design tool to upload your logo, adjust positioning, and preview your card in real-time. You can customize colors, text, and branding elements to match your professional image.',
    category: 'Customization'
  },
  {
    id: '4',
    question: 'What information can I share with my NFC card?',
    answer: 'You can share contact details, social media profiles, website links, portfolio, calendar booking links, and virtually any digital information you want to make easily accessible.',
    category: 'Features'
  },
  {
    id: '5',
    question: 'How long do NFC cards last?',
    answer: 'Our NFC cards are built to last. Standard cards have a 5-year lifespan, while premium and luxury cards come with lifetime warranties and are designed for decades of use.',
    category: 'Durability'
  },
  {
    id: '7',
    question: 'What is your shipping and return policy?',
    answer: 'We offer free shipping on orders over €50. Standard shipping takes 3-5 business days, express shipping 1-2 days. We have a 30-day return policy for unused cards.',
    category: 'Shipping'
  },
  {
    id: '8',
    question: 'Do you offer bulk discounts for businesses?',
    answer: 'Yes, we offer volume discounts starting at 25 cards. Contact our sales team for custom pricing on large orders and corporate packages.',
    category: 'Pricing'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Choose Your Card',
    description: 'Select from our range of standard, premium, or luxury business cards.',
    icon: 'CreditCard'
  },
  {
    step: 2,
    title: 'Customize Design',
    description: 'Upload your logo and customize the design using our intuitive design tool.',
    icon: 'Palette'
  },
  {
    step: 3,
    title: 'Provide Your Profile',
    description: 'Provide us with a link to your digital profile or a link to your Instagram or any other social media.',
    icon: 'User'
  },
  {
    step: 4,
    title: 'Start Networking',
    description: 'Simply tap your card on any smartphone to instantly share your information.',
    icon: 'Zap'
  }
];

export const FEATURES = [
  {
    title: 'Instant Contact Sharing',
    description: 'Share your complete contact information with a simple tap on any NFC-enabled device.',
    icon: 'Share'
  },
  {
    title: 'Premium Materials',
    description: 'Choose from durable PVC, or elegant wood with more coming soon.',
    icon: 'Award'
  },
  {
    title: 'Custom Design Tool',
    description: 'Personalize your cards with our easy-to-use design interface and real-time preview.',
    icon: 'Paintbrush'
  },
  {
    title: 'Always Up-to-Date',
    description: 'Update your digital profile anytime without needing to reprint your physical cards.',
    icon: 'RefreshCw'
  },
  {
    title: 'Eco-Friendly',
    description: 'Reduce paper waste with digital contact sharing and sustainable material options.',
    icon: 'Leaf'
  }
];