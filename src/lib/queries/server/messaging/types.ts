import { PropertyDetail } from '../propety/type';

export interface Conversation {
  id: string;
  propertyId: string;
  propertyData: PropertyDetail;

  participant: Participant;
  initiator: Participant;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  profile?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    name: string;
    profile?: string;
    email?: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  propertyId: string;
  participantId: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface MarkMessageReadRequest {
  messageIds: string[];
}

// Response types
export interface ConversationResponse {
  success: boolean;
  data: Conversation;
  message: string;
}

export interface ConversationListResponse {
  success: boolean;
  data: Conversation[];
  message: string;
  meta: PaginationMeta;
}

export interface MessageResponse {
  success: boolean;
  data: Message;
  message: string;
}

export interface MessageListResponse {
  success: boolean;
  data: Message[];
  message: string;
  meta: PaginationMeta;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}
