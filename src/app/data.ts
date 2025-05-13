import valuation1 from '../../public/images/valuation-1.png';
import valuation2 from '../../public/images/valuation-2.png';
import feature1 from '../../public/images/property-listing.png';
import feature2 from '../../public/images/interactive-map-search.png';
import location1 from '../../public/images/location-1.png';
import location2 from '../../public/images/location-2.png';
import location3 from '../../public/images/location-3.png';
import location4 from '../../public/images/location-4.png';
import avatar1 from '../../public/images/customer-image.png';
import facebook from '../../public/images/social/facebook.svg';
import instagram from '../../public/images/social/instagram.svg';
import twitter from '../../public/images/social/twitter.svg';
import linkedin from '../../public/images/social/linkedin.svg';
import googleplay from '../../public/images/googleplay.png';
import appstore from '../../public/images/appstore.png';

export const navigationlinks = [
  {
    label: 'Buy',
    href: '/buy',
  },
  {
    label: 'Rent',
    href: '/rent',
  },
  {
    label: 'Sell',
    href: '/sell',
  },
  {
    label: 'Valuation',
    href: '/valuation',
  },
];

export const valuationCards = [
  {
    image: valuation1,
    title: "Find out your home's value, instantly",
    description:
      'The simple, free, no-obligation way to request an accurate valuation of your home from estate and letting agents who are experts in your local area.',
    button: 'Start Valuation',
  },
  {
    image: valuation2,
    title: "Find out your home's value, instantly",
    description:
      'The simple, free, no-obligation way to request an accurate valuation of your home from estate and letting agents who are experts in your local area.',
    button: 'Start Valuation',
  },
];

export const featureCards = [
  {
    image: feature1,
    icon: '/icons/listing.svg',
    title: 'Extensive Property Listings',
    description:
      'Browse a wide range of residential properties across the Philippines, complete with detailed descriptions, high-quality images, and essential information to aid your decision-making.',
    align: 'right',
  },
  {
    image: feature2,
    icon: '/icons/map.svg',
    title: 'Interactive Map Search',
    description:
      'Utilize our intuitive map feature to locate properties in your preferred areas, explore neighborhoods, and find homes that meet your criteria.',
    align: 'left',
  },
  {
    image: feature1,
    icon: '/icons/listing.svg',
    title: 'Free AVM Tool',
    description:
      "Access our Automated Valuation Model to receive instant property value estimates, helping you make informed decisions whether you're buying or selling.",
    align: 'right',
  },
  {
    image: feature2,
    icon: '/icons/listing.svg',
    title: 'Easy Property Listing',
    description:
      'List your property for rent or sale with our streamlined process. Our platform makes it simple to showcase your property to potential buyers and renters across the Philippines.',
    align: 'left',
  },
];

export const propertySliderCards = [
  {
    image: location1,
    price: '₱1.92M',
    title: 'Cocoons (at Club Laiya)',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: '',
  },
  {
    image: location2,
    price: '₱1.92M',
    title: 'Cocoons (at Club Laiya)',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: '',
  },
  {
    image: location3,
    price: '₱1.92M',
    title: 'Cocoons (at Club Laiya)',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: '',
  },
  {
    image: location4,
    price: '₱1.92M',
    title: 'Cocoons (at Club Laiya)',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: '',
  },
];

export const testimonialCards = [
  {
    avatar: avatar1,
    name: 'Barbara D. Smith',
    rating: 4,
    testimonial:
      "I highly recommend Jodi J. Appleby. She was attentive to our needs and worked tirelessly to find us the perfect home. We couldn't be happier with our new place!",
  },
  {
    avatar: avatar1,
    name: 'Michael R. Johnson',
    rating: 5,
    testimonial:
      'The service was outstanding! Every step of the process was smooth and stress-free. I found my dream home much faster than I expected.',
  },
  {
    avatar: avatar1,
    name: 'Samantha Lee',
    rating: 5,
    testimonial:
      'Professional, friendly, and always available to answer my questions. I felt supported throughout my entire home buying journey.',
  },
  {
    avatar: avatar1,
    name: 'Carlos Mendoza',
    rating: 4,
    testimonial:
      'Great experience from start to finish. The team really listened to my needs and helped me find the perfect property.',
  },
  {
    avatar: avatar1,
    name: 'Emily Chen',
    rating: 5,
    testimonial:
      'I was impressed by the attention to detail and the dedication of the staff. Highly recommended for anyone looking to buy or sell!',
  },
  {
    avatar: avatar1,
    name: 'David Kim',
    rating: 4,
    testimonial:
      'Excellent communication and very knowledgeable agents. I would definitely use their services again in the future.',
  },
];

export const footerLinks = [
  {
    section: 'SELL A HOME',
    links: [
      { label: 'Request an offer', href: '/sell/request-offer' },
      { label: 'Pricing', href: '/sell/pricing' },
      { label: 'Reviews', href: '/sell/reviews' },
      { label: 'Stories', href: '/sell/stories' },
    ],
  },
  {
    section: 'BUY, RENT AND SELL',
    links: [
      { label: 'Buy and sell properties', href: '/buy-sell' },
      { label: 'Rent home', href: '/rent' },
      { label: 'Builder trade-up', href: '/builder-trade-up' },
    ],
  },
  {
    section: 'ABOUT',
    links: [
      { label: 'Company', href: '/about/company' },
      { label: 'How it works', href: '/about/how-it-works' },
      { label: 'Contact', href: '/about/contact' },
      { label: 'Investors', href: '/about/investors' },
    ],
  },
  {
    section: 'BUY A HOME',
    links: [
      { label: 'Buy', href: '/buy' },
      { label: 'Finance', href: '/buy/finance' },
    ],
  },

  {
    section: 'TERMS & PRIVACY',
    links: [
      { label: 'Trust & Safety', href: '/trust-safety' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export const footerAppButtons = [
  {
    src: googleplay,
    alt: 'Google Play',
    href: '#',
  },
  {
    src: appstore,
    alt: 'App Store',
    href: '#',
  },
];

export const footerSocials = [
  { icon: facebook, href: '#' },
  { icon: instagram, href: '#' },
  { icon: twitter, href: '#' },
  { icon: linkedin, href: '#' },
];
