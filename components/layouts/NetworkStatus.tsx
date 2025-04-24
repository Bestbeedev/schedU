'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const NetworkStatusListener = () => {
  const offlineToastId = useRef<string | number | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      if (offlineToastId.current !== null) {
        toast.dismiss(offlineToastId.current); // Ferme le toast "offline"
        offlineToastId.current = null;
      }

      toast.success('🟢 Vous êtes de nouveau en ligne', {
        duration: 5000,
        dismissible: true,
      });
    };

    const handleOffline = () => {
      offlineToastId.current = toast.error('🔴 Vous êtes hors ligne', {
        duration: Infinity,
        dismissible: true,
      });
    };

    // Vérifie l'état initial
    if (!navigator.onLine) {
      offlineToastId.current = toast.error('🔴 Vous êtes actuellement hors ligne', {
        duration: Infinity,
        dismissible: true,
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

export default NetworkStatusListener;
