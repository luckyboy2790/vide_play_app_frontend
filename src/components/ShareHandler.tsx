
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the app was opened via a share intent
    const handleShare = () => {
      if (navigator.share) {
        // Handle Web Share API
        console.log('Web Share API available');
      }

      // Check URL parameters for shared content
      const urlParams = new URLSearchParams(window.location.search);
      const sharedUrl = urlParams.get('url');
      const sharedText = urlParams.get('text');
      
      if (sharedUrl || sharedText) {
        // Determine platform based on URL
        let platform = 'social';
        if (sharedUrl?.includes('twitter.com') || sharedUrl?.includes('x.com')) {
          platform = 'Twitter';
        } else if (sharedUrl?.includes('instagram.com')) {
          platform = 'Instagram';
        } else if (sharedUrl?.includes('facebook.com')) {
          platform = 'Facebook';
        }

        // Navigate to shared play preview
        const params = new URLSearchParams({
          video_url: sharedUrl || '',
          caption: sharedText || '',
          platform: platform,
        });
        
        navigate(`/shared-play-preview?${params.toString()}`);
      }
    };

    handleShare();
  }, [navigate]);

  return null;
};

export default ShareHandler;
