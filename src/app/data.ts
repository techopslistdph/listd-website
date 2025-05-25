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
import agentImage from '../../public/images/agent.png';
import condo1 from '../../public/images/condo1.png';
import condo2 from '../../public/images/condo2.png';
import condo3 from '../../public/images/condo3.png';
import condo4 from '../../public/images/condo4.png';
import condo5 from '../../public/images/condo5.png';
import condo6 from '../../public/images/condo6.png';
import warehouse1 from '../../public/images/warehouse1.png';
import warehouse2 from '../../public/images/warehouse2.png';
import warehouse3 from '../../public/images/warehouse3.png';
import warehouse4 from '../../public/images/warehouse4.png';
import warehouse5 from '../../public/images/warehouse5.png';
import warehouse6 from '../../public/images/warehouse6.png';
import house1 from '../../public/images/house1.png';
import house2 from '../../public/images/house2.png';
import house3 from '../../public/images/house3.png';
import house4 from '../../public/images/house4.png';
import house5 from '../../public/images/house5.png';
import house6 from '../../public/images/house6.png';
import land1 from '../../public/images/land1.png';
import land2 from '../../public/images/land2.png';
import land3 from '../../public/images/land3.png';
import land4 from '../../public/images/land4.png';
import land5 from '../../public/images/land5.png';
import land6 from '../../public/images/land6.png';
import { StaticImageData } from 'next/image';

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

