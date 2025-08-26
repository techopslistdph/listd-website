import { toast } from 'sonner';

export const handleShareProperty = async (
  title: string,
  location: string,
  listingPriceFormatted: string
) => {
  const shareUrl = window.location.href;
  const shareText = `Check out this property: ${title} - ${location} for ${listingPriceFormatted}`;

  // Try to use Web Share API first (mobile devices)
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      // You could add a toast notification here
      toast.success('Property link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${shareText}\n\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Property link copied to clipboard!');
    }
  }
};
