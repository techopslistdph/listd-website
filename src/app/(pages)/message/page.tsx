'use client';
import React, { useState } from 'react';
import Chat from '@/components/message/Chat';

// Mock data
const conversations = [
  {
    id: '1',
    property: {
      name: 'The Rise Makati',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96',
    },
    lastMessage: 'Kristine: Hi Syrill, Good,morning!...',
    lastDate: '00/00/00',
    messages: [
      {
        id: '1',
        text: 'Hi is this available??',
        time: '2:55 PM',
        isMe: true,
      },
      {
        id: '2',
        text: 'Hi Syrill, good morning! The total amount shown in the booking form is all you need to pay. Other charges will be for use of the pool (amenities) and parking, which are paid separately and directly to the cashier at the premise. Unfortunately, the dates you inquired about are no longer available. Would you like assistance in finding a unit for today or for alternative dates? Please let me know your preferences, and Ill be happy to help!',
        time: '2:55 PM',
        isMe: false,
      },
    ],
    user: {
      name: 'Danica Ong',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
    },
    propertyDetails: {
      name: 'Cocoons (at club laiya)',
      location: 'Club Laiya, Brgy, San Juan, Batangas',
      size: '540.0 sqm',
      price: '₱1,900,000',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96',
    },
  },
  // Add more mock conversations as needed
  {
    id: '2',
    property: {
      name: 'Avida Towers Riala',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=96&h=96',
    },
    lastMessage: 'Kristine: Hi Syrill, Good,morning!...',
    lastDate: '00/00/00',
    messages: [],
    user: {
      name: 'Danica Ong',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
    },
    propertyDetails: {
      name: 'Avida Towers Riala',
      location: 'IT Park, Cebu City',
      size: '32.0 sqm',
      price: '₱2,500,000',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=96&h=96',
    },
  },
];

export default function MessagePage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className='container max-w-[1300px] mx-auto'>
      {/* Chat Component */}
      <Chat
        conversations={conversations}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selected={selected}
      />
    </div>
  );
}
