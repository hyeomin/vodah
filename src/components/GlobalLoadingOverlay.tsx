import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export function GlobalLoadingOverlay() {
  const { loading } = useAuth();

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={loading}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 