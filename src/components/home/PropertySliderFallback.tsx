import React from 'react';
import { FaCog, FaLocationArrow } from 'react-icons/fa';

interface PropertySliderFallbackProps {
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  error: string | null;
  onRequestLocation: () => void;
}

export default function PropertySliderFallback({
  permission,
  error,
  onRequestLocation,
}: PropertySliderFallbackProps) {
  // Handle permanent denial (user selected "Never Allow")
  if (permission === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="max-w-lg">
          <FaCog className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Location Access Blocked
          </h3>
          <p className="text-gray-500 mb-4">
            Location access is currently blocked. To see properties near you, please enable location permissions in your browser settings, then Refresh the page.
          </p>
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong>Chrome:</strong> Settings → Privacy and security → Site settings → Location</p>
            <p><strong>Safari:</strong> Safari → Preferences → Websites → Location</p>
            <p><strong>Firefox:</strong> Settings → Privacy & Security → Permissions → Location</p>
          </div>
        </div>  
      </div>
    );
  }

  // Handle soft dismissal (user closed permission modal without choosing) or unknown state
  if (permission === 'prompt' || permission === 'unknown') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="max-w-md">
          <FaLocationArrow className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Enable Location Access
          </h3>
          <p className="text-gray-500 mb-4">
            To show you properties near your location, we need access to your location.
          </p>
        </div>
        
        <button
          onClick={onRequestLocation}
          className="cursor-pointer bg-primary-main text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          Allow Location Access
        </button>
      </div>
    );
  }

  return <p>{error}</p>;
}