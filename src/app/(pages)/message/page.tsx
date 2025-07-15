import Conversations from '@/components/message/Conversations';
import { getConversations } from '@/lib/queries/server/messaging';
import React from 'react';

export default async function page() {
  const [conversations] = await Promise.all([getConversations(1, 10)]);

  return <Conversations conversations={conversations?.data} />;
}