export const properties: Listing[] = [
  {
    id: 1,
    thumbnail: condo1.src,
    images: [condo1, condo2, condo3, condo4, condo5, condo6, condo1],
    tag: 'Condominium',
    status: 'For Lease',
    price: '₱ 2.5M',
    title: 'Luxury Skyline Residences',
    slug: 'luxury-skyline-residences',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '26 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Condominium 2 Storey in Club Laiya, Makati',
  },
  {
    id: 2,
    images: [condo2, condo1, condo3, condo4, condo5, condo6, condo1],
    tag: 'Condominium',
    price: '₱ 1.8M',
    status: 'Sold',
    thumbnail: condo1.src,
    title: 'The Grand Tower Suites',
    slug: 'the-grand-tower-suites',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '26 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Condominium 2 Storey in Club Laiya, Makati',
  },
  {
    id: 3,
    images: [condo3, condo2, condo1, condo4, condo5, condo6, condo1],
    tag: 'Condominium',
    status: 'Draft',
    thumbnail: condo1.src,
    price: '₱ 3.2M',
    title: 'Modern Heights Condominium',
    slug: 'modern-heights-condominium',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '26 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Condominium 2 Storey in Club Laiya, Makati',
  },
  {
    id: 4,
    images: [condo4, condo2, condo3, condo1, condo5, condo6, condo1],
    tag: 'Condominium',
    status: 'For Lease',
    thumbnail: condo1.src,
    price: '₱ 2.1M',
    title: 'Urban Living Spaces',
    slug: 'urban-living-spaces',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '26 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Condominium 2 Storey in Club Laiya, Makati',
  },
  {
    id: 5,
    images: [condo5, condo2, condo3, condo4, condo1, condo6, condo1],
    tag: 'Condominium',
    status: 'Sold',
    thumbnail: condo1.src,
    price: '₱ 2.8M',
    title: 'The Metropolitan View',
    slug: 'the-metropolitan-view',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '26 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Condominium 2 Storey in Club Laiya, Makati',
  },
  {
    id: 6,
    images: [condo6, condo2, condo3, condo4, condo5, condo1, condo1],
    tag: 'Condominium',
    status: 'Draft',
    thumbnail: condo1.src,
    price: '₱ 1.5M',
    title: 'City Center Residences',
    slug: 'city-center-residences',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '26 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Condominium 2 Storey in Club Laiya, Makati',
  },
  {
    id: 7,
    images: [
      warehouse1,
      warehouse2,
      warehouse3,
      warehouse4,
      warehouse5,
      warehouse6,
      warehouse1,
    ],
    tag: 'Warehouse',
    status: 'For Lease',
    thumbnail: warehouse1.src,
    price: '₱ 4.5M',
    title: 'Industrial Park Warehouse',
    slug: 'industrial-park-warehouse',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '26 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Port Access', 'Large Lot', 'High Ceiling', 'Office included'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Warehouse in Club Laiya, Makati',
  },
  {
    id: 8,
    images: [
      warehouse2,
      warehouse1,
      warehouse3,
      warehouse4,
      warehouse5,
      warehouse6,
      warehouse1,
    ],
    tag: 'Warehouse',
    price: '₱ 3.8M',
    status: 'Sold',
    thumbnail: warehouse1.src,
    title: 'Logistics Hub Center',
    slug: 'logistics-hub-center',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '26 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Port Access', 'Large Lot', 'High Ceiling', 'Office included'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Warehouse in Club Laiya, Makati',
  },
  {
    id: 9,
    images: [
      warehouse3,
      warehouse2,
      warehouse1,
      warehouse4,
      warehouse5,
      warehouse6,
      warehouse1,
    ],
    tag: 'Warehouse',
    status: 'Draft',
    thumbnail: warehouse1.src,
    price: '₱ 5.2M',
    title: 'Commercial Storage Facility',
    slug: 'commercial-storage-facility',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '26 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Port Access', 'Large Lot', 'High Ceiling', 'Office included'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Warehouse in Club Laiya, Makati',
  },
  {
    id: 10,
    images: [
      warehouse4,
      warehouse3,
      warehouse2,
      warehouse1,
      warehouse5,
      warehouse6,
      warehouse1,
    ],
    tag: 'Warehouse',
    status: 'For Lease',
    thumbnail: warehouse1.src,
    price: '₱ 4.1M',
    title: 'Distribution Center Complex',
    slug: 'distribution-center-complex',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '26 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Port Access', 'Large Lot', 'High Ceiling', 'Office included'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Warehouse in Club Laiya, Makati',
  },
  {
    id: 11,
    images: [
      warehouse5,
      warehouse4,
      warehouse3,
      warehouse2,
      warehouse1,
      warehouse6,
      warehouse1,
    ],
    tag: 'Warehouse',
    status: 'Sold',
    thumbnail: warehouse1.src,
    price: '₱ 3.5M',
    title: 'Industrial Storage Solutions',
    slug: 'industrial-storage-solutions',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '26 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Port Access', 'Large Lot', 'High Ceiling', 'Office included'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Warehouse in Club Laiya, Makati',
  },
  {
    id: 12,
    images: [
      warehouse6,
      warehouse5,
      warehouse4,
      warehouse3,
      warehouse2,
      warehouse1,
      warehouse1,
    ],
    tag: 'Warehouse',
    status: 'Draft',
    thumbnail: warehouse1.src,
    price: '₱ 4.8M',
    title: 'Business Park Warehouse',
    slug: 'business-park-warehouse',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '26 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Port Access', 'Large Lot', 'High Ceiling', 'Office included'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Warehouse in Club Laiya, Makati',
  },
  {
    id: 13,
    images: [house1, house2, house3, house4, house5, house6, house1],
    tag: 'House and Lot',
    status: 'For Lease',
    thumbnail: house1.src,
    price: '₱ 6.5M',
    title: 'Serene Valley Homes',
    slug: 'serene-valley-homes',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '824 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New House and Lot in Club Laiya, Makati',
  },
  {
    id: 14,
    images: [house2, house1, house3, house4, house5, house6, house1],
    tag: 'House and Lot',
    status: 'Sold',
    thumbnail: house1.src,
    price: '₱ 5.8M',
    title: 'Green Meadows Estate',
    slug: 'green-meadows-estate',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '824 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New House and Lot in Club Laiya, Makati',
  },
  {
    id: 15,
    images: [house3, house2, house1, house4, house5, house6, house1],
    tag: 'House and Lot',
    status: 'Draft',
    thumbnail: house1.src,
    price: '₱ 7.2M',
    title: 'Sunset Hills Residence',
    slug: 'sunset-hills-residence',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '824 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New House and Lot in Club Laiya, Makati',
  },
  {
    id: 16,
    images: [house4, house3, house2, house1, house5, house6, house1],
    tag: 'House and Lot',
    status: 'For Lease',
    thumbnail: house1.src,
    price: '₱ 6.1M',
    title: 'Pine Grove Villas',
    slug: 'pine-grove-villas',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '824 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New House and Lot in Club Laiya, Makati',
  },
  {
    id: 17,
    images: [house5, house4, house3, house2, house1, house6, house1],
    tag: 'House and Lot',
    status: 'Sold',
    thumbnail: house1.src,
    price: '₱ 5.5M',
    title: 'Mountain View Homes',
    slug: 'mountain-view-homes',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '824 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New House and Lot in Club Laiya, Makati',
  },
  {
    id: 18,
    images: [house6, house5, house4, house3, house2, house1, house1],
    tag: 'House and Lot',
    status: 'Draft',
    thumbnail: house1.src,
    price: '₱ 6.8M',
    title: 'Lakeside Gardens',
    slug: 'lakeside-gardens',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [
      { bedrooms: 1 },
      { baths: 1 },
      { area: '824 sqm' },
      { 'fully furnished': true },
      { parking: true },
      { 'facing west': true },
    ],
    isVerified: true,
    features: ['Balcony', 'Bath Tub', 'High Ceiling', 'Walk In Closet'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New House and Lot in Club Laiya, Makati',
  },
  {
    id: 19,
    images: [land1, land2, land3, land4, land5, land6, land1],
    tag: 'Land',
    price: '₱ 8.5M',
    status: 'For Lease',
    thumbnail: land1.src,
    title: 'Prime Development Land',
    slug: 'prime-development-land',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '824 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Quiet Community', 'Clean title', 'Ready to build'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Land in Club Laiya, Makati',
  },
  {
    id: 20,
    images: [land2, land1, land3, land4, land5, land6, land1],
    tag: 'Land',
    price: '₱ 7.8M',
    status: 'Sold',
    thumbnail: land1.src,
    title: 'Agricultural Investment Property',
    slug: 'agricultural-investment-property',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '824 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Quiet Community', 'Clean title', 'Ready to build'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Land in Club Laiya, Makati',
  },
  {
    id: 21,
    images: [land3, land2, land1, land4, land5, land6, land1],
    tag: 'Land',
    price: '₱ 9.2M',
    status: 'Draft',
    thumbnail: land1.src,
    title: 'Commercial Development Site',
    slug: 'commercial-development-site',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '824 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Quiet Community', 'Clean title', 'Ready to build'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Land in Club Laiya, Makati',
  },
  {
    id: 22,
    images: [land4, land3, land2, land1, land5, land6, land1],
    tag: 'Land',
    price: '₱ 8.1M',
    status: 'For Lease',
    thumbnail: land1.src,
    title: 'Residential Land Parcel',
    slug: 'residential-land-parcel',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '824 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Quiet Community', 'Clean title', 'Ready to build'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Land in Club Laiya, Makati',
  },
  {
    id: 23,
    images: [land5, land4, land3, land2, land1, land6, land1],
    tag: 'Land',
    price: '₱ 7.5M',
    title: 'Investment Property Lot',
    status: 'Sold',
    thumbnail: land1.src,
    slug: 'investment-property-lot',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '824 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Quiet Community', 'Clean title', 'Ready to build'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Land in Club Laiya, Makati',
  },
  {
    id: 24,
    images: [land6, land5, land4, land3, land2, land1, land1],
    tag: 'Land',
    price: '₱ 8.8M',
    title: 'Future Development Land',
    status: 'Draft',
    thumbnail: land1.src,
    slug: 'future-development-land',
    location: 'Club Laiya, Brgy, San Juan, Batangas',
    description: [{ area: '824 sqm' }, { parking: 2 }, { 'facing west': true }],
    isVerified: true,
    features: ['Quiet Community', 'Clean title', 'Ready to build'],
    googleMap:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3854.579724467531!2d120.89017737577106!3d14.960490285569627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fffe81226745%3A0xd61662a7648edf6b!2sSM%20Baliwag%2C%20Do%C3%B1a%20Remedios%20Trinidad%20Hwy%2C%20Pagala%2C%20Baliwag%2C%203006%20Bulacan!5e0!3m2!1sen!2sph!4v1747800483553!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    agent: {
      name: 'Danica Ong',
      image: agentImage,
      whatsapp: '09123456789',
      email: 'danica.ong@example.com',
      isVerified: true,
      position: 'Sales Person',
    },
    descriptionText: 'A Brand New Land in Club Laiya, Makati',
  },
];

export interface Listing {
  id: number;
  images: StaticImageData[];
  thumbnail: string;
  status: string;
  price: string;
  title: string;
  location: string;
  googleMap: string;
  agent: {
    name: string;
    image: StaticImageData;
    whatsapp: string;
    email: string;
    isVerified: boolean;
    position: string;
  };
  description: Record<string, string | number | boolean | undefined>[];
  isVerified: boolean;
  features?: string[];
  descriptionText?: string;
  slug: string;
  tag: string;
}
