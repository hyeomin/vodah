import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useLoginRequired() {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const checkLoginRequired = (callback?: () => void) => {
    if (!user) {
      setIsModalVisible(true);
      return false;
    }
    callback?.();
    return true;
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return {
    isModalVisible,
    hideModal,
    checkLoginRequired,
  };
} 