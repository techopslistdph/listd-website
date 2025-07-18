import { PropertyDetail } from '../queries/server/propety/type';

export interface DraftConversation {
  propertyId: string;
  propertyOwnerId: string;
  propertyOwnerName: string;
  propertyOwnerEmail: string;
  propertyOwnerProfile: string;
  property: PropertyDetail;
  timestamp: number;
}

const DRAFT_CONVERSATION_KEY = 'draft_conversation';

export const draftConversation = (
  propertyOwner: {
    id: string;
    name: string;
    email: string;
    profile: string;
  },
  property: PropertyDetail
) => {
  const propertyId = property.property?.id;
  if (!propertyId) {
    console.error('Property ID not found in property detail');
    return;
  }

  if (!propertyOwner) {
    console.error('Property Owner is not provided');
    return;
  }

  const draftData: DraftConversation = {
    propertyId,
    propertyOwnerId: propertyOwner.id,
    propertyOwnerName: propertyOwner.name,
    propertyOwnerEmail: propertyOwner.email,
    propertyOwnerProfile: propertyOwner.profile || '',
    property,
    timestamp: Date.now(),
  };

  localStorage.setItem(DRAFT_CONVERSATION_KEY, JSON.stringify(draftData));
};

export const getDraftConversation = (): DraftConversation | null => {
  try {
    const draft = localStorage.getItem(DRAFT_CONVERSATION_KEY);

    if (!draft) return null;

    const parsed = JSON.parse(draft) as DraftConversation;

    // Validate required IDs
    if (
      !parsed.propertyId ||
      !parsed.propertyOwnerId ||
      !parsed.propertyOwnerName ||
      !parsed.propertyOwnerEmail ||
      !parsed.property
    ) {
      console.error('Draft conversation missing required IDs');
      clearDraftConversation();
      return null;
    }

    // Check if draft is too old (optional: expire after 24 hours)

    if (typeof parsed.timestamp !== 'number') {
      console.error('Invalid timestamp in draft conversation');
      clearDraftConversation();
      return null;
    }

    const diff = Date.now() - parsed.timestamp;
    const isExpired = diff > 24 * 60 * 60 * 1000;

    if (isExpired) {
      clearDraftConversation();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error getting draft conversation:', error);
    return null;
  }
};

export const clearDraftConversation = () => {
  localStorage.removeItem(DRAFT_CONVERSATION_KEY);
};

export const hasDraftConversation = (): boolean => {
  return getDraftConversation() !== null;
};

// Helper function to get just the IDs for API calls
export const getDraftConversationIds = (): {
  propertyId: string;
  propertyOwnerId: string;
} | null => {
  const draft = getDraftConversation();
  if (!draft) return null;

  return {
    propertyId: draft.propertyId,
    propertyOwnerId: draft.propertyOwnerId,
  };
};
